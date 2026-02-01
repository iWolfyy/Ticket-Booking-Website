const Event = require("../models/Event");
const { fetchMovieFromTMDB } = require("../utils/tmdbHandler");
const { fetchArtistDetails } = require("../utils/musicHandler");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Seller/Admin)
/* ======================================================
   CREATE EVENT
====================================================== */
exports.createEvent = async (req, res) => {
  try {
    let { title, category, artistName } = req.body;

    if (!title || !category) {
      return res.status(400).json({ message: "Title and category are required" });
    }

    category = category.toLowerCase();

    if (category === "concert" && !artistName) {
      return res
        .status(400)
        .json({ message: "artistName is required for concerts" });
    }

    // Create event immediately
    const event = await Event.create({
      ...req.body,
      title,
      category,
      bannerImage: req.file ? req.file.path : "",
      seller: req.user._id,
      status: category === "movie" || category === "concert"
        ? "enriching"
        : "published",
    });

    // 🔥 Fire-and-forget enrichment (CRITICAL)
    if (category === "movie" || category === "concert") {
      setImmediate(() => {
        enrichEventBackground(
          event._id,
          title,
          category,
          artistName
        );
      });
    }

    res.status(201).json(event);
  } catch (error) {
    console.error("Create Event Error:", error.message);

    if (error.code === 11000) {
      return res.status(409).json({ message: "Event already exists" });
    }

    res.status(500).json({ message: error.message });
  }
};

/* ======================================================
   BACKGROUND ENRICHMENT
====================================================== */
const enrichEventBackground = async (eventId, title, category, artistName) => {
  try {
    console.log("🚀 Enrichment started:", { title, category, artistName });

    let updateData = {};

    /* ================= MOVIE ================= */
    if (category === "movie") {
      const tmdbData = await fetchMovieFromTMDB(title);
      if (!tmdbData) throw new Error("TMDB returned no data");

      updateData = {
        tmdbId: tmdbData.id,
        rating: tmdbData.vote_average || null,
        description: tmdbData.overview || "",
        posterImage: tmdbData.poster_path
          ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}`
          : "",
        bannerImage: tmdbData.backdrop_path
          ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}`
          : "",
        "metadata.status": tmdbData.status,
        "metadata.runtime": tmdbData.runtime,
        "metadata.budget": tmdbData.budget,
        "metadata.revenue": tmdbData.revenue,
        "metadata.genres": tmdbData.genres?.map(g => g.name) || [],
        "metadata.releaseDate": tmdbData.release_date,
        "metadata.cast":
          tmdbData.credits?.cast?.slice(0, 10).map(c => ({
            name: c.name,
            character: c.character,
            profileImage: c.profile_path
              ? `https://image.tmdb.org/t/p/w185${c.profile_path}`
              : ""
          })) || [],
        "metadata.director":
          tmdbData.credits?.crew?.find(p => p.job === "Director")?.name || "",
        status: "published"
      };

      console.log("🎬 TMDB fetched:", tmdbData.id);
    }

    /* ================= CONCERT ================= */
    else if (category === "concert") {
      const data = await fetchArtistDetails(artistName);
      if (!data) throw new Error("Artist API returned no data");

      updateData = {
        description: data.description || "",
        artistImage: data.bannerImage || "",
        "metadata.discography":
          data.discography?.map(album => ({
            title: album?.title || "Unknown Album",
            year: album?.year || "N/A",
            image: album?.image || ""
          })) || [],
        status: "published"
      };

      console.log("🎤 Artist data fetched:", artistName);
    }

    if (!Object.keys(updateData).length) return;

    await Event.findByIdAndUpdate(eventId, {
      $set: updateData,
      $unset: { "metadata.syncError": "" }
    });

    console.log(`✅ Enrichment complete: ${title}`);
  } catch (err) {
    console.error(`❌ Enrichment failed (${title}):`, err.message);

    await Event.findByIdAndUpdate(eventId, {
      status: "failed",
      "metadata.syncError": err.message
    });
  }
};




// @desc    Get all events (with optional filtering)
// @route   GET /api/events
// @access  Public


exports.getAllEvents = async (req, res) => {
  try {
    const { category, isFeatured } = req.query;
    let query = {};

    // Filter by category if provided in the URL (e.g., ?category=movie)
    if (category) {
      query.category = category;
    }

    // Filter by featured status if provided (e.g., ?isFeatured=true)
    if (isFeatured) {
      query.isFeatured = isFeatured === 'true';
    }

    const events = await Event.find(query).populate("seller", "name email");
    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update event
// @route   PUT /api/events/:id

exports.updateEvent = async (req, res) => {
  try {
    let event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    //Ownership check: Only the seller who created the event or an admin can update it
    if (
      event.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to update this event" });
    }

    event = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete event
// @route   DELETE /api/events/:id

exports.deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }
    //Ownership check: Only the seller who created the event or an admin can delete it
    if (
      event.seller.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this event" });
    }

    await event.deleteOne();
    res.json({ message: "Event removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc Search events by title, artist or album
// @route GET /api/events/search?q=query

exports.searchEvents = async (req, res) => {
    try {
        const { q } = req.query; //Get The Search term from the URL
        if (!q) return res.status(400).json({ message: 'Search Query is Required' });

        const searchRegex = new RegExp(q, 'i'); //'i' makes it case-insensitive

        const results = await Event.find({
            $or: [
                { title: searchRegex },
                { description: searchRegex },
                { category: searchRegex },
                { 'metadata.artists': searchRegex },
                { 'metadata.director': searchRegex },
                { "metadata.cast": searchRegex},
                { "metadata.discography.title": searchRegex } // Searches inside the album list!
            ]

        }).populate('seller', 'name');

        res.json({
            count: results.length,
            results
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


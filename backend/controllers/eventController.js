const Event = require("../models/Event");
const { fetchMovieFromTMDB } = require("../utils/tmdbHandler");
const { fetchArtistDetails } = require("../utils/musicHandler");

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Seller/Admin)
exports.createEvent = async (req, res) => {
  try {
    const { title, category, artistName } = req.body;

    // 1. Immediate Duplication Check
    const eventExists = await Event.findOne({
      title: { $regex: new RegExp(`^${title}$`, "i") },
      seller: req.user._id,
    });
    if (eventExists)
      return res.status(400).json({ message: "Event already exists" });

    // 2. Immediate Creation (Fast response)
    const event = await Event.create({
      ...req.body,
      bannerImage: req.file ? req.file.path : "",
      seller: req.user._id,
      status: category === "movie" ? "enriching" : "published", // Optional status flag
    });

    // 3. Fire and Forget: Background Enrichment
    // We don't use 'await' here so the response sends immediately
    if (category === "movie") {
      enrichEventBackground(event._id, title, category, artistName);
    } else if (category === "concert") {
      enrichEventBackground(event._id, title, category, artistName);
    }

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const enrichEventBackground = async (eventId, title, category, artistName) => {
  try {
    let updateData = {};

    if (category === "movie") {
      const tmdbData = await fetchMovieFromTMDB(title); 
      if (tmdbData) {
        updateData = {
          tmdbId: tmdbData.id,
          rating: tmdbData.vote_average,
          description: tmdbData.overview,
          posterImage: tmdbData.poster_path ? `https://image.tmdb.org/t/p/w500${tmdbData.poster_path}` : "",
          bannerImage: tmdbData.backdrop_path ? `https://image.tmdb.org/t/p/w1280${tmdbData.backdrop_path}` : "",
          "metadata.status": tmdbData.status,
          "metadata.runtime": tmdbData.runtime,
          "metadata.budget": tmdbData.budget,
          "metadata.revenue": tmdbData.revenue,
          "metadata.genres": tmdbData.genres?.map(g => g.name) || [],
          "metadata.releaseDate": tmdbData.release_date,
          "metadata.keywords": tmdbData.keywords?.keywords?.map(k => k.name) || [],
          "metadata.productionCompanies": tmdbData.production_companies?.map(pc => ({
            name: pc.name,
            logo: pc.logo_path ? `https://image.tmdb.org/t/p/w200${pc.logo_path}` : ""
          })) || [],
          "metadata.cast": tmdbData.credits?.cast?.slice(0, 10).map((c) => ({
            name: c.name,
            character: c.character,
            profileImage: c.profile_path ? `https://image.tmdb.org/t/p/w185${c.profile_path}` : ""
          })) || [],
          "metadata.director": tmdbData.credits?.crew?.find((p) => p.job === "Director")?.name || "",
        };
      }
    } 
    
    else if (category === "concert") {
      const data = await fetchArtistDetails(artistName);

      // FIXED: Added check for 'data' and 'discography' to prevent 'undefined' crash
      if (data && data.discography) {
        updateData = {
          description: data.description || "",
          artistImage: data.bannerImage || "",
          artistLogo: data.artistLogo || "",
          // Use optional chaining for each album in the array
          "metadata.discography": data.discography.map(album => ({
            title: album?.title || "Unknown Album",
            year: album?.year || "N/A",
            image: album?.image || ""
          })),
          "metadata.featuringArtists": [], 
        };
      } else {
        console.warn(`Sync Warning: No music data found for "${artistName}"`);
      }
    }

    if (Object.keys(updateData).length > 0) {
      await Event.findByIdAndUpdate(eventId, { $set: updateData });
      console.log(`Sync Complete: ${title}`);
    }
  } catch (err) {
    console.error("Sync Failed:", err.message);
  }
};


// @desc    Get all events
// @route   GET /api/events
// @access  Public

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find().populate("seller", "name email");
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
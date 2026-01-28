const Event = require("../models/Event");
const Venue = require("../models/Venue"); // Assuming you create this
const Show = require("../models/Show");   // Assuming you create this

// @desc    Universal Search across Events, Venues, and Shows
// @route   GET /api/search
// @access  Public

exports.universalSearch = async (req, res) => {
  try {
    const { q } = req.query;
    if (!q) return res.status(400).json({ message: "Query required" });

    const regex = new RegExp(q, 'i');

    // Perform queries in parallel for maximum performance
    const [events, venues, shows] = await Promise.all([
      Event.find({ 
        $or: [{ title: regex }, { "metadata.artists": regex }, { "metadata.discography.title": regex }] 
      }).limit(5),
      
      Venue.find({ 
        $or: [{ name: regex }, { city: regex }, { address: regex }] 
      }).limit(5),
      
      Show.find({ 
        $or: [{ name: regex }, { type: regex }] 
      }).limit(5)
    ]);

    res.json({
      searchTerm: q,
      results: {
        events,
        venues,
        shows,
        totalCount: events.length + venues.length + shows.length
      }
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
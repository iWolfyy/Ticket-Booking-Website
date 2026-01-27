const Venue = require('../models/Venue');

// @desc Creae a new venue
// @Route POST /api/venues
// @access Private (Seller/Admin)

exports.createVenue = async (req, res) => {
    try {
        const { name, city, address, venueType, sections } = req.body;

        //Check if this exact venue already exists in this city

        const venueExists = await Venue.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') }, //case insensitive match
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        });

        if (venueExists) {
            return res.status(400).json({ message: 'Venue with this name already exists in the specified city' });
        }
        
        // Create the venue if no duplicate found

        const venue = await Venue.create({
            name, 
            city, 
            address,
            venueType,
            sections
        });

        res.status(201).json(venue);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get all venues
// @route   GET /api/venues
// @access  Public

exports.getAllVenues = async (req, res) => {
    try {
        const venues = await Venue.find();
        res.json(venues);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
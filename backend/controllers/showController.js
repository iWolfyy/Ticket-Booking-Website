const Show = require('../models/Show');
const Venue = require('../models/Venue');

// @desc    Create a new show
// @route   POST /api/shows
// @access  Private (Seller/Admin)

exports.createShow = async (req, res) => {
    try {
        const { event, venue, startTime, endTime, availability, ticketPrice } = req.body;

        // Check if the venue is already booked for this time
        const conflict = await Show.findOne({
            venue,
            $or: [
                { startTime: { $lte: startTime, $lt: endTime } },
                { startTime: { $gt: startTime, $gte: endTime } }
            ]
        });

        if (conflict) {
            return res.status(400).json({ message: 'Venue is already booked for this time' });
        }

        // Automated Availablity Setup 
        // If the user didnt provide specific section availability,
        // we can pull the layout from the venue model automatically

        let finalAvailability = availability;
        if (!availability) {
            const venueData = await Venue.findById(venue);
            finalAvailability = venueData.sections.map(section => ({
                sectionName: section.name,
                totalSeats: section.totalCapacity || (section.rows * section.seatsPerRow),
                availableSeats: section.totalCapacity || (section.rows * section.seatsPerRow),
                price: ticketPrice, //Default price for all sections
                bookedSeats: []
            }));                
        }   

        const show = await Show.create({
            event,
            venue,
            startTime,
            endTime,
            availability: finalAvailability
        });

        res.status(201).json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get shows for a specific event
// @route   GET /api/shows/event/:eventId
// @access  Public

exports.getEventShows = async (req, res) => {
    try {
        const shows = await Show.find({ event: req.params.eventId })
            .populate('venue', 'name city address venueType')
            .populate('event', 'title category description');
        res.json(shows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

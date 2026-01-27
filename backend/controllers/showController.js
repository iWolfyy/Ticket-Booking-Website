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


// @desc    Update show
// @route   PUT /api/shows/:id
exports.updateShow = async (req, res) => {
    try {
        let show = await Show.findById(req.params.id);

        if (!show) return res.status(404).json({ message: 'Show not found' });

        // 1. Safety Check: Don't allow updates if tickets are already sold
        const hasBookings = show.availability.some(section => section.bookedSeats.length > 0);
        if (hasBookings && (req.body.startTime || req.body.venue)) {
            return res.status(400).json({ 
                message: 'Cannot change time or venue because tickets have already been sold.' 
            });
        }

        // 2. Conflict Check (Only if moving time or venue)
        if (req.body.startTime || req.body.venue) {
            const startTime = req.body.startTime || show.startTime;
            const endTime = req.body.endTime || show.endTime;
            const venue = req.body.venue || show.venue;

            const conflict = await Show.findOne({
                _id: { $ne: req.params.id }, // Don't check against itself
                venue,
                $or: [
                    { startTime: { $lte: startTime }, endTime: { $gte: startTime } },
                    { startTime: { $lte: endTime }, endTime: { $gte: endTime } }
                ]
            });

            if (conflict) {
                return res.status(400).json({ message: 'Venue is already booked for this new time slot.' });
            }
        }

        show = await Show.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        res.json(show);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


// @desc Delete Show
// @route DELETE /api/shows/:id

exports.deleteShow = async (req, res) => {
    try {
        const show = await Show.findById(req.params.id);

        if (!show) return res.status(404).json({ message: 'Show not found' });

        // Safety Check: Check for any bookings
        const hasBookings = show.availability.some(section => section.bookedSeats.length > 0);
        if (hasBookings) {
            return res.status(400).json({
                message: 'Cannot delete show because tickets have already been sold.'
            });
        }

        await show.deleteOne();
        res.json({ message: 'Show removed successfully' }); 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}
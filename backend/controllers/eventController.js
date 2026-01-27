const Event = require('../models/Event');

// @desc   Create a new event
// @Route  POST /api/events
// @access Private (Seller/Admin)

exports.createEvent = async (req, res) => {
    try {
        const { title, description, category, basePrice, metadata } = req.body;

        // Duplicatiion Check: Title + Seller (Case Insensitive)
        const eventExists = await Event.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            seller: req.user._id
        });

        if (eventExists) {
            return res.status(400).json({ message: 'Event with this title already exists' });
        }

        // Create the event if no duplicate found
        const event = await Event.create({
            ...req.body,
            seller: req.user._id //Pulled from 'protect' middleware
        });

        res.status(201).json(event);
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Public

exports.getAllEvents = async (req, res) => {
    try {
        const events = await Event.find().populate('seller', 'name email');
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
            return res.status(404).json({ message: 'Event not found' });
        }

        //Ownership check: Only the seller who created the event or an admin can update it
        if (event.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this event' });
        }

        event = await Event.findByIdandUpdate(req.params.id, req.body, { new: true });
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

            return res.status(404).json({ message: 'Event not found' });
        }
        //Ownership check: Only the seller who created the event or an admin can delete it
        if (event.seller.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to delete this event' });
        }

        await event.remove();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



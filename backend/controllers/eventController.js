const Event = require('../models/Event');

// @desc    Create a new event
// @route   POST /api/events
// @access  Private (Seller/Admin)
exports.createEvent = async (req, res) => {
    try {
        const { title } = req.body;

        // 1. Duplication Check (Case Insensitive)
        const eventExists = await Event.findOne({
            title: { $regex: new RegExp(`^${title}$`, 'i') },
            seller: req.user._id
        });

        if (eventExists) {
            return res.status(400).json({ message: 'An event with this title already exists for your account.' });
        }

        // 2. Handle the Image URL from Cloudinary
        // req.file is populated by the upload.single('bannerImage') middleware
        const bannerImage = req.file ? req.file.path : '';

        // 3. Create the event
        // We spread req.body and manually add the bannerImage and seller
        const event = await Event.create({
            ...req.body,
            bannerImage,
            seller: req.user._id // Pulled from your 'protect' middleware
        });

        res.status(201).json(event);

    } catch (error) {
        // PROFESSIONAL LOGGING: This helps you see the REAL error in your VS Code terminal
        console.log("---------- CREATE EVENT ERROR ----------");
        console.error("Message:", error.message);
        console.error("Stack Trace:", error.stack);
        console.log("----------------------------------------");

        // Send a clean JSON response instead of [object Object]
        res.status(500).json({ 
            message: "Server Error: " + error.message,
            stack: process.env.NODE_ENV === 'development' ? error.stack : null
        });
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

        event = await Event.findByIdAndUpdate(req.params.id, req.body, { new: true });
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

        await event.deleteOne();
        res.json({ message: 'Event removed' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};



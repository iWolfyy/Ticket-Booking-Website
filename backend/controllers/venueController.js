const Venue = require('../models/Venue');

// @desc    Create a new venue
// @route   POST /api/venues
// @access  Private (Seller, Admin, VenueManager)
exports.createVenue = async (req, res) => {
    try {
        // 1. Extract non-file fields from req.body
        const { name, city, address, venueType, description, location } = req.body;
        let { sections } = req.body;

        // 2. Handle 'sections' parsing (Multer sends arrays as strings)
        if (typeof sections === 'string') {
            try {
                sections = JSON.parse(sections);
            } catch (e) {
                return res.status(400).json({ message: "Invalid format for sections array" });
            }
        }

        // 3. Duplicate Check
        const venueExists = await Venue.findOne({
            name: { $regex: new RegExp(`^${name}$`, 'i') },
            city: { $regex: new RegExp(`^${city}$`, 'i') }
        });

        if (venueExists) {
            return res.status(400).json({ message: 'A venue with this name already exists in this city' });
        }

        // 4. Handle Image Uploads
        // Assuming your uploadMiddleware stores files in req.files
        const imageUrls = req.files ? req.files.map(file => file.path) : [];

        // 5. Build Venue Object
        const venueData = {
            name,
            city,
            address,
            venueType,
            description,
            sections,
            images: imageUrls,
            owner: req.user.id, // Populated by 'protect' middleware
        };

        // 6. Handle GeoJSON Location (if provided)
        if (location) {
            // location should be { type: 'Point', coordinates: [lng, lat] }
            venueData.location = typeof location === 'string' ? JSON.parse(location) : location;
        }

        const venue = await Venue.create(venueData);

        res.status(201).json({
            success: true,
            data: venue
        });
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


// @desc    Update venue
// @route   PUT /api/venues/:id
// @access  Private (Owner/Admin)
exports.updateVenue = async (req, res) => {
    try {
        let venue = await Venue.findById(req.params.id);

        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        // 1. Authorization Check
        // Ensure the person updating is the owner or an admin
        if (venue.owner.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized to update this venue' });
        }

        // 2. Prepare Update Data
        const updateData = { ...req.body };

        // 3. Handle Sections if they are being updated
        if (updateData.sections && typeof updateData.sections === 'string') {
            updateData.sections = JSON.parse(updateData.sections);
        }

        // 4. Handle New Image Uploads
        if (req.files && req.files.length > 0) {
            const newImages = req.files.map(file => file.path);
            // Append new images to existing ones, or replace? 
            // Here we append:
            updateData.images = [...venue.images, ...newImages];
        }

        // 5. Execute Update
        venue = await Venue.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: venue
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete venue
// @route   DELETE /api/venues/:id
exports.deleteVenue = async (req, res) => {
    try {
        const venue = await Venue.findById(req.params.id);
        if (!venue) {
            return res.status(404).json({ message: 'Venue not found' });
        }

        await venue.deleteOne();
        res.json({ message: 'Venue removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
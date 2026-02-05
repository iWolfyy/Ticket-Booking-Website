const express = require('express');
const router = express.Router();
const { createVenue, getAllVenues, updateVenue, deleteVenue } = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');

router.route('/')
    .get(getAllVenues)
    // Changed to .array() to match your [String] schema for images
    .post(
        protect, 
        authorize('seller', 'admin', 'venuemanager'), 
        upload.array('images', 10), 
        createVenue
    );

router.route('/:id')
    .put(
        protect, 
        authorize('seller', 'admin', 'venuemanager'), 
        upload.array('images', 10), 
        updateVenue
    )
    .delete(
        protect, 
        authorize('seller', 'admin', 'venuemanager'), 
        deleteVenue
    );

module.exports = router;
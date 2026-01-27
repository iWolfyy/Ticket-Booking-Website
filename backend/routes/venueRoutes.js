const express = require('express');
const router = express.Router();
const { createVenue, getAllVenues } = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')

// Public route to get all venues
    .get(getAllVenues);     

router.route('/')

// Private route to create a new venue (Seller/Admin only)
    .post(protect, authorize('seller', 'admin') , createVenue);

module.exports = router;
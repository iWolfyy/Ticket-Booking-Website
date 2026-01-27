const express = require('express');
const router = express.Router();
const { createVenue, getAllVenues, updateVenue, deleteVenue} = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllVenues)
    .post(protect, authorize('seller', 'admin'), createVenue);

router.route('/:id')
    .put(protect, authorize('seller', 'admin'), updateVenue)
    .delete(protect, authorize('seller', 'admin'), deleteVenue);

module.exports = router;
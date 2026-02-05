const express = require('express');
const router = express.Router();
const { createVenue, getAllVenues, updateVenue, deleteVenue} = require('../controllers/venueController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.route('/')
    .get(getAllVenues)
    .post(protect, authorize('seller', 'admin', 'venuemanager'), createVenue);

router.route('/:id')
    .put(protect, authorize('seller', 'admin', 'venuemanager'), updateVenue)
    .delete(protect, authorize('seller', 'admin', 'venuemanager'), deleteVenue);

module.exports = router;
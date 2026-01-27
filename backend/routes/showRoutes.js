const express = require('express');
const router = express.Router();
const { createShow, getEventShows } = require('../controllers/showController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/', protect, authorize('seller', 'admin'), createShow);
router.get('/event/:eventId', getEventShows);

module.exports = router;
const express = require('express');
const router = express.Router();
const { createBooking, getUserBookings, cancelBooking } = require('../controllers/bookingController');
const { protect } = require('../middleware/authMiddleware');

// Create a new booking
router.post('/', protect, createBooking); //Only logged-in users can book

// Get User Bookings
router.get('/mybookings', protect, getUserBookings);

// Delete a Booking 
router.delete('/:id', protect, cancelBooking);



module.exports = router;

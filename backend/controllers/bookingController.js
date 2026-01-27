const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mongoose = require('mongoose');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
        const { showId, seats, totalAmount } = req.body;

        // 1. Find the show
        const show = await Show.findById(showId).session(session);
        if (!show) throw new Error('Show not found');

        // 2. Update Availability
        for (let requestedSeat of seats) {
            const section = show.availability.find(s => s.sectionName === requestedSeat.section);
            
            if (!section || section.availableSeats < 1) {
                throw new Error(`Section ${requestedSeat.section} is full or does not exist`);
            }

            // Check if specific seat is already booked (for seated venues)
            if (section.bookedSeats.includes(requestedSeat.seatNumber)) {
                throw new Error(`Seat ${requestedSeat.seatNumber} is already taken`);
            }

            // Update the show's availability data
            section.availableSeats -= 1;
            if (requestedSeat.seatNumber !== "GA") {
                section.bookedSeats.push(requestedSeat.seatNumber);
            }
        }

        // 3. Save updated show and create booking
        await show.save({ session });

        const booking = await Booking.create([{
            user: req.user._id,
            show: showId,
            event: show.event,
            seats,
            totalAmount,
            status: 'confirmed', // SHOULD SET THIS TO 'pending' ONCE WE ADD STRIPE!!!!!!!
            qrcode: `QR-${Math.random().toString(36).substr(2, 9).toUpperCase()}`
        }], { session });

        await session.commitTransaction();
        session.endSession();

        res.status(201).json(booking);
    } catch (error) {
        await session.abortTransaction();
        session.endSession();
        res.status(400).json({ message: error.message });
    }
};


//@desc Get logged in user bookings
//@route Get /api/bookings/mybookings

exports.getUserBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ user: req.user._id })
            .populate({
                path: 'show',
                // Fix: Populate 'venue' (the location), not 'event' inside the show
                populate: { path: 'venue', select: 'name city address' } 
            })
            // This populates the main Event details for the ticket
            .populate('event', 'title category bannerImage');

        res.json(bookings);
    } catch (error) {
        res.status(500).json({ message: "Error fetching bookings", error: error.message });
    }
};

// @desc Cancel a Booking
// @route DELETE /api/bookings/:id

exports.cancelBooking = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id);

        if (!booking) return res.status(404).json({ message: "Booking not found" });

        //Ensure user owns the booking
        if (booking.user.toString() !== req.user._id.toString()) {
            return res.status(401).json({ message: "not Authorized" });
        }

        //Logic: Restore seat availability in the Show model before deleting
        const show = await Show.findById(booking.show);
        if (show) {
            booking.seats.forEach(bookedSeat => {
                const section = show.availability.find(s => s.sectionName === bookedSeat.section);
                if (section) { 
                    section.availableSeats += 1;
                    section.bookedSeats = section.bookedSeats.filter(s => s !== bookedSeat.seatNumber);
                }
            });
            await show.save();
        }
    
        await booking.deleteOne();
        res.json({ message: "Booking Cancelled and seats released" });
    } catch (error) {
        res.status(500).json({ message: "Error cancelling booking", error });
    }
};



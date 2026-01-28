const Booking = require('../models/Booking');
const Show = require('../models/Show');
const mongoose = require('mongoose');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (User)
exports.createBooking = async (req, res) => {
    const session = await mongoose.startSession();
    // Start the transaction
    session.startTransaction();

    try {
        const { showId, seats, totalAmount } = req.body;

        const show = await Show.findById(showId).session(session);
        if (!show) throw new Error('Show not found');

        // [Your Seat Availability Logic here]

        await show.save({ session });

        // Stripe Integration
        const paymentIntent = await stripe.paymentIntents.create({
            amount: totalAmount * 100,
            currency: 'lkr',
            metadata: { userId: req.user._id.toString(), showId }
        });

        const booking = await Booking.create([{
            user: req.user._id,
            show: showId,
            event: show.event,
            seats,
            totalAmount,
            status: 'pending', 
            paymentIntentId: paymentIntent.id
        }], { session });

        // Commit everything
        await session.commitTransaction();
        
        // Response AFTER successful commit
        res.status(201).json({
            booking: booking[0],
            clientSecret: paymentIntent.client_secret 
        });

    } catch (error) {
        // Only abort if the transaction was actually started and not committed
        if (session.inTransaction()) {
            await session.abortTransaction();
        }
        res.status(400).json({ message: error.message });
    } finally {
        // Always end the session
        session.endSession();
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


// @desc    Verify QR Code and check-in user
// @route   PATCH /api/bookings/verify/:id
exports.verifyTicket = async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.id)
            .populate('user', 'name')
            .populate('event', 'title');

        if (!booking) {
            return res.status(404).json({ success: false, message: "Ticket not found" });
        }

        if (booking.status !== 'confirmed') {
            return res.status(400).json({ success: false, message: "Payment not confirmed" });
        }

        if (booking.isUsed) {
            return res.status(400).json({ 
                success: false, 
                message: `Ticket already scanned at ${booking.usedAt}` 
            });
        }

        // Mark as scanned
        booking.isUsed = true;
        booking.usedAt = new Date();
        await booking.save();

        res.json({
            success: true,
            message: `Welcome, ${booking.user.name}!`,
            event: booking.event.title
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};


const cron = require('node-cron');
const booking = require('../models/Booking');
const Show = require('../models/Show');

// Run Every 15 Minutes
cron.schedule('*/15 * * * *', async () => {
    console.log('--- Running Seat Cleanup Job ---');

    try {
        const expirationTime = new Date(Date.now() - 15 * 60 * 1000); //15 Minutes Ago

        // Find pending bookings that haven't been paid in 15 minutes
        const expiredBookings = await booking.find({
            status: 'pending',
            createdAt: { $lt: expirationTime }
        });

        if (expiredBookings.length === 0) return;

        for (let booking of expiredBookings) {
            const show = await Show.findById(booking.show);
            if (show) {
                booking.seats.forEach(bookedSeat => {
                    const section = show.availability.find(s => s.sectionName === bookedSeat.section);
                    if (section) {
                        section.availableSeats += 1;
                        section.bookedSeats = section.bookedSeats.filter(seat => seat !== bookedSeat.seatNumber);
                    }
                });
                await show.save();
            }

            //Mark the booking as failed or delete it 
            booking.status = 'failed';
            await booking.save();
            console.log(`Released seats for expired booking ${booking._id}`);
        }
    } catch (error) {
        console.error('Error during Seat Cleanup Job:', error.message);
    }
});
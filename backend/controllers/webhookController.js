const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Booking = require('../models/Booking');
const QRCode = require('qrcode'); // Now this will work!

exports.handleStripeWebhook = async (req, res) => {
    
    const sig = req.headers['stripe-signature'];

    // DEBUG: Log this to see if the payload is actually arriving
    console.log("Payload Length:", req.body ? req.body.length : "EMPTY");

    let event;

    try {
        // Use the RAW body (req.body) directly here
        event = stripe.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (err) {
        console.error("Signature Verification Failed:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // After constructEvent, 'event' is a proper Object
    if (event.type === 'payment_intent.succeeded') {
        const paymentIntent = event.data.object;
        const booking = await Booking.findOne({ paymentIntentId: paymentIntent.id });
        
        if (booking) {
            // Generate the QR image as a Base64 string
            const qrImage = await QRCode.toDataURL(booking._id.toString());
            
            booking.status = 'confirmed';
            booking.qrcode = qrImage; 
            await booking.save();
            console.log(`✅ Booking ${booking._id} Confirmed & QR Generated!`);
        }
    }

    res.json({ received: true });
};
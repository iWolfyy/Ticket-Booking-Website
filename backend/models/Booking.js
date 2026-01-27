const BookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  show: { type: mongoose.Schema.Types.ObjectId, ref: 'Show', required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event' }, // Denormalized for fast history lookups
  
  seats: [{
    section: String,
    seatNumber: String // "GA" if standing
  }],
  
  totalAmount: { type: Number, required: true },
  paymentIntentId: String, // Stripe/Razorpay ID
  status: { type: String, enum: ['pending', 'confirmed', 'failed'], default: 'pending' },
  qrcode: String // For entry scanning
}, { timestamps: true });

module.exports = mongoose.model('Booking', BookingSchema);
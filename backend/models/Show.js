const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  event: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  venue: { type: mongoose.Schema.Types.ObjectId, ref: 'Venue', required: true },
  startTime: { type: Date, required: true },
  endTime: { type: Date },
  
  // Real-time Availability
  // For Cinema/Theatre: Array of specific seats
  // For Sports/Concerts: Map of remaining capacity per section
  availability: [{
    sectionId: mongoose.Schema.Types.ObjectId,
    sectionName: String,
    totalSeats: Number,
    availableSeats: Number, // For standing areas, just decrement this
    price: Number,
    bookedSeats: [String] // e.g., ["A1", "A2"] // Array of seat IDs like ["A1", "A2"]
  }],
  
  status: { type: String, enum: ['scheduled', 'cancelled', 'sold-out'], default: 'scheduled' }
});

module.exports = mongoose.model('Show', ShowSchema);
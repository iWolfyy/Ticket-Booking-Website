const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },
  address: { type: String, required: true },
  venueType: { type: String, enum: ['cinema', 'stadium', 'club', 'theatre'] },
  
  // Define layout (Sections or Screens)
  sections: [{
    name: { type: String, required: true }, // e.g., "Screen 1" or "North Stand"
    rows: Number,             // For seated venues
    seatsPerRow: Number,      // For seated venues
    totalCapacity: Number,    // For standing/GA areas
    isStanding: { type: Boolean, default: false }
  }]
});

module.exports = mongoose.model('Venue', VenueSchema);
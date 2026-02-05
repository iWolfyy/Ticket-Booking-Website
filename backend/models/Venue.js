const mongoose = require('mongoose');

const VenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true, index: true },
  address: { type: String, required: true },
  owner: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User', 
  required: true,
  index: true 
},
  venueType: { type: String, enum: ['cinema', 'stadium', 'club', 'theatre'] },
  images: [String],
  description: String,
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' },
  },

  
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
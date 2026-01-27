const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  category: { 
    type: String, 
    enum: ['movie', 'concert', 'sports', 'theatre'], 
    required: true 
  },
  bannerImage: String,
  trailerUrl: String, // Mostly for movies/theater
  basePrice: { type: Number, required: true },
  
  seller: { 
  type: mongoose.Schema.Types.ObjectId, 
  ref: 'User', 
  required: true 
},
  
  // Type-specific data
  
  metadata: {
    artists: [String],        // Concerts
    teams: {                  // Sports
      home: String,
      away: String
    },
    cast: [String],           // Movies/Theatre
    director: String,         // Movies
    league: String            // Sports (e.g., NBA, IPL)
  },
  
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
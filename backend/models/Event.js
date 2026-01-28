const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  title: { type: String, required: true, index: true },
  description: { type: String },
  category: { 
    type: String, 
    enum: ['movie', 'concert', 'sports', 'theatre'], 
    required: true 
  },
  bannerImage: String,
  trailerUrl: String, 
  basePrice: { type: Number, required: true },
  
  // External API IDs
  tmdbId: { type: String, default: null }, 
  spotifyId: { type: String, default: null }, // Link to Spotify Artist
  rating: { type: Number, default: 0 },

  seller: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  
  metadata: {
    // Concert Specific
    artists: [String],        
    discography: [{           // New: Store albums with titles and release years
      title: String,
      year: String,
      image: String
    }],
    
    // Sports Specific
    teams: { home: String, away: String },
    league: String,

    // Movies/Theatre Specific
    cast: [String],           
    director: String
  },
  
  isFeatured: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model('Event', EventSchema);
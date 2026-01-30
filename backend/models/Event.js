const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
    artistName: { type: String },        // Added: Primary artist name for display and API fetching
    description: { type: String },
    category: {
      type: String,
      enum: ["movie", "concert", "sports", "theatre"],
      required: true,
    },
    bannerImage: String,
    posterImage: String,
    artistImage: String,
    trailerUrl: String,
    basePrice: { type: Number, required: true },

    // External API IDs
    tmdbId: { type: String, default: null },
    spotifyId: { type: String, default: null }, 
    rating: { type: Number, default: 0 },

    seller: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    metadata: {
      // Concert Specific Extensions
      artists: [String],          // Full lineup/supporting acts
      discography: [
        {
          title: String,
          year: String,
          image: String,
        },
      ],

      // General TMDB/Theatrical Extensions
      status: String, 
      runtime: Number,
      budget: Number,
      revenue: Number,
      genres: [String],
      releaseDate: Date,
      contentRating: String,
      keywords: [String],
      
      productionCompanies: [
        {
          name: String,
          logo: String,
        }
      ],

      cast: [
        {
          name: String,
          character: String,
          profileImage: String,
          biography: String,
        }
      ],

      crew: [
        {
          name: String,
          job: String,
          profileImage: String,
        }
      ],

      // Sports Specific
      teams: { home: String, away: String },
      league: String,
      
      director: String, 
    },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
const mongoose = require("mongoose");

const EventSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, index: true },
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
      // General TMDB/Theatrical Extensions
      status: String,             // e.g., "Released", "In Production"
      runtime: Number,            // In minutes
      budget: Number,             // Financials
      revenue: Number,            // Financials
      genres: [String],           // Array of genres
      releaseDate: Date,          // Regional release date
      contentRating: String,      // e.g., "PG-13", "R"
      keywords: [String],         // Metadata tags for search
      
      // Production Companies
      productionCompanies: [
        {
          name: String,
          logo: String,           // Logo URL from TMDB
        }
      ],

      // Advanced Cast List (With Bios and Roles)
      cast: [
        {
          name: String,
          character: String,
          profileImage: String,
          biography: String,      // Actor Bios
        }
      ],

      // Advanced Crew List
      crew: [
        {
          name: String,
          job: String,            // e.g., "Director", "Producer"
          profileImage: String,
        }
      ],

      // Concert Specific
      artists: [String],
      discography: [
        {
          title: String,
          year: String,
          image: String,
        },
      ],

      // Sports Specific
      teams: { home: String, away: String },
      league: String,
      
      // Keep legacy fields for backward compatibility if needed
      director: String, 
    },

    isFeatured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Event", EventSchema);
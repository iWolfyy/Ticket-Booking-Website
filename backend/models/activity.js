// backend/models/Activity.js
const mongoose = require('mongoose');

const activitySchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { 
    type: String, 
    enum: ['event', 'announcement', 'booking', 'system'], 
    required: true 
  },
  title: { type: String, required: true },
  description: { type: String },
  link: { type: String }, // e.g., "/events/123"
  isRead: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Activity', activitySchema);
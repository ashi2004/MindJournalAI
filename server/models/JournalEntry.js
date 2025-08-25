const mongoose = require('mongoose');

const JournalEntrySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  entryDate: {
    type: Date,
    default: Date.now,
  },
  mood: {
    type: String,
    // enum: ['happy', 'sad', 'angry', 'neutral','drained', 'anxious', 'excited', 'calm'],
    default: 'neutral',
  },
  text: {
    type: String,
    required: true,
    maxlength: 5000,
  },
  sentiment: {
    type: String, // e.g., 'positive', 'negative', 'neutral' (will be added later)
  },
  themes: [String], // key themes (will be added later)
  calmingMessage: { type: String, default: "Take some time to breathe and relax." },
  emoji: { type: String, default: "🙂" },
  recommendations: {
  type: [
    {
      title: String,
      description: String,
      url: String,
    }
  ],
  default: [],
},

}, { timestamps: true });

module.exports = mongoose.model('JournalEntry', JournalEntrySchema);

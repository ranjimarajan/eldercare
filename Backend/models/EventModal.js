const mongoose = require('mongoose');



const socialEventSchema = new mongoose.Schema({
    name: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

const SocialEvent = mongoose.model('SocialEvent', socialEventSchema);

module.exports = SocialEvent;

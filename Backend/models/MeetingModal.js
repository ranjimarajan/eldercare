const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  meetingTitle: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: String,
    required: true
  },
  time: {
    type: String,
    required: true
  },
  duration: {
    type: String,
    required: true
  },
  participants: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['Scheduled', 'Completed', 'Cancelled'],
    default: 'Scheduled'
  }
}, {
  timestamps: true // Automatically add createdAt and updatedAt fields
});

const Meeting = mongoose.model('Meeting', meetingSchema);

module.exports = Meeting;

const mongoose = require("mongoose");

// Define Schema
const feedBack = new mongoose.Schema({
    feedback: {
    type: String,
    required: true,
  },
  milestoneDate: {
    type: String,
    required: true,
  },
  milestoneTitle: {
    type: String,
  },
  selectedProjectId: {
    type: String,
    required: true,
  },
});

// Create Model
const feedBackS = mongoose.model("feedBack", feedBack);

module.exports = { feedBackS };

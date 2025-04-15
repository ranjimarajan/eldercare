const mongoose = require("mongoose");

// Define Schema
const careGiverSchema = new mongoose.Schema({
  Name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  place: {
    type: String,
  },
  password: {
    type: String,
    required: true,
  },
});

// Create Model
const careGiverModel = mongoose.model("careGiver", careGiverSchema);

module.exports = { careGiverModel };

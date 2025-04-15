const mongoose = require("mongoose");

// Define Schema
const DocsShmema = new mongoose.Schema({
    title: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  cid: {
    type: String,
  }
});

// Create Model
const docsModal = mongoose.model("docs", DocsShmema);

module.exports = { docsModal };

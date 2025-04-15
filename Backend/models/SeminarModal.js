const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Project Assignment Schema
const SeminarSchema = new Schema({
    title: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  date: {
    type: String,
    required: [true, 'GitHub repository URL is required'],
  },
  venue: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  },
  type: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  }
}, { timestamps: true });





// Create and export the model
const Seminar = mongoose.model('SeminarSchema', SeminarSchema);

module.exports = Seminar;
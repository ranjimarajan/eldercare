const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Define the Project Assignment Schema
const projectAssignmentSchema = new Schema({
  projectName: {
    type: String,
    required: [true, 'Project name is required'],
    trim: true
  },
  githubRepo: {
    type: String,
    required: [true, 'GitHub repository URL is required'],
  },
  selectedNurse1: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  },
  selectedNurse2: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  },
  selectedNurse3: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  }, selectedNurse4: {
    type: String,
    ref: 'Nurse', // This assumes your nurse/student model is named 'Nurse'
    required: [true, 'Student assignment is required']
  },
  status: {
    type: String,
    enum: ['started', 'in-progress', 'completed', 'cancelled'],
    default: 'started'
  },
  guid:{
    type: String,
    default:"not Selected"
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });





// Create and export the model
const ProjectAssignment = mongoose.model('ProjectAssignment', projectAssignmentSchema);

module.exports = ProjectAssignment;
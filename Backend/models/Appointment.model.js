const mongoose = require("mongoose");

const appointmentSchema = mongoose.Schema({
  userType: {
    type: String,
    default: "patient",
  },

  patientID: {
    type: Number,
  },

  patientName: {
    type: String,
  },

  mobile: {
    type: Number,
  },
  
  email: {
    type: String,
  },

  address: {
    type: String,
  },

  disease: {
    type: String,
  },

  department: {
    type: String,
  },

  time: {
    type: String,
  },

  date: {
    type: String,
  },

  age: {
    type: Number,
    required: true,
  },

  gender: {
    type: String,
    required: true,
  },
  payment:{
    type:String,
    default:"10000"
  }
});

const AppointmentModel = mongoose.model("appointment", appointmentSchema);

module.exports = { AppointmentModel };

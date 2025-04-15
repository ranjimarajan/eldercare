const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  name: { type: String, required: true },
  time: { type: String, required: true },
  category: { type: String, required: true },
  notes: { type: String },
  priority: { type: String, enum: ['low', 'normal', 'high'], default: 'normal' },
  helpNeeded: { type: Boolean, default: false },
  email: { type: String, required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

module.exports = Task;

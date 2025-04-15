import React, { useState } from 'react';
import './task.css';

function TaskForm() {
  const [taskName, setTaskName] = useState('');
  const [taskTime, setTaskTime] = useState('');
  const [taskCategory, setTaskCategory] = useState('medication');
  const [taskNotes, setTaskNotes] = useState('');
  const [taskPriority, setTaskPriority] = useState('normal');
  const [helpNeeded, setHelpNeeded] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || 'Unknown';

    const taskData = {
      name: taskName,
      time: taskTime,
      category: taskCategory,
      notes: taskNotes,
      priority: taskPriority,
      helpNeeded,
      email: userEmail
    };

    try {
      const response = await fetch('http://localhost:5000/nurses/addTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(taskData)
      });

      const result = await response.json();
      console.log('API Response:', result);
    } catch (error) {
      console.error('Error:', error);
    }

    // Reset form after submission
    setTaskName('');
    setTaskTime('');
    setTaskCategory('medication');
    setTaskNotes('');
    setTaskPriority('normal');
    setHelpNeeded(false);
  };

  return (
    <div className="task-form-container">
      <h2 className="task-form-heading">Add New Task</h2>
      
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="taskName" className="form-label">
            What do you need to do?
          </label>
          <input
            type="text"
            id="taskName"
            value={taskName}
            onChange={(e) => setTaskName(e.target.value)}
            className="form-input"
            placeholder="Example: Take medication"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskTime" className="form-label">
            When do you need to do this?
          </label>
          <input
            type="time"
            id="taskTime"
            value={taskTime}
            onChange={(e) => setTaskTime(e.target.value)}
            className="form-input"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="taskCategory" className="form-label">
            What type of task is this?
          </label>
          <select
            id="taskCategory"
            value={taskCategory}
            onChange={(e) => setTaskCategory(e.target.value)}
            className="form-select"
          >
            <option value="medication">Medication</option>
            <option value="appointment">Appointment</option>
            <option value="exercise">Exercise</option>
            <option value="meal">Meal</option>
            <option value="social">Social Activity</option>
            <option value="household">Household Chore</option>
            <option value="other">Other</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">How important is this task?</label>
          <div className="form-radio-group">
            <div className="radio-option">
              <input
                type="radio"
                id="priorityLow"
                name="priority"
                value="low"
                checked={taskPriority === 'low'}
                onChange={() => setTaskPriority('low')}
                className="form-radio"
              />
              <label htmlFor="priorityLow" className="radio-label">Not urgent</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="priorityNormal"
                name="priority"
                value="normal"
                checked={taskPriority === 'normal'}
                onChange={() => setTaskPriority('normal')}
                className="form-radio"
              />
              <label htmlFor="priorityNormal" className="radio-label">Normal</label>
            </div>
            <div className="radio-option">
              <input
                type="radio"
                id="priorityHigh"
                name="priority"
                value="high"
                checked={taskPriority === 'high'}
                onChange={() => setTaskPriority('high')}
                className="form-radio"
              />
              <label htmlFor="priorityHigh" className="radio-label">Very important</label>
            </div>
          </div>
        </div>

        <div className="form-group">
          <div className="checkbox-group">
            <input
              type="checkbox"
              id="helpNeeded"
              checked={helpNeeded}
              onChange={(e) => setHelpNeeded(e.target.checked)}
              className="form-checkbox"
            />
            <label htmlFor="helpNeeded" className="checkbox-label">
              I need help with this task
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="taskNotes" className="form-label">Any notes or reminders?</label>
          <textarea
            id="taskNotes"
            value={taskNotes}
            onChange={(e) => setTaskNotes(e.target.value)}
            rows="3"
            className="form-textarea"
            placeholder="Example: Take with food"
          />
        </div>

        <button type="submit" className="submit-button">Add Task</button>
      </form>
    </div>
  );
}

export default TaskForm;

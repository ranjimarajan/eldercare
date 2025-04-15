import React, { useState, useEffect } from 'react';
import './taskView.css';

function Task() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchTasks = async () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const userEmail = user?.email || 'Unknown';

      try {
        const response = await fetch('http://localhost:5000/nurses/getAllTask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: userEmail })
        });

        const result = await response.json();
        setTasks(result.tasks || []);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };

    fetchTasks();
  }, []);

  // Toggle task completion status
  const toggleCompleted = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  // Delete a task
  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  // Get category icon or color
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'medication':
        return '💊';
      case 'appointment':
        return '📅';
      case 'exercise':
        return '🚶';
      case 'meal':
        return '🍽️';
      case 'social':
        return '👪';
      case 'household':
        return '🏠';
      default:
        return '📝';
    }
  };

  // Get priority display
  const getPriorityDisplay = (priority) => {
    switch (priority) {
      case 'high':
        return '⚠️ Very Important';
      case 'normal':
        return 'Normal';
      case 'low':
        return 'Not Urgent';
      default:
        return 'Normal';
    }
  };

  return (
    <div className="task-list-container">
      <h2 className="task-list-heading">My Tasks</h2>
      
      {tasks.length === 0 ? (
        <div className="no-tasks-message">
          No tasks scheduled. Add a new task to get started.
        </div>
      ) : (
        <div className="task-table-container">
          <table className="task-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Task</th>
                <th>Time</th>
                <th>Category</th>
                <th>Priority</th>
                <th>Help</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className={task.completed ? 'task-completed' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={task.completed}
                      onChange={() => toggleCompleted(task.id)}
                      className="task-checkbox"
                      aria-label={`Mark ${task.name} as ${task.completed ? 'incomplete' : 'complete'}`}
                    />
                  </td>
                  <td className="task-name-cell">
                    <div className="task-name">{task.name}</div>
                    {task.notes && <div className="task-notes">{task.notes}</div>}
                  </td>
                  <td>{task.time}</td>
                  <td>
                    <span className="category-icon">{getCategoryIcon(task.category)}</span>
                    {task.category.charAt(0).toUpperCase() + task.category.slice(1)}
                  </td>
                  <td className={`priority-${task.priority}`}>
                    {getPriorityDisplay(task.priority)}
                  </td>
                  <td>
                    {task.helpNeeded ? 'Yes' : 'No'}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task.id)}
                      aria-label={`Delete ${task.name}`}
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Task;

import React, { useState, useEffect } from 'react';
import './taskView.css';

function Task() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  // Fetch all tasks
  const fetchTasks = async () => {
    setLoading(true);
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || 'Unknown';

    try {
      const response = await fetch('http://localhost:5000/nurses/getAllTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: userEmail })
      });

      const result = await response.json();
      // Ensure each task has a unique ID
      const tasksWithIds = (result.tasks || []).map((task, index) => {
        // Use the task's existing ID if available, otherwise use the index as a fallback
        return { ...task, id: task.id || task._id || `task-${index}` };
      });
      setTasks(tasksWithIds);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  // Toggle task completion status
  const toggleCompleted = async (taskId, currentStatus) => {
    // Get the user email for the API call
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || 'Unknown';
    
    // Find the task with the provided ID
    const taskToUpdate = tasks.find(task => task.id === taskId || task._id === taskId);
    
    if (!taskToUpdate) {
      console.error('Task not found with ID:', taskId);
      return;
    }
    
    // Get the MongoDB _id if available, otherwise use the current ID
    const mongoId = taskToUpdate._id || taskId;
    
    // Calculate the new status
    const newStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    
    // Update the local state first for immediate UI feedback
    setTasks(prevTasks => prevTasks.map(task => 
      (task.id === taskId || task._id === taskId) 
        ? { ...task, status: newStatus, completed: newStatus === 'completed' } 
        : task
    ));
    
    // Call the API to update the task status
    try {
      const response = await fetch('http://localhost:5000/nurses/updateStatus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          id: mongoId,
          email: userEmail
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to update task status:', result.message);
        // Revert the state if the server update fails
        setTasks(prevTasks => prevTasks.map(task => 
          (task.id === taskId || task._id === taskId) 
            ? { ...task, status: currentStatus, completed: currentStatus === 'completed' } 
            : task
        ));
      } else {
        console.log('Task status updated successfully:', result);
      }
    } catch (error) {
      console.error('Error updating task status:', error);
      // Revert the state if the API call fails
      setTasks(prevTasks => prevTasks.map(task => 
        (task.id === taskId || task._id === taskId) 
          ? { ...task, status: currentStatus, completed: currentStatus === 'completed' } 
          : task
      ));
    }
  };

  // Delete a task
  const deleteTask = async (taskId) => {
    // Get the user email for the API call
    const user = JSON.parse(localStorage.getItem('user'));
    const userEmail = user?.email || 'Unknown';
    
    // Find the task with the provided ID to get the MongoDB _id if available
    const taskToDelete = tasks.find(task => task.id === taskId || task._id === taskId);
    if (!taskToDelete) {
      console.error('Task not found with ID:', taskId);
      return;
    }
    
    // Get the MongoDB _id if available, otherwise use the current ID
    const mongoId = taskToDelete._id || taskId;
    
    // Update local state first for immediate UI feedback
    setTasks(prevTasks => prevTasks.filter(task => task.id !== taskId && task._id !== taskId));
    
    // Call the API to delete the task
    try {
      const response = await fetch('http://localhost:5000/nurses/deleteTask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          taskId: mongoId,
          email: userEmail
        })
      });
      
      const result = await response.json();
      
      if (!response.ok) {
        console.error('Failed to delete task:', result.message);
        // Refresh the task list if deletion fails
        fetchTasks();
      } else {
        console.log('Task deleted successfully:', result);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // Refresh the task list if deletion fails
      fetchTasks();
    }
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

  // Format the status text for display
  const formatStatus = (status) => {
    if (!status) return 'Pending';
    return status.charAt(0).toUpperCase() + status.slice(1);
  };

  if (loading) {
    return <div className="loading">Loading tasks...</div>;
  }

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
                <th>Current Status</th>
                <th>Help</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr 
                  key={task._id || task.id} 
                  className={task.status === 'completed' || task.completed ? 'task-completed' : ''}
                >
                  <td>
                    <input
                      type="checkbox"
                      checked={task.status === 'completed' || !!task.completed}
                      onChange={() => toggleCompleted(task._id || task.id, task.status || (task.completed ? 'completed' : 'pending'))}
                      className="task-checkbox"
                      aria-label={`Mark ${task.name} as ${task.status === 'completed' || task.completed ? 'incomplete' : 'complete'}`}
                    />
                  </td>
                  <td className="task-name-cell">
                    <div className="task-name">{task.name}</div>
                    {task.notes && <div className="task-notes">{task.notes}</div>}
                  </td>
                  <td>{task.time}</td>
                  <td>
                    <span className="category-icon">{getCategoryIcon(task.category)}</span>
                    {task.category ? task.category.charAt(0).toUpperCase() + task.category.slice(1) : 'Other'}
                  </td>
                  <td className={`priority-${task.priority}`}>
                    {getPriorityDisplay(task.priority)}
                  </td>
                  <td className={`status-${task.status || 'pending'}`}>
                    {formatStatus(task.status)}
                  </td>
                  <td>
                    {task.helpNeeded ? 'Yes' : 'No'}
                  </td>
                  <td>
                    <button
                      className="delete-button"
                      onClick={() => deleteTask(task._id || task.id)}
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
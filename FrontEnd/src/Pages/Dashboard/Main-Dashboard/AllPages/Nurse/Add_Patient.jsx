import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './add.css'; // Import the CSS file
import Sidebar from '../../GlobalFiles/Sidebar';

const NurseSelectionForm = () => {
  // Form state
  const [formData, setFormData] = useState({
    projectName: '',
    githubRepo: '',
    selectedNurse1: '',
    selectedNurse2: '',
    selectedNurse3: '',
    status: 'started' // Default status as required
  });
  
  // State for nurses/students data from API
  const [nurses, setNurses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  // Fetch nurses data and get logged in user on component mount
  useEffect(() => {
    // Get logged in user from localStorage
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.email) {
      setLoggedInUser(user);
    }

    const fetchNurses = async () => {
      try {
        setLoading(true);
        const response = await axios.get('http://localhost:5000/nurses');
        setNurses(response.data);
        console.log(response, "nurses data");
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch nurses data. Please try again later.');
        setLoading(false);
        console.error('Error fetching nurses:', err);
      }
    };

    fetchNurses();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      // Create submission payload
      const submissionData = {
        projectName: formData.projectName,
        githubRepo: formData.githubRepo,
        selectedNurse1: formData.selectedNurse1,
        selectedNurse2: formData.selectedNurse2,
        selectedNurse3: formData.selectedNurse3,
        selectedNurse4: loggedInUser?.email || '',
        status: formData.status
      };
      
      console.log('Form data to be submitted:', submissionData);
      
      const response = await axios.post('http://localhost:5000/project/create', submissionData);
      console.log('Server response:', response);
      
      alert('Project assignment submitted successfully!');
      
      // Reset form after successful submission
      setFormData({
        projectName: '',
        githubRepo: '',
        selectedNurse1: '',
        selectedNurse2: '',
        selectedNurse3: '',
        status: 'started'
      });
      
    } catch (err) {
      console.error('Error submitting form:', err);
      alert('Failed to submit project assignment. Please try again.');
    }
  };

  return (
    <>
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="form-container">
          <h2 className="form-title">Project Assignment Form</h2>
          
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            {/* Project Name Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="projectName">
                Project Name
              </label>
              <input
                type="text"
                id="projectName"
                name="projectName"
                value={formData.projectName}
                onChange={handleChange}
                className="form-input"
                required
              />
            </div>
            
            {/* GitHub Repo Field */}
            <div className="form-group">
              <label className="form-label" htmlFor="githubRepo">
                GitHub Repository URL
              </label>
              <input
                type="url"
                id="githubRepo"
                name="githubRepo"
                value={formData.githubRepo}
                onChange={handleChange}
                className="form-input"
                placeholder="https://github.com/username/repo"
                required
              />
            </div>
            
            {/* Student 1 Select Box */}
            <div className="form-group">
              <label className="form-label" htmlFor="selectedNurse1">
                Student 1
              </label>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Loading students...</span>
                </div>
              ) : (
                <select
                  id="selectedNurse1"
                  name="selectedNurse1"
                  value={formData.selectedNurse1}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>Select a student</option>
                  {Array.isArray(nurses) && nurses.length > 0 ? (
                    nurses.map((nurse) => (
                      <option key={`nurse1-${nurse._id}`} value={nurse._id}>
                        {nurse.email}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No students available</option>
                  )}
                </select>
              )}
            </div>
            
            {/* Student 2 Select Box */}
            <div className="form-group">
              <label className="form-label" htmlFor="selectedNurse2">
                Student 2
              </label>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Loading students...</span>
                </div>
              ) : (
                <select
                  id="selectedNurse2"
                  name="selectedNurse2"
                  value={formData.selectedNurse2}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>Select a student</option>
                  {Array.isArray(nurses) && nurses.length > 0 ? (
                    nurses.map((nurse) => (
                      <option key={`nurse2-${nurse._id}`} value={nurse._id}>
                        {nurse.email}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No students available</option>
                  )}
                </select>
              )}
            </div>
            
            {/* Student 3 Select Box */}
            <div className="form-group">
              <label className="form-label" htmlFor="selectedNurse3">
                Student 3
              </label>
              {loading ? (
                <div className="loading-spinner">
                  <div className="spinner"></div>
                  <span>Loading students...</span>
                </div>
              ) : (
                <select
                  id="selectedNurse3"
                  name="selectedNurse3"
                  value={formData.selectedNurse3}
                  onChange={handleChange}
                  className="form-select"
                  required
                >
                  <option value="" disabled>Select a student</option>
                  {Array.isArray(nurses) && nurses.length > 0 ? (
                    nurses.map((nurse) => (
                      <option key={`nurse3-${nurse._id}`} value={nurse._id}>
                        {nurse.email}
                      </option>
                    ))
                  ) : (
                    <option value="" disabled>No students available</option>
                  )}
                </select>
              )}
            </div>
            
            {/* Logged in user as Student 4 (display only) */}
            <div className="form-group">
              <label className="form-label">
                Student 4 (You)
              </label>
              <div className="status-display">
                {loggedInUser?.email || 'Not logged in'}
              </div>
            </div>
            
            {/* Status Field - Hidden as it's set by default */}
            <input
              type="hidden"
              name="status"
              value={formData.status}
            />
            <div className="form-group">
              <label className="form-label">
                Status
              </label>
              <div className="status-display">
                Started (Default)
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              className="submit-button"
            >
              Submit
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default NurseSelectionForm;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './CareGiverRegister.css';

function CareGiverRegister() {
  const [formData, setFormData] = useState({
    Name: '',
    email: '',
    place: '',
    password: '',
    confirmPassword: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (error) setError('');
  };
  
  const validateForm = () => {
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return false;
    }
    
    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    // Remove confirmPassword before sending to API
    const apiData = {...formData};
    delete apiData.confirmPassword;
    
    try {
      const response = await axios.post('http://localhost:5000/admin/addCareGiver', apiData);
      console.log(response, "response from care reg");
      setLoading(false);
      navigate('/CareGiverLogin');
    } catch (error) {
      console.error('Error registering caregiver:', error);
      setError(error.response?.data?.message || 'Error registering caregiver. Please try again.');
      setLoading(false);
    }
  };
  
  return (
    <div className="registration-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo">
            <span className="logo-icon">👨‍⚕️</span>
          </div>
          <h2>Caregiver Registration</h2>
          <p>Create an account to start providing care</p>
        </div>
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="register-form">
          <div className="form-group">
            <label htmlFor="name">Full Name</label>
            <div className="input-wrapper">
              <span className="input-icon">👤</span>
              <input 
                id="name"
                type="text" 
                name="Name" 
                placeholder="Enter your full name" 
                value={formData.Name} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <div className="input-wrapper">
              <span className="input-icon">✉️</span>
              <input 
                id="email"
                type="email" 
                name="email" 
                placeholder="Enter your email" 
                value={formData.email} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="place">Location</label>
            <div className="input-wrapper">
              <span className="input-icon">📍</span>
              <input 
                id="place"
                type="text" 
                name="place" 
                placeholder="Enter your location" 
                value={formData.place} 
                onChange={handleChange}
                required 
              />
            </div>
          </div>
          
          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                id="password"
                type="password" 
                name="password" 
                placeholder="Create a password" 
                value={formData.password} 
                onChange={handleChange} 
                required 
              />
            </div>
            <span className="helper-text">Must be at least 6 characters</span>
          </div>
          
          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <div className="input-wrapper">
              <span className="input-icon">🔒</span>
              <input 
                id="confirmPassword"
                type="password" 
                name="confirmPassword" 
                placeholder="Confirm your password" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                required 
              />
            </div>
          </div>
          
          <div className="terms-container">
            <label className="terms-checkbox">
              <input type="checkbox" required /> 
              <span>I agree to the <a href="/terms">Terms of Service</a> and <a href="/privacy">Privacy Policy</a></span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className={`register-btn ${loading ? 'loading' : ''}`}
            disabled={loading}
          >
            {loading ? 'Registering...' : 'Create Account'}
          </button>
        </form>
        
        <div className="login-link">
          Already have an account? <a href="/CareGiverLogin">Login Now</a>
        </div>
      </div>
    </div>
  );
}

export default CareGiverRegister;
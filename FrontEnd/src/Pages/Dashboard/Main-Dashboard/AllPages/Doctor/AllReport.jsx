import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
// import { GetAllSeminars, AddSeminar } from "../../../../../Redux/Datas/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./SeminarManagement.css";

const SeminarManagement = () => {
  const dispatch = useDispatch();
  const [seminars, setSeminars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    date: "",
    venue: "",
    type: "seminar" // Default value
  });

  useEffect(() => {
    loadSeminars();
  }, []);

  const loadSeminars = () => {
    // For future implementation:
    // dispatch(GetAllSeminars()).then((res) => {
    //   setSeminars(res);
    // });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Log the submitted data
    console.log("Submitted Seminar Data:", formData);
    
    setLoading(true);
    setError(null);
    
    try {
      // Send data to the API endpoint
      const response = await fetch('http://localhost:5000/project/SeminarAdd', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`API responded with status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log("API Response:", data);
      
      // Reset form after successful submission
      setFormData({
        title: "",
        date: "",
        venue: "",
        type: "seminar"
      });
      
      // Optionally refresh the seminars list
      loadSeminars();
      
    } catch (err) {
      console.error("Error submitting seminar data:", err);
      setError(err.message || "Failed to submit seminar data");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="container">
        <Sidebar />
        
        {/* ************************************ */}
        
        <div className="AfterSideBar">
          <div className="Payment_Page">
            <h1 style={{ marginBottom: "2rem" }}>Seminar Management</h1>
            
            {/* Seminar Form */}
            <div className="seminarForm">
              <h2>Add New Seminar</h2>
              {error && <div className="error-message" style={{ color: 'red', marginBottom: '1rem' }}>{error}</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="title">Seminar Title</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="date">Date</label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="venue">Venue</label>
                  <input
                    type="text"
                    id="venue"
                    name="venue"
                    value={formData.venue}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="type">Type</label>
                  <select
                    id="type"
                    name="type"
                    value={formData.type}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="seminar">Seminar</option>
                    <option value="workshop">Workshop</option>
                  </select>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-btn"
                  disabled={loading}
                >
                  {loading ? "Submitting..." : "Add Seminar"}
                </button>
              </form>
            </div>
            
            {/* Seminars List */}
            <div className="seminarList">
              <h2>All Seminars</h2>
              <div className="patientBox">
                <table>
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Date</th>
                      <th>Venue</th>
                      <th>Type</th>
                    </tr>
                  </thead>
                  <tbody>
                    {seminars?.map((seminar, index) => {
                      return (
                        <tr key={index}>
                          <td>{seminar.title}</td>
                          <td>{new Date(seminar.date).toLocaleDateString()}</td>
                          <td>{seminar.venue}</td>
                          <td>{seminar.type}</td>
                        </tr>
                      );
                    })}
                    {seminars?.length === 0 && (
                      <tr>
                        <td colSpan="4" style={{ textAlign: 'center' }}>No seminars found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SeminarManagement;
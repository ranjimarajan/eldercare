import React, { useState, useEffect } from 'react';
import Sidebar from '../../GlobalFiles/Sidebar';

function Book_Appointment() {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Fetch events from the API
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const response = await fetch('http://localhost:5000/project/getAllSeminars');
        
        if (!response.ok) {
          throw new Error('Failed to fetch events');
        }
        
        const data = await response.json();
        setEvents(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching events:', err);
        setError(err.message || 'Failed to load events');
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  // Function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <div className="events-container">
      <Sidebar />
      
      <div className="events-content">
        <h1>Events Schedule</h1>
        
        {loading && <div className="loading-spinner">Loading events...</div>}
        
        {error && <div className="error-message">Error: {error}</div>}
        
        {!loading && !error && (
          <div className="events-table-container">
            <table className="events-table">
              <thead>
                <tr>
                  <th>Title</th>
                  <th>Date</th>
                  <th>Venue</th>
                  <th>Type</th>
                  {/* <th>Actions</th> */}
                </tr>
              </thead>
              <tbody>
                {events.length > 0 ? (
                  events.map((event, index) => (
                    <tr key={event._id || index}>
                      <td>{event.title}</td>
                      <td>{formatDate(event.date)}</td>
                      <td>{event.venue}</td>
                      <td>
                        <span className={`event-type ${event.type.toLowerCase()}`}>
                          {event.type}
                        </span>
                      </td>
                      {/* <td>
                        <button className="view-btn">View</button>
                        <button className="edit-btn">Edit</button>
                      </td> */}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="no-events">
                      No events found. Please add some events.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      <style jsx>{`
        .events-container {
          display: flex;
          width: 100%;
          min-height: 100vh;
          background-color: #f5f7fa;
        }
        
        .events-content {
          flex: 1;
          padding: 2rem;
        }
        
        h1 {
          color: #333;
          margin-bottom: 2rem;
          font-size: 2rem;
        }
        
        .events-table-container {
          background-color: white;
          border-radius: 8px;
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }
        
        .events-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .events-table th {
          background-color: #f5f7fa;
          padding: 1rem;
          text-align: left;
          font-weight: 600;
          color: #555;
          border-bottom: 2px solid #eee;
        }
        
        .events-table td {
          padding: 1rem;
          border-bottom: 1px solid #eee;
        }
        
        .events-table tr:hover {
          background-color: #f9f9f9;
        }
        
        .event-type {
          display: inline-block;
          padding: 0.3rem 0.8rem;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 500;
        }
        
        .event-type.seminar {
          background-color: #e3f2fd;
          color: #1565c0;
        }
        
        .event-type.workshop {
          background-color: #e8f5e9;
          color: #2e7d32;
        }
        
        .view-btn, .edit-btn {
          padding: 0.5rem 1rem;
          margin-right: 0.5rem;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: 500;
          transition: background-color 0.2s;
        }
        
        .view-btn {
          background-color: #e3f2fd;
          color: #1565c0;
        }
        
        .view-btn:hover {
          background-color: #bbdefb;
        }
        
        .edit-btn {
          background-color: #fff8e1;
          color: #ff8f00;
        }
        
        .edit-btn:hover {
          background-color: #ffecb3;
        }
        
        .loading-spinner {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        .error-message {
          padding: 1rem;
          background-color: #ffebee;
          color: #c62828;
          border-radius: 4px;
          margin-bottom: 1rem;
        }
        
        .no-events {
          text-align: center;
          padding: 2rem;
          color: #666;
        }
        
        @media (max-width: 768px) {
          .events-content {
            padding: 1rem;
          }
          
          .events-table th,
          .events-table td {
            padding: 0.75rem;
          }
          
          .view-btn, .edit-btn {
            padding: 0.4rem 0.8rem;
            font-size: 0.9rem;
          }
        }
      `}</style>
    </div>
  );
}

export default Book_Appointment;
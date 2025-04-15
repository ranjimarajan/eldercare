import React, { useState } from 'react';
import './AddSocialEvents.css';

function AddSocialEvents() {
  const [eventName, setEventName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eventData = {
      name: eventName,
      date: eventDate,
      time: eventTime,
      location,
      description,
    };
        console.log(eventData)
    try {
      const response = await fetch('http://localhost:5000/nurses/addEvent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(eventData),
      });

      const data = await response.json();
      console.log('Event added:', data);
      alert('Event added successfully');
    } catch (error) {
      console.error('Error adding event:', error);
    }

    // Reset form
    setEventName('');
    setEventDate('');
    setEventTime('');
    setLocation('');
    setDescription('');
  };

  return (
    <div className="event-form-container">
      <h2>Add  Medical Events</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Event Medical Event</label>
          <input type="text" value={eventName} onChange={(e) => setEventName(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Date:</label>
          <input type="date" value={eventDate} onChange={(e) => setEventDate(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Time:</label>
          <input type="time" value={eventTime} onChange={(e) => setEventTime(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Location:</label>
          <input type="text" value={location} onChange={(e) => setLocation(e.target.value)} required />
        </div>

        <div className="form-group">
          <label>Description:</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows="4" required></textarea>
        </div>

        <button type="submit" className="submit-button">Add Event</button>
      </form>
    </div>
  );
}

export default AddSocialEvents;
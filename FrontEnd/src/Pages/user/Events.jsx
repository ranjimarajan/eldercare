import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Event.css';

function Events() {
  const [events, setEvents] = useState([]);
  const [animatedCards, setAnimatedCards] = useState([]);

  // Fetch events from API
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/nurses/getEvent');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      const animatedIds = [];
      events.forEach((event, index) => {
        setTimeout(() => {
          animatedIds.push(event._id);
          setAnimatedCards([...animatedIds]);
        }, index * 200);
      });
    }, 300);

    return () => clearTimeout(timer);
  }, [events]);

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'exercise': return '🧘‍♂️';
      case 'education': return '📚';
      case 'entertainment': return '🎬';
      case 'social': return '👪';
      case 'hobby': return '🌱';
      default: return '📅';
    }
  };

  return (
    <div className="events-container">
      <h2 className="events-heading">Upcoming  Programs</h2>
      {events.length === 0 ? (
        <p>No events available at the moment.</p>
      ) : (
        <div className="events-scroll-container">
          <div className="events-row">
            {events.map(event => (
              <div key={event._id} className={`event-card ${animatedCards.includes(event._id) ? 'animated' : ''}`}>
                <div className="event-category-icon">{getCategoryIcon(event.name)}</div>
                <h3 className="event-title">{event.name}</h3>
                <div className="event-details">
                  <div className="event-detail">📍 {event.location}</div>
                  {/* <div className="event-detail">📅 {event.date}</div> */}
                  <div className="event-detail">⏰ {event.date}</div>
                  {event.instructor && <div className="event-detail">👤 {event.instructor}</div>}
                  <div className="event-detail">💲 Free To all</div>
                </div>
                <p className="event-description">{event.description}</p>
                <div className="event-footer">
                  {event.registrationRequired ? (
                    <div className="registration-badge">Registration Required</div>
                  ) : (
                    <div className="open-badge">Open to All</div>
                  )}
                  {/* <button className="details-button">View Details</button> */}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Events;

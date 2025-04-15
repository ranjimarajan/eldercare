import React, { useState, useEffect } from "react";
import { BiTime, BiCheck, BiX } from "react-icons/bi";
import { BsCalendarCheck, BsPeople, BsClock } from "react-icons/bs";
import { FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdOutlineVideoCameraFront } from "react-icons/md";
import Sidebar from "../../GlobalFiles/Sidebar";
import "./CSS/ScheduledMeetingd.css";
import axios from "axios";

const ScheduledMeetings = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        // Get user email from localStorage
        const user = JSON.parse(localStorage.getItem('user'));
        const email = user?.email;
        
        if (!email) {
          setError("User email not found. Please login again.");
          setLoading(false);
          return;
        }

        // Make API call to fetch meetings
        const response = await axios.post('http://localhost:5000/project/Mymeetings', { email });
        setMeetings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching meetings:", err);
        setError("Failed to fetch meetings. Please try again later.");
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  // Function to determine meeting status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case "active":
        return <span className="status-badge status-active">Active</span>;
      case "upcoming":
        return <span className="status-badge status-upcoming">Upcoming</span>;
      case "completed":
        return <span className="status-badge status-completed">Completed</span>;
      default:
        return <span className="status-badge">Unknown</span>;
    }
  };

  // Function to handle joining a meeting
  const handleJoinMeeting = (meeting) => {
    window.open("http://localhost:3001/", "_blank");
  };

  if (loading) {
    return (
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="meetings-container">
            <div className="loading-indicator">Loading meetings...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="meetings-container">
            <div className="error-message">{error}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <div className="meetings-container">
          <div className="meetings-header">
            <h1>
              <BsCalendarCheck className="header-icon" /> Scheduled Meetings
            </h1>
            <div className="meeting-stats">
              <div className="stat-item">
                <FaVideo className="stat-icon active" />
                <span>Active: {meetings.filter(m => m.status === "active").length}</span>
              </div>
              <div className="stat-item">
                <BsClock className="stat-icon upcoming" />
                <span>Upcoming: {meetings.filter(m => m.status === "upcoming").length}</span>
              </div>
              <div className="stat-item">
                <BiCheck className="stat-icon completed" />
                <span>Completed: {meetings.filter(m => m.status === "completed").length}</span>
              </div>
            </div>
          </div>

          {meetings.length === 0 ? (
            <div className="no-meetings-message">
              No meetings found. Schedule a meeting to get started.
            </div>
          ) : (
            <div className="meetings-table-container">
              <table className="meetings-table">
                <thead>
                  <tr>
                    <th>Meeting Title</th>
                    <th>Date</th>
                    <th>Time</th>
                    <th>Duration</th>
                    <th>Participants</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {meetings.map((meeting) => (
                    <tr key={meeting.id} className={`meeting-row ${meeting.status}`}>
                      <td>
                        <div className="meeting-title">
                          {meeting.status === "active" ? (
                            <MdOutlineVideoCameraFront className="title-icon active-icon" />
                          ) : meeting.status === "completed" ? (
                            <FaVideoSlash className="title-icon" />
                          ) : (
                            <FaVideo className="title-icon" />
                          )}
                          {meeting.meetingTitle}
                        </div>
                      </td>
                      <td>{meeting.date}</td>
                      <td>{meeting.time}</td>
                      <td>{meeting.duration}</td>
                      <td>
                        <div className="participants-cell">
                          <BsPeople className="participants-icon" />
                          <span>{meeting.participants}</span>
                        </div>
                      </td>
                      <td>{getStatusBadge(meeting.status)}</td>
                      <td>
                        {meeting.status === "Completed" ? (
                          <button 
                            className="join-now-btn"
                            onClick={() => handleJoinMeeting(meeting)}
                          >
                            Join Now
                          </button>
                        ) : meeting.status === "upcoming" ? (
                          <button 
                            className="details-btn"
                            onClick={() => alert(`Details for meeting: ${meeting.title}`)}
                          >
                            Details
                          </button>
                        ) : (
                          <button 
                            className="view-btn"
                            onClick={() => alert(`View recording: ${meeting.title}`)}
                          >
                            View
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScheduledMeetings;
import React, { useState } from "react";
import Sidebar from "../../GlobalFiles/Sidebar";
import axios from "axios";
import './dis.css';

const MeetingScheduler = () => {
  const [meetingTitle, setMeetingTitle] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [duration, setDuration] = useState("");
  const [participants, setParticipants] = useState("");
  const [status, setStatus] = useState("Scheduled");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newMeeting = {
      meetingTitle,
      date,
      time,
      duration,
      participants,
      status,
    };

    try {
      const response = await axios.post(
        "http://localhost:5000/project/meetingAdd",
        newMeeting
      );

      if (response.status === 201) {
        alert("Meeting scheduled successfully!");

        // Clear the form after submission
        setMeetingTitle("");
        setDate("");
        setTime("");
        setDuration("");
        setParticipants("");
        setStatus("Scheduled");
      }
    } catch (error) {
      console.error("Error scheduling meeting:", error);
      alert("Failed to schedule meeting. Try again later.");
    }
  };

  return (
    <>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div className="meeting-form-container">
          <h2>Schedule a Meeting</h2>
          <form onSubmit={handleSubmit} className="meeting-form">
            <div className="form-group">
              <label>Meeting Title</label>
              <input
                type="text"
                value={meetingTitle}
                onChange={(e) => setMeetingTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Date</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Time</label>
              <input
                type="time"
                value={time}
                onChange={(e) => setTime(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (in minutes)</label>
              <input
                type="number"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Participants</label>
              <input
                type="text"
                value={participants}
                onChange={(e) => setParticipants(e.target.value)}
                placeholder="Separate emails by commas"
                required
              />
            </div>

            <div className="form-group">
              <label>Status</label>
              <select value={status} onChange={(e) => setStatus(e.target.value)}>
                <option value="Scheduled">Scheduled</option>
                <option value="Completed">Completed</option>
                <option value="Cancelled">Cancelled</option>
              </select>
            </div>

            <button type="submit" className="submit-btn">
              Schedule Meeting
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default MeetingScheduler;

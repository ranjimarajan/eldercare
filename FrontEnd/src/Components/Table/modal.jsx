import React from 'react';

function Modal({ isOpen, onClose, onSave, feedback, setFeedback, milestoneDate, setMilestoneDate, milestoneTitle, setMilestoneTitle }) {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Update Project Details</h2>
        <div className="modal-body">
          <label>Feedback</label>
          <textarea 
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            placeholder="Enter feedback"
          />
          
          <label>Milestone Title</label>
          <input 
            type="text"
            value={milestoneTitle}
            onChange={(e) => setMilestoneTitle(e.target.value)}
            placeholder="Enter milestone title"
          />

          <label>Next Milestone Date</label>
          <input 
            type="date"
            value={milestoneDate}
            onChange={(e) => setMilestoneDate(e.target.value)}
          />
        </div>
        <div className="modal-footer">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onSave}>Save</button>
        </div>
      </div>
    </div>
  );
}

export default Modal;

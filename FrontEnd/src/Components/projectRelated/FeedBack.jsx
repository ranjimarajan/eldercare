import React from 'react';
import './FeedBack.css';

function FeedBack({ feedBacks }) {
  return (
    <div className="feedback-container">
      {feedBacks && feedBacks.length > 0 ? (
        feedBacks.map((feedback, index) => (
          <div className="feedback-card" key={index}>
            <div className="feedback-header">
              <div className='milestone'> <h2>{feedback.milestoneTitle}</h2>
                  </div>
                  <span className="date">
  <h2 className="deadline-title">
    <i className="fas fa-hourglass-half fa-spin" style={{marginRight: '8px', color: '#ff7700'}}></i>
    Deadline
    <i className="fas fa-calendar-alt" style={{marginLeft: '8px', color: '#ff7700'}}></i>
  </h2>
  <div className="deadline-date-container">
    <span className="deadline-date-text" style={{
      animation: 'pulse 2s infinite',
      display: 'inline-block',
      fontWeight: 'bold',
      color: '#ff3300',
      padding: '5px 10px',
      borderRadius: '4px',
      background: 'rgba(255, 230, 230, 0.7)',
      boxShadow: '0 0 5px rgba(255, 0, 0, 0.3)'
    }}>
      {new Date(feedback.milestoneDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })}
    </span>
  </div>
  <style jsx>{`
    @keyframes pulse {
      0% { transform: scale(1); }
      50% { transform: scale(1.05); }
      100% { transform: scale(1); }
    }
    .deadline-title {
      display: flex;
      align-items: center;
      margin-bottom: 5px;
      color: #d32f2f;
      font-size: 1.2rem;
    }
    .deadline-date-container {
      display: flex;
      justify-content: center;
    }
  `}</style>
</span>
            </div>
            <div className="feedback-content">
                  <h2>Feedback from Guid</h2>
              <p style={{color:"green"}}>{feedback.feedback || 'No feedback provided'}</p>
            </div>
            <div className="feedback-footer">
              <span style={{color:"red"}}>Project ID: {feedback.selectedProjectId}</span>
            </div>
          </div>
        ))
      ) : (
        <div className="no-feedback">No feedback available</div>
      )}
    </div>
  );
}

export default FeedBack;

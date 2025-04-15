import React, { useState, useEffect } from 'react';

function AudioCall() {
  const [callStatus, setCallStatus] = useState('idle'); // idle, calling, connected, ended
  const [ringAudio, setRingAudio] = useState(null);
  const [callAudio, setCallAudio] = useState(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [timer, setTimer] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isFullScreen, setIsFullScreen] = useState(false);

  // Initialize audio on component mount
  useEffect(() => {
    // Create audio objects
    const ringSound = new Audio('/ring.mp3'); // Replace with your ring sound
    const callSound = new Audio('/call.mp3'); // Replace with your call sound
    
    ringSound.loop = true;
    setRingAudio(ringSound);
    setCallAudio(callSound);
    
    // Cleanup function
    return () => {
      if (ringSound) ringSound.pause();
      if (callSound) callSound.pause();
      if (timer) clearInterval(timer);
    };
  }, []);

  // Handle call timer
  useEffect(() => {
    if (callStatus === 'connected') {
      const interval = setInterval(() => {
        setElapsedTime(prev => prev + 1);
      }, 1000);
      setTimer(interval);
      return () => clearInterval(interval);
    } else if (timer) {
      clearInterval(timer);
      setTimer(null);
    }
  }, [callStatus]);

  // Format time for display (mm:ss)
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  // Handle starting a call
  const startCall = () => {
    setCallStatus('calling');
    setIsOpen(true);
    if (ringAudio) {
      ringAudio.currentTime = 0;
      ringAudio.play().catch(e => console.error("Could not play ring sound:", e));
    }
  };

  // Handle answering a call
  const answerCall = () => {
    if (ringAudio) ringAudio.pause();
    setCallStatus('connected');
    setElapsedTime(0);
    setIsFullScreen(true);
    if (callAudio) {
      callAudio.currentTime = 0;
      callAudio.play().catch(e => console.error("Could not play call sound:", e));
    }
  };

  // Handle ending a call
  const endCall = () => {
    if (ringAudio) ringAudio.pause();
    if (callAudio) callAudio.pause();
    setCallStatus('ended');
    setIsFullScreen(false);
    setTimeout(() => {
      setCallStatus('idle');
      setIsOpen(false);
    }, 2000);
  };

  // Handle minimizing fullscreen call
  const minimizeCall = () => {
    setIsFullScreen(false);
  };

  // Handle maximizing call to fullscreen
  const maximizeCall = () => {
    if (callStatus === 'connected') {
      setIsFullScreen(true);
    }
  };

  // Handle closing the popup
  const closePopup = () => {
    if (callStatus === 'connected' || callStatus === 'calling') {
      endCall();
    } else {
      setIsOpen(false);
    }
  };

  // Trigger popup open
  const openPopup = () => {
    setIsOpen(true);
  };

  return (
    <div className="audio-call-wrapper">
      {/* Button to open the call popup */}
      {!isOpen && (
        <button 
          onClick={openPopup}
          className="open-call-button"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
          </svg>
          Open Call Center
        </button>
      )}

      {/* Overlay for fullscreen effect */}
      {isOpen && (
        <div className={`call-overlay ${isFullScreen ? 'fullscreen' : 'popup'}`}>
          <div className="call-popup">
            {/* Popup Header */}
            <div className="popup-header">
              <h2 className="call-title">Caregiver Call Center</h2>
              {callStatus === 'connected' && !isFullScreen && (
                <button onClick={maximizeCall} className="maximize-button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                  </svg>
                </button>
              )}
              {isFullScreen && (
                <button onClick={minimizeCall} className="minimize-button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 3v3a2 2 0 01-2 2H3m18 0h-3a2 2 0 01-2-2V3m0 18v-3a2 2 0 012-2h3M3 16h3a2 2 0 012 2v3" />
                  </svg>
                </button>
              )}
              {callStatus !== 'connected' && (
                <button onClick={closePopup} className="close-button">
                  <svg xmlns="http://www.w3.org/2000/svg" className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>

            {/* Call Status Display */}
            <div className={`status-display ${isFullScreen ? 'fullscreen-status' : ''}`}>
              {callStatus === 'idle' && (
                <p className="status-text idle">Ready to connect with patient</p>
              )}
              {callStatus === 'calling' && (
                <p className="status-text calling">Calling patient...</p>
              )}
              {callStatus === 'connected' && (
                <div>
                  <p className="status-text connected">Connected</p>
                  <p className="timer-text">{formatTime(elapsedTime)}</p>
                  {isFullScreen && (
                    <div className="avatar-container">
                      <div className="avatar">
                        <svg xmlns="http://www.w3.org/2000/svg" className="avatar-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 11c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z" />
                        </svg>
                      </div>
                      <p className="avatar-name">Patient Name</p>
                    </div>
                  )}
                </div>
              )}
              {callStatus === 'ended' && (
                <p className="status-text ended">Call ended</p>
              )}
            </div>
            
            {/* Call Controls */}
            <div className="call-controls">
              {callStatus === 'idle' && (
                <button 
                  onClick={startCall}
                  className="call-button start-call"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  Call Patient
                </button>
              )}
              
              {callStatus === 'calling' && (
                <div className="button-group">
                  <button 
                    onClick={answerCall}
                    className="call-button answer-call"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    Answer (Demo)
                  </button>
                  <button 
                    onClick={endCall}
                    className="call-button end-call"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                    End Call
                  </button>
                </div>
              )}
              
              {callStatus === 'connected' && (
                <div className={`connected-controls ${isFullScreen ? 'fullscreen-controls' : ''}`}>
                  <button className="call-button mute-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                    </svg>
                    Mute
                  </button>
                  
                  <button 
                    onClick={endCall}
                    className="call-button end-call"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2M5 3a2 2 0 00-2 2v1c0 8.284 6.716 15 15 15h1a2 2 0 002-2v-3.28a1 1 0 00-.684-.948l-4.493-1.498a1 1 0 00-1.21.502l-1.13 2.257a11.042 11.042 0 01-5.516-5.517l2.257-1.128a1 1 0 00.502-1.21L9.228 3.683A1 1 0 008.279 3H5z" />
                    </svg>
                    End Call
                  </button>
                  
                  <button className="call-button speaker-button">
                    <svg xmlns="http://www.w3.org/2000/svg" className="call-icon" viewBox="0 0 24 24" stroke="currentColor" fill="none">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                    </svg>
                    Speaker
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        /* Audio Call Styles */
        .audio-call-wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }

        /* Button to open the call popup */
        .open-call-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          background-color: #4caf50;
          color: white;
          border: none;
          border-radius: 8px;
          padding: 12px 20px;
          font-size: 16px;
          cursor: pointer;
          box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
          transition: all 0.2s ease;
        }

        .open-call-button:hover {
          background-color: #45a049;
          transform: translateY(-2px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
        }

        .call-icon {
          width: 20px;
          height: 20px;
        }

        /* Call Overlay */
        .call-overlay {
          position: fixed;
          z-index: 1000;
          transition: all 0.3s ease;
        }

        .call-overlay.popup {
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          width: 400px;
          height: auto;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
          border-radius: 12px;
        }

        .call-overlay.fullscreen {
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: #121212;
        }

        /* Call Popup */
        .call-popup {
          background-color: white;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          overflow: hidden;
          border-radius: inherit;
        }

        .fullscreen .call-popup {
          border-radius: 0;
          background-color: #121212;
          color: white;
        }

        /* Popup Header */
        .popup-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 16px;
          border-bottom: 1px solid #e0e0e0;
        }

        .fullscreen .popup-header {
          border-bottom: 1px solid #333;
          background-color: #1a1a1a;
        }

        .call-title {
          margin: 0;
          font-size: 18px;
          font-weight: 600;
          color: #333;
        }

        .fullscreen .call-title {
          color: white;
        }

        .close-button, .maximize-button, .minimize-button {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background-color 0.2s;
        }

        .close-button:hover, .maximize-button:hover, .minimize-button:hover {
          background-color: rgba(0, 0, 0, 0.1);
        }

        .fullscreen .close-button:hover, 
        .fullscreen .maximize-button:hover, 
        .fullscreen .minimize-button:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }

        .icon {
          width: 20px;
          height: 20px;
          stroke: #555;
        }

        .fullscreen .icon {
          stroke: white;
        }

        /* Status Display */
        .status-display {
          padding: 20px;
          text-align: center;
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        .fullscreen-status {
          flex-grow: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 40px 20px;
        }

        .status-text {
          font-size: 18px;
          margin-bottom: 8px;
        }

        .status-text.idle {
          color: #757575;
        }

        .status-text.calling {
          color: #ff9800;
          animation: pulse 1.5s infinite;
        }

        .status-text.connected {
          color: #4caf50;
        }

        .fullscreen .status-text.connected {
          color: #6dff76;
        }

        .status-text.ended {
          color: #f44336;
        }

        .timer-text {
          font-size: 24px;
          font-weight: 600;
          margin-top: 4px;
          color: #333;
        }

        .fullscreen .timer-text {
          color: white;
          font-size: 32px;
        }

        /* Avatar in fullscreen mode */
        .avatar-container {
          margin-top: 30px;
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .avatar {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: #333;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 16px;
        }

        .avatar-icon {
          width: 80px;
          height: 80px;
          stroke: white;
        }

        .avatar-name {
          font-size: 24px;
          font-weight: 500;
          color: white;
        }

        /* Call Controls */
        .call-controls {
          padding: 20px;
          display: flex;
          justify-content: center;
          border-top: 1px solid #e0e0e0;
        }

        .fullscreen .call-controls {
          border-top: 1px solid #333;
          background-color: #1a1a1a;
          padding: 30px 20px;
        }

        .button-group {
          display: flex;
          gap: 10px;
        }

        .connected-controls {
          display: flex;
          gap: 10px;
          justify-content: center;
          width: 100%;
        }

        .fullscreen-controls {
          justify-content: space-around;
          max-width: 500px;
        }

        .call-button {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding: 12px 20px;
          border: none;
          border-radius: 50px;
          font-size: 16px;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .start-call {
          background-color: #4caf50;
          color: white;
        }

        .start-call:hover {
          background-color: #45a049;
        }

        .answer-call {
          background-color: #4caf50;
          color: white;
        }

        .answer-call:hover {
          background-color: #45a049;
        }

        .end-call {
          background-color: #f44336;
          color: white;
        }

        .end-call:hover {
          background-color: #d32f2f;
        }

        .mute-button, .speaker-button {
          background-color: #333;
          color: white;
        }

        .fullscreen .mute-button, 
        .fullscreen .speaker-button {
          background-color: #444;
        }

        .mute-button:hover, .speaker-button:hover {
          background-color: #555;
        }

        /* Animation */
        @keyframes pulse {
          0% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
          100% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

export default AudioCall;
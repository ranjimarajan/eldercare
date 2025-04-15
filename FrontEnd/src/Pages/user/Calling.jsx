import React, { useState, useRef, useEffect } from 'react';

function Calling() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCalling, setIsCalling] = useState(false);
  const [stream, setStream] = useState(null);
  const [recording, setRecording] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [countdown, setCountdown] = useState(null);
  const [cameraError, setCameraError] = useState(null);
  
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const recordedChunksRef = useRef([]);
  const modalRef = useRef(null);
  
  // Open the modal popup
  const openEmergencyModal = () => {
    setIsModalOpen(true);
    setCameraError(null);
  };
  
  // Close the modal popup and cleanup
  const closeEmergencyModal = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
    setIsModalOpen(false);
    setIsCalling(false);
    setStream(null);
    setRecording(null);
    setIsRecording(false);
    setCountdown(null);
    setCameraError(null);
  };
  
  // Handle click outside modal to close it
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target) && !isCalling) {
        closeEmergencyModal();
      }
    };
    
    if (isModalOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isModalOpen, isCalling]);
  
  // Function to start emergency call
  const startEmergencyCall = async () => {
    try {
      // Reset any previous error
      setCameraError(null);
      
      // Request access to camera and microphone
      const mediaStream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: true 
      });
      
      // Set the stream to state
      setStream(mediaStream);
      setIsCalling(true);
      
      // Connect stream to video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        
        // Set up event listener to confirm video is playing
        videoRef.current.onloadedmetadata = () => {
          videoRef.current.play().catch(e => {
            console.error("Error playing video:", e);
            setCameraError("Error displaying video feed. Please try again.");
          });
        };
      }
      
      // Start countdown
      let count = 5;
      setCountdown(count);
      
      const timer = setInterval(() => {
        count -= 1;
        setCountdown(count);
        
        if (count <= 0) {
          clearInterval(timer);
          startRecording(mediaStream);
        }
      }, 1000);
      
    } catch (err) {
      console.error("Error accessing media devices:", err);
      setCameraError(`Camera access error: ${err.message || "Please check permissions"}`);
      setIsCalling(false);
    }
  };
  
  // Function to start recording
  const startRecording = (mediaStream) => {
    recordedChunksRef.current = [];
    
    try {
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorderRef.current = mediaRecorder;
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          recordedChunksRef.current.push(event.data);
        }
      };
      
      mediaRecorder.onstop = () => {
        const recordedBlob = new Blob(recordedChunksRef.current, { type: 'video/webm' });
        setRecording(URL.createObjectURL(recordedBlob));
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error("Error starting recording:", err);
      setCameraError(`Recording error: ${err.message}`);
    }
  };
  
  // Function to stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      try {
        mediaRecorderRef.current.stop();
        setIsRecording(false);
      } catch (err) {
        console.error("Error stopping recording:", err);
      }
    }
  };
  
  // Function to end call
  const endCall = () => {
    if (isRecording) {
      stopRecording();
    }
    
    if (stream) {
      stream.getTracks().forEach(track => {
        try {
          track.stop();
        } catch (err) {
          console.error("Error stopping track:", err);
        }
      });
    }
    
    setIsCalling(false);
    setStream(null);
    setCountdown(null);
  };
  
  // Clean up resources when component unmounts
  useEffect(() => {
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => {
          try {
            track.stop();
          } catch (err) {
            console.error("Error stopping track on unmount:", err);
          }
        });
      }
    };
  }, [stream]);
  
  // Effect to ensure video element is properly set up when stream changes
  useEffect(() => {
    if (stream && videoRef.current) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);
  
  // Function to trigger emergency call modal
  const videoCall = () => {
    try {
      openEmergencyModal();
    } catch (error) {
      console.error("Error opening emergency call:", error);
    }
  };

  return (
    <div className="emergency-calling-wrapper">
      {/* Emergency Call Button */}
      <button 
        className="emergency-trigger-button"
        onClick={videoCall}
      >
        Emergency Call
      </button>
      
      {/* Modal Popup */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content" ref={modalRef}>
            <div className="modal-header">
              <h2>Emergency Assistance</h2>
              {!isCalling && (
                <button className="close-button" onClick={closeEmergencyModal}>×</button>
              )}
            </div>
            
            <div className="emergency-calling-container">
              {!isCalling ? (
                <div className="emergency-start">
                  <div className="emergency-button-wrapper">
                    <button 
                      className="emergency-button"
                      onClick={startEmergencyCall}
                    >
                      EMERGENCY CALL
                    </button>
                    <p className="emergency-instruction">Press for immediate assistance</p>
                  </div>
                </div>
              ) : (
                <div className="emergency-active">
                  <div className="video-container">
                    {cameraError ? (
                      <div className="camera-error">
                        <div className="error-icon">!</div>
                        <p>{cameraError}</p>
                        <button className="retry-button" onClick={() => {
                          setIsCalling(false);
                          setTimeout(() => startEmergencyCall(), 500);
                        }}>
                          Retry Camera
                        </button>
                      </div>
                    ) : (
                      <>
                        <video 
                          ref={videoRef}
                          autoPlay 
                          playsInline
                          className="video-feed"
                        />
                        
                        {countdown !== null && countdown > 0 && (
                          <div className="countdown-overlay">
                            <span className="countdown-number">{countdown}</span>
                            <p>Recording will start automatically</p>
                          </div>
                        )}
                        
                        {isRecording && (
                          <div className="recording-indicator">
                            <div className="recording-dot"></div>
                            <span>RECORDING</span>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  
                  <div className="emergency-controls">
                    <div className="emergency-status">
                      <p className="status-text">
                        {cameraError ? "Camera error detected" : 
                          isRecording ? "Call connected. Help is on the way." : 
                          "Connecting to emergency services..."}
                      </p>
                    </div>
                    
                    <div className="call-buttons">
                      {isRecording || cameraError ? (
                        <button 
                          className="end-call-button"
                          onClick={endCall}
                        >
                          END CALL
                        </button>
                      ) : (
                        <div className="connecting-animation">
                          <span className="dot"></span>
                          <span className="dot"></span>
                          <span className="dot"></span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        .emergency-calling-wrapper {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .emergency-trigger-button {
          background-color: #ff3b30;
          color: white;
          border: none;
          padding: 12px 24px;
          font-size: 16px;
          font-weight: bold;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          box-shadow: 0 4px 8px rgba(255, 59, 48, 0.3);
        }
        
        .emergency-trigger-button:hover {
          background-color: #ff5146;
          transform: translateY(-2px);
          box-shadow: 0 6px 12px rgba(255, 59, 48, 0.4);
        }
        
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }
        
        .modal-content {
          background-color: white;
          width: 90%;
          max-width: 600px;
          border-radius: 12px;
          box-shadow: 0 5px 30px rgba(0, 0, 0, 0.3);
          overflow: hidden;
          animation: modalFadeIn 0.3s ease-out;
        }
        
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 15px 20px;
          background-color: #f8f8f8;
          border-bottom: 1px solid #eaeaea;
        }
        
        .modal-header h2 {
          margin: 0;
          color: #333;
          font-size: 20px;
        }
        
        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #666;
          padding: 0;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        
        .close-button:hover {
          background-color: #eee;
          color: #333;
        }
        
        .emergency-calling-container {
          padding: 20px;
        }
        
        .emergency-start {
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 20px 0;
        }
        
        .emergency-button-wrapper {
          text-align: center;
        }
        
        .emergency-button {
          width: 180px;
          height: 180px;
          border-radius: 50%;
          background-color: #ff3b30;
          color: white;
          font-size: 22px;
          font-weight: bold;
          border: 8px solid rgba(255, 59, 48, 0.3);
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          box-shadow: 0 6px 16px rgba(255, 59, 48, 0.4);
          transition: all 0.2s ease;
          animation: pulse 2s infinite;
        }
        
        .emergency-button:hover {
          transform: scale(1.05);
          box-shadow: 0 8px 20px rgba(255, 59, 48, 0.5);
        }
        
        .emergency-button:active {
          transform: scale(0.95);
        }
        
        .emergency-instruction {
          margin-top: 20px;
          color: #444;
          font-size: 16px;
        }
        
        .video-container {
          width: 100%;
          position: relative;
          background-color: #222;
          border-radius: 8px;
          overflow: hidden;
          margin-bottom: 20px;
          height: 300px;
        }
        
        .video-feed {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        
        .camera-error {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
          text-align: center;
          padding: 20px;
        }
        
        .error-icon {
          width: 50px;
          height: 50px;
          border-radius: 50%;
          background-color: #ff3b30;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 30px;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .retry-button {
          margin-top: 15px;
          padding: 8px 16px;
          background-color: white;
          color: #333;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-weight: bold;
        }
        
        .countdown-overlay {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: white;
        }
        
        .countdown-number {
          font-size: 70px;
          font-weight: bold;
        }
        
        .recording-indicator {
          position: absolute;
          top: 15px;
          right: 15px;
          background-color: rgba(0, 0, 0, 0.6);
          padding: 6px 12px;
          border-radius: 20px;
          display: flex;
          align-items: center;
          color: white;
          font-size: 14px;
        }
        
        .recording-dot {
          width: 10px;
          height: 10px;
          background-color: #ff3b30;
          border-radius: 50%;
          margin-right: 8px;
          animation: blink 1s infinite;
        }
        
        .emergency-controls {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .emergency-status {
          text-align: center;
          margin-bottom: 15px;
        }
        
        .status-text {
          font-size: 18px;
          color: #ff3b30;
          font-weight: 500;
        }
        
        .call-buttons {
          display: flex;
          justify-content: center;
          margin-top: 10px;
        }
        
        .end-call-button {
          width: 140px;
          height: 45px;
          border-radius: 25px;
          background-color: #ff3b30;
          color: white;
          font-size: 16px;
          font-weight: bold;
          border: none;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(255, 59, 48, 0.3);
        }
        
        .connecting-animation {
          display: flex;
          align-items: center;
          justify-content: center;
          height: 40px;
        }
        
        .dot {
          width: 10px;
          height: 10px;
          background-color: #ff3b30;
          border-radius: 50%;
          margin: 0 5px;
          animation: loadingDots 1.4s infinite ease-in-out;
        }
        
        .dot:nth-child(2) {
          animation-delay: 0.2s;
        }
        
        .dot:nth-child(3) {
          animation-delay: 0.4s;
        }
        
        @keyframes pulse {
          0% {
            box-shadow: 0 0 0 0 rgba(255, 59, 48, 0.6);
          }
          70% {
            box-shadow: 0 0 0 15px rgba(255, 59, 48, 0);
          }
          100% {
            box-shadow: 0 0 0 0 rgba(255, 59, 48, 0);
          }
        }
        
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        
        @keyframes loadingDots {
          0%, 80%, 100% { transform: scale(0); }
          40% { transform: scale(1); }
        }
        
        @keyframes modalFadeIn {
          from { opacity: 0; transform: translateY(-20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @media (max-width: 600px) {
          .modal-content {
            width: 95%;
            height: 90%;
            display: flex;
            flex-direction: column;
          }
          
          .emergency-calling-container {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .emergency-start, .emergency-active {
            flex: 1;
            display: flex;
            flex-direction: column;
          }
          
          .emergency-button {
            width: 150px;
            height: 150px;
            font-size: 18px;
          }
          
          .video-container {
            flex: 1;
            min-height: 200px;
          }
        }
      `}</style>
    </div>
  );
}

export default Calling;
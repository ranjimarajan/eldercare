import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { 
  FaWhatsapp, 
  FaClipboardList, 
  FaUserMd, 
  FaPills, 
  FaBell, 
  FaCalendarCheck, 
  FaPhone, 
  FaVideo, 
  FaMicrophone, 
  FaMicrophoneSlash, 
  FaVideoSlash,
  FaPhoneSlash 
} from 'react-icons/fa';
import './CaregiverDashboard.css';
import BlogAdd from '../user/BlogAdd';
import AddSocialEvents from '../user/AddSocialEvents';
import AppointMents from '../user/AppointMents';
import { useNavigate } from 'react-router-dom';
import BookingForm from '../user/BookingForm';

function CareGiverDashboard() {
  //  const [Loading, setLoading] = useState(false);
   
  const CommonProblem = [
    { title: "Fever" },
    { title: "Cold & Flu" },
    { title: "Headache" },
    { title: "Stomach Pain" },
    { title: "Diabetes" },
    { title: "Hypertension" },
    { title: "Arthritis" },
    { title: "Asthma" }
  ];

  const InitValue = {
    patientName: "",
    age: "",
    gender: "",
    mobile: "",
    disease: "",
    address: "",
    email: "",
    department: "",
    date: "",
    time: "",
  };
  const navigate = useNavigate();
   const [BookAppoint, setBookAppoint] = useState(InitValue);
  
    const HandleAppointment = (e) => {
      setBookAppoint({ ...BookAppoint, [e.target.name]: e.target.value });
    };
 
  const HandleOnsubmitAppointment = (e) => {
    e.preventDefault();

    if (BookAppoint.gender === "" || BookAppoint.department === "") {
      return notify("Please fill all the Details");
    }
    setLoading(true);
    
    // Simulating dispatch actions since we don't have the actual implementation
    // In a real app, you would use your actual dispatch functions
    setTimeout(() => {
      notify("Appointment Booked");
      setLoading(false);
      setBookAppoint(InitValue);
    }, 1500);
    localStorage.setItem("email", BookAppoint.email)
    axios.post('http://localhost:5000/appointments/create', {BookAppoint}).then((response => {
            console.log(response)
    }))
    window.open("http://localhost:3000/CareHome","_blank")
  };
  
  const [patients, setPatients] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [activeView, setActiveView] = useState('patients');
  
  // Call states
  const [calling, setCalling] = useState(false);
  const [currentCall, setCurrentCall] = useState(null);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const [micEnabled, setMicEnabled] = useState(true);
  const [cameraEnabled, setCameraEnabled] = useState(true);
  const [callStatus, setCallStatus] = useState('connecting'); // connecting, ongoing, ended
  const [callDuration, setCallDuration] = useState(0);
  
  // Video refs
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const callTimerRef = useRef(null);
  const localStreamRef = useRef(null);
  
  const [loading, setLoading] = useState(true);
  const [newTask, setNewTask] = useState({ 
    patientId: '', 
    description: '', 
    dueDate: '', 
    priority: 'medium' 
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Fetch patients
        const patientsResponse = await axios.get('http://localhost:5000/nurses');
        setPatients(patientsResponse.data);
  
        // Fetch tasks and map to the new structure
        const tasksResponse = await axios.get('http://localhost:5000/nurses/getFullTask');
        console.log(tasksResponse,"tasksResponse")
        const formattedTasks = tasksResponse.data.tasks.map(task => ({
          id: task._id,
          patientName: task.name,
          description: task.notes,
          dueDate: task.time,
          email: task.email,
          phone: task.mobile || "123-456-7890", // Added default phone if not available
          status: task.helpNeeded ? 'pending' : 'completed',
          priority: task.priority === 'normal' ? 'medium' : task.priority
        }));
        console.log(formattedTasks,"--------")
        setTasks(formattedTasks);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);
  
  useEffect(() => {
    // Cleanup function for call timer and media streams
    return () => {
      if (callTimerRef.current) {
        clearInterval(callTimerRef.current);
      }
      if (localStreamRef.current) {
        localStreamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const handleAddTask = (e) => {
    e.preventDefault();
    const patient = patients.find(p => p._id === newTask.patientId);
    const patientName = patient ? patient.patientName : 'Unknown Patient';
    
    const task = {
      id: tasks.length + 1,
      patientName,
      description: newTask.description,
      dueDate: newTask.dueDate,
      status: 'pending',
      priority: newTask.priority
    };
    
    setTasks([...tasks, task]);
    setNewTask({ patientId: '', description: '', dueDate: '', priority: 'medium' });
  };

  const toggleTaskStatus = (taskId) => {
    setTasks(tasks.map(task => {
      if (task.id === taskId) {
        return {
          ...task,
          status: task.status === 'completed' ? 'pending' : 'completed'
        };
      }
      return task;
    }));
  };

  const CarLogout = () => {
    try {
      navigate('/');
    } catch (error) {
      console.log(error)
    }
  };

  // Function to start call timer
  const startCallTimer = () => {
    setCallDuration(0);
    callTimerRef.current = setInterval(() => {
      setCallDuration(prev => prev + 1);
    }, 1000);
  };

  // Format call duration to mm:ss
  const formatCallDuration = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Function to handle audio call
  const handleCall = async (taskId, videoEnabled = false) => {
    window.open('http://localhost:3000/calling', '_blank');
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    setCalling(true);
    setCurrentCall(task);
    setIsVideoCall(videoEnabled);
    setCallStatus('connecting');
    
    try {
      // Call API to initiate call
      const response = await axios.post('http://localhost:3000/calls/initiate', {
        recipientName: task.patientName,
        recipientPhone: task.phone,
        recipientEmail: task.email,
        taskId: task.id,
        videoEnabled
      });
      
      console.log('Call initiated:', response.data);
      
      // For video calls, access user media
      if (videoEnabled) {
        try {
          const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
          localStreamRef.current = stream;
          
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = stream;
          }
          
          // Simulate remote video after 2 seconds (in a real app, this would come from WebRTC)
          setTimeout(() => {
            // In a real implementation, this would be the peer connection stream
            if (remoteVideoRef.current) {
              remoteVideoRef.current.srcObject = new MediaStream();
              // Just a placeholder - in real app this would be the remote user's stream
            }
          }, 2000);
        } catch (err) {
          console.error('Failed to get user media:', err);
          setCameraEnabled(false);
        }
      }
      
      // Start call timer
      startCallTimer();
      
      // Simulate call connected
      setTimeout(() => {
        setCallStatus('ongoing');
      }, 2000);
      
    } catch (error) {
      console.error('Error initiating call:', error);
      endCall();
      
      // Show error message to user
      alert('Failed to initiate call. Please try again.');
    }
  };

  // Function to toggle microphone
  const toggleMicrophone = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = !track.enabled;
        setMicEnabled(track.enabled);
      });
    } else {
      setMicEnabled(!micEnabled);
    }
  };

  // Function to toggle camera
  const toggleCamera = () => {
    if (localStreamRef.current) {
      localStreamRef.current.getVideoTracks().forEach(track => {
        track.enabled = !track.enabled;
        setCameraEnabled(track.enabled);
      });
    } else {
      setCameraEnabled(!cameraEnabled);
    }
  };

  // Function to end call
  const endCall = () => {
    setCallStatus('ended');
    
    // Stop call timer
    if (callTimerRef.current) {
      clearInterval(callTimerRef.current);
      callTimerRef.current = null;
    }
    
    // Stop all media tracks
    if (localStreamRef.current) {
      localStreamRef.current.getTracks().forEach(track => track.stop());
      localStreamRef.current = null;
    }
    
    // Simulate ending animation then reset
    setTimeout(() => {
      setCalling(false);
      setCurrentCall(null);
      setIsVideoCall(false);
      setCallDuration(0);
    }, 1000);
  };

  // Function to handle video call
  const handleVideoCall = (taskId) => {
    handleCall(taskId, true);
  };

  // Function to handle notification
  const handleNotify = async (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;
    
    try {
      // Send notification via API
      const response = await axios.post('http://localhost:5000/notifications/send', {
        recipientName: task.patientName,
        recipientEmail: task.email,
        taskId: task.id,
        message: `Reminder: ${task.description}`
      });
      
      console.log('Notification sent:', response.data);
      
      // Update task to show notification sent
      setTasks(tasks.map(t => {
        if (t.id === taskId) {
          return { ...t, notified: true };
        }
        return t;
      }));
      
      // Open notification portal in new tab
      window.open('http://localhost:3000/AudioCAll', '_blank');
    } catch (error) {
      console.error('Error sending notification:', error);
      
      // Still open the notification portal even if API call fails
      window.open('http://localhost:3000/AudioCAll', '_blank');
    }
  };

  return (
    <div className="dashboard-container">
      {calling && (
        <div className="call-overlay">
          <div className={`call-dialog ${isVideoCall ? 'video-call' : 'audio-call'}`}>
            {isVideoCall ? (
              <div className="video-container">
                <div className="remote-video-wrapper">
                  {callStatus === 'connecting' ? (
                    <div className="connecting-animation">
                      <div className="connecting-dot"></div>
                      <div className="connecting-dot"></div>
                      <div className="connecting-dot"></div>
                    </div>
                  ) : null}
                  <video 
                    ref={remoteVideoRef} 
                    className="remote-video" 
                    autoPlay 
                    playsInline
                  >
                    Your browser does not support video.
                  </video>
                  <div className="remote-user-name">{currentCall?.patientName}</div>
                  <div className="call-duration">{formatCallDuration(callDuration)}</div>
                </div>
                <div className="local-video-wrapper">
                  <video 
                    ref={localVideoRef} 
                    className="local-video" 
                    autoPlay 
                    playsInline 
                    muted
                  >
                    Your browser does not support video.
                  </video>
                </div>
              </div>
            ) : (
              <>
                <div className="call-avatar">
                  {currentCall?.patientName?.charAt(0) || "U"}
                </div>
                <h3>Call with {currentCall?.patientName}</h3>
                <p>Phone: {currentCall?.phone}</p>
                <div className="call-status">
                  {callStatus === 'connecting' ? 'Connecting...' : 
                   callStatus === 'ongoing' ? formatCallDuration(callDuration) : 
                   'Call ended'}
                </div>
              </>
            )}
            
            <div className="call-controls">
              {isVideoCall && (
                <>
                  <button 
                    className={`control-btn ${!micEnabled ? 'disabled' : ''}`} 
                    onClick={toggleMicrophone}
                  >
                    {micEnabled ? <FaMicrophone /> : <FaMicrophoneSlash />}
                  </button>
                  <button 
                    className={`control-btn ${!cameraEnabled ? 'disabled' : ''}`} 
                    onClick={toggleCamera}
                  >
                    {cameraEnabled ? <FaVideo /> : <FaVideoSlash />}
                  </button>
                </>
              )}
              <button 
                className="control-btn end-call" 
                onClick={endCall}
              >
                <FaPhoneSlash />
              </button>
            </div>
          </div>
        </div>
      )}
      
      <div className="dashboard-sidebar">
        <div className="dashboard-logo">
          <h3>CareConnect</h3>
        </div>
        <nav className="dashboard-nav">
          <button 
            className={`nav-item ${activeView === 'patients' ? 'active' : ''}`}
            onClick={() => setActiveView('patients')}
          >
            <FaUserMd /> <span>Patients</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveView('tasks')}
          >
            <FaClipboardList /> <span>Daily Tasks</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'medications' ? 'active' : ''}`}
            onClick={() => setActiveView('medications')}
          >
            <FaPills /> <span>Medications</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'calendar' ? 'active' : ''}`}
            onClick={() => setActiveView('calendar')}
          >
            <FaCalendarCheck /> <span>Calendar</span>
          </button>
          <button 
            className={`nav-item ${activeView === 'alerts' ? 'active' : ''}`}
            onClick={() => setActiveView('alerts')}
          >
            <FaBell /> <span>Alerts</span>
          </button>
        </nav>
      </div>

      <div className="dashboard-main">
        <div className="dashboard-header">
          <h2>Caregiver Dashboard</h2>
          <div className="user-info">
            <span>Care Giver</span>
            <div className="user-avatar">SM</div>
            <span onClick={()=>CarLogout()}>Logout</span>
          </div>
        </div>

        <div className="dashboard-content">
          {loading ? (
            <div className="loading-spinner">Loading...</div>
          ) : (
            <>
              {activeView === 'patients' && (
                <div className="patients-view">
                  <h3>Patient List</h3>
                  <div className="table-container">
                    <table className="data-table">
                      <thead>
                        <tr>
                          <th>Name</th>
                          <th>Email</th>
                          <th>Contact</th>
                          <th>Age</th>
                          <th>Gender</th>
                          <th>Blood Group</th>
                          <th>address</th>
                          <th>DOB</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {patients.map((patient) => (
                          <tr key={patient._id}>
                            <td>{patient.nurseName}</td>
                            <td>{patient.email}</td>
                            <td>{patient.mobile}</td>
                            <td>{patient.age}</td>
                            <td>{patient.gender}</td>
                            <td>{patient.bloodGroup}</td>
                            <td>{patient.address}</td>
                            <td>{patient.DOB}</td>
                            <td className="action-buttons">
                              <a href={`https://wa.me/${patient.mobile}`} target="_blank" rel="noopener noreferrer" className="action-button whatsapp">
                                <FaWhatsapp />
                              </a>
                              <button 
                                className="action-button call"
                                onClick={() => handleCall({
                                  id: patient._id,
                                  patientName: patient.nurseName,
                                  phone: patient.mobile,
                                  email: patient.email
                                })}
                                title="Voice Call"
                              >
                                <FaPhone />
                              </button>
                              {/* <button 
                                className="action-button video-call"
                                onClick={() => handleVideoCall({
                                  id: patient._id,
                                  patientName: patient.nurseName,
                                  phone: patient.mobile,
                                  email: patient.email
                                })}
                                title="Video Call"
                              >
                                <FaVideo />
                              </button> */}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {activeView === 'tasks' && (
                <div className="tasks-view">
                  <div className="tasks-header">
                    <h3>Daily Tasks</h3>
                    <div className="date-display">Friday, March 21, 2025</div>
                  </div>
                  
                  <div className="tasks-grid">
                    <div className="tasks-list">
                      <h4>Today's Tasks</h4>
                      <div className="task-items">
                        {tasks.map(task => (
                            <div key={task.id} className={`task-item ${task.status} ${task.priority}`}>
                              <div className="task-check">
                                <input 
                                  type="checkbox" 
                                  checked={task.status === 'completed'} 
                                  onChange={() => toggleTaskStatus(task.id)} 
                                />
                              </div>
                              <div className="task-content">
                                <div className="task-description">{task.patientName}</div>
                                <div className="task-meta">
                                  <span className="task-patient">{task.status}</span>
                                  <span className="task-priority">{task.dueDate}</span>
                                  <span className="task-priority">{task.email}</span>
                                  <div className="task-actions">
                                    {/* <button 
                                      className="call-button"
                                      onClick={() => handleCall(task.id)}
                                    >
                                      <FaPhone /> Call
                                    </button> */}

                                    <button 
                                      className="video-call-button"
                                      onClick={() => handleVideoCall(task.id)}
                                    >
                                      <FaVideo /> Video
                                    </button>

                                    <button 
                                      className="notify-button" 
                                      onClick={() => handleNotify(task.id)}
                                    >
                                      <FaBell /> Notify
                                    </button>
                                  </div>
                                </div> 
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              
              {activeView === 'medications' && (
                <div className="placeholder-view">
                  <BlogAdd/>
                </div>
              )}
              
              {activeView === 'calendar' && (
                <div className="placeholder-view">
                  <AddSocialEvents/>
                </div>
              )}

              {activeView === 'alerts' && (
                <div className="placeholder-view">
                  <AppointMents/>
                  <section id="booking-form" className="booking-section">
        <h2>Book  Appointment</h2>
       

        <form onSubmit={HandleOnsubmitAppointment} className="appointment-form">
          <div className="form-row">
            <div className="form-group">
              <label>Patient Name</label>
              <div className="inputdiv">
                <input
                  type="text"
                  placeholder="Full Name"
                  name="patientName"
                  value={BookAppoint.patientName}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Age</label>
              <div className="inputdiv">
                <input
                  type="number"
                  placeholder="Age"
                  name="age"
                  value={BookAppoint.age}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Gender</label>
              <div className="inputdiv">
                <select
                  name="gender"
                  value={BookAppoint.gender}
                  onChange={HandleAppointment}
                  required
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
            </div>
            <div className="form-group">
              <label>Contact Number</label>
              <div className="inputdiv">
                <input
                  type="number"
                  placeholder="Phone Number"
                  name="mobile"
                  value={BookAppoint.mobile}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Email</label>
              <div className="inputdiv">
                <input
                  type="email"
                  placeholder="example@email.com"
                  name="email"
                  value={BookAppoint.email}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Type of Disease</label>
              <div className="inputdiv">
                <select
                  name="disease"
                  value={BookAppoint.disease}
                  onChange={HandleAppointment}
                  required
                >
                  <option value="">Select Disease</option>
                  {CommonProblem.map((ele, i) => (
                    <option key={i} value={ele.title}>
                      {ele.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Address</label>
              <div className="inputdiv">
                <input
                  type="text"
                  placeholder="Address line 1"
                  name="address"
                  value={BookAppoint.address}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Department</label>
              <div className="inputdiv">
                <select
                  name="department"
                  value={BookAppoint.department}
                  onChange={HandleAppointment}
                  required
                >
                  <option value="">Select Department</option>
                  <option value="Cardiology">Cardiology</option>
                  <option value="Neurology">Neurology</option>
                  <option value="ENT">ENT</option>
                  <option value="Ophthalmologist">Ophthalmologist</option>
                  <option value="Anesthesiologist">Anesthesiologist</option>
                  <option value="Dermatologist">Dermatologist</option>
                  <option value="Oncologist">Oncologist</option>
                  <option value="Psychiatrist">Psychiatrist</option>
                </select>
              </div>
            </div>
          </div>

          <div className="form-row dateofAppointment">
            <div className="form-group">
              <label>Date</label>
              <div className="inputdiv">
                <input
                  type="date"
                  placeholder="Choose Date"
                  name="date"
                  value={BookAppoint.date}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Time</label>
              <div className="inputdiv">
                <input
                  type="time"
                  placeholder="Choose Time"
                  name="time"
                  value={BookAppoint.time}
                  onChange={HandleAppointment}
                  required
                />
              </div>
            </div>
          </div>

          <button type="submit" className="btn-submit">
            {"Book Appointment"}
          </button>
        </form>
      </section>
                  {/* <BookingForm/> */}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default CareGiverDashboard;
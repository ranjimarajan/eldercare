import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './appointments.css';

function AppointMents() {
  const [appointments, setAppointments] = useState([]);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentAppointment, setCurrentAppointment] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [paymentStatus, setPaymentStatus] = useState('initial'); // 'initial', 'processing', 'success'

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const response = await axios.get('http://localhost:5000/appointments/viewAppoinment');
      setAppointments(response.data);
    } catch (error) {
      console.error('Error fetching appointments:', error);
    }
  };

  const handlePayNow = (appointment) => {
    setCurrentAppointment(appointment);
    setShowPaymentModal(true);
    setPaymentStatus('initial');
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    
    if (!upiId) {
      alert('Please enter UPI ID');
      return;
    }
    
    setPaymentStatus('processing');
    
    // Simulate payment processing
    setTimeout(async () => {
      try {
        // Make API call to update payment status
      let responsePay =  await axios.post('http://localhost:5000/Viewappointments/update', {
          appointmentId: currentAppointment._id,
          paymentStatus: 'Paid',
          paymentMethod: 'UPI',
          upiId: upiId
        });
        console.log(responsePay,"responsePay..")
        setPaymentStatus('success');
        fetchAppointments()
        // Automatically close after showing success for 2 seconds
        setTimeout(() => {
          setShowPaymentModal(false);
          setUpiId('');
          setCurrentAppointment(null);
          setPaymentStatus('initial');
          
          // Refresh appointments list
          fetchAppointments();
        }, 2000);
        
      } catch (error) {
        console.error('Error processing payment:', error);
        setPaymentStatus('initial');
        alert('Payment failed. Please try again.');
      }
    }, 2000); // Simulate 2 second processing time
  };

  const closeModal = () => {
    setShowPaymentModal(false);
    setUpiId('');
    setCurrentAppointment(null);
    setPaymentStatus('initial');
  };

  // Render different payment modal content based on status
  const renderPaymentModalContent = () => {
    switch (paymentStatus) {
      case 'processing':
        return (
          <div className="processing-payment">
            <div className="spinner"></div>
            <p className="processing-text">Processing your payment...</p>
          </div>
        );
      
      case 'success':
        return (
          <div className="payment-success">
            <div className="success-icon"></div>
            <p className="success-message">Payment Successful!</p>
            <p className="success-details">Your appointment has been confirmed.</p>
          </div>
        );
      
      default:
        return (
          <div className="payment-modal-body">
            <div className="payment-info">
              <p><strong>Patient:</strong> {currentAppointment?.patientName}</p>
              <p><strong>Appointment Date:</strong> {currentAppointment ? new Date(currentAppointment.date).toLocaleDateString() : ''}</p>
              <p><strong>Department:</strong> {currentAppointment?.department}</p>
            </div>
            
            <div className="payment-amount">₹500.00</div>
            
            <div className="payment-methods">
              <div className="payment-method">
                <h4>Pay using UPI</h4>
                <div className="upi-icons">
                  <div className="upi-icon">GPay</div>
                  <div className="upi-icon">PhonePe</div>
                  <div className="upi-icon">Paytm</div>
                  <div className="upi-icon">BHIM</div>
                </div>
                <form onSubmit={handlePaymentSubmit}>
                  <div className="upi-input">
                    <label htmlFor="upi-id">Enter UPI ID:</label>
                    <input
                      type="text"
                      id="upi-id"
                      placeholder="username@upi"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div className="payment-actions">
                    <button type="button" className="cancel-btn" onClick={closeModal}>Cancel</button>
                    <button type="submit" className="pay-btn">
                      Pay ₹500.00
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="appointments-container">
      <h2>Appointments</h2>
      {appointments.length > 0 ? (
        <div className="appointments-table-container">
          <table className="appointments-table">
            <thead>
              <tr>
                <th>Patient Name</th>
                <th>Mobile</th>
                <th>Email</th>
                <th>Address</th>
                <th>Disease</th>
                <th>Department</th>
                <th>Time</th>
                <th>Date</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Payment</th>
              </tr>
            </thead>
            <tbody>
              {appointments.map((appointment) => (
                <tr key={appointment._id}>
                  <td>{appointment.patientName}</td>
                  <td>{appointment.mobile}</td>
                  <td>{appointment.email}</td>
                  <td>{appointment.address}</td>
                  <td>{appointment.disease}</td>
                  <td>{appointment.department}</td>
                  <td>{appointment.time}</td>
                  <td>{new Date(appointment.date).toLocaleDateString()}</td>
                  <td>{appointment.age}</td>
                  <td>{appointment.gender}</td>
                  <td>
                    <button 
                      className={`payment-btn ${appointment.paymentStatus === 'Paid' ? 'paid' : ''}`}
                      onClick={() => handlePayNow(appointment)}
                      disabled={appointment.payment === 'Paid'}
                    >
                      {appointment.paymentStatus === 'Paid' ? 'Paid' : 'Pay Now'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="no-appointments">No appointments found.</p>
      )}

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="payment-modal-overlay">
          <div className="payment-modal">
            <div className="payment-modal-header">
              <h3>Razorpay Payment</h3>
              {paymentStatus === 'initial' && (
                <button className="close-btn" onClick={closeModal}>×</button>
              )}
            </div>
            {renderPaymentModalContent()}
          </div>
        </div>
      )}
    </div>
  );
}

export default AppointMents;
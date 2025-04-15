import React from 'react'
import './booking.css'
export default function BookingForm() {
  return (
    <div>
      
          <section id="booking-form" className="booking-section">
        <h2>Book Your Appointment</h2>
        <p>Fill out the form below and we will get back to you within 24 hours.</p>

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
            {Loading ? "Loading..." : "Book Appointment"}
          </button>
        </form>
      </section>
    </div>
  )
}

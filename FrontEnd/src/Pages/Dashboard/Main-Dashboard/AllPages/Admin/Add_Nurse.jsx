import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { message, Upload } from "antd";
import { LoadingOutlined, PlusOutlined, UserOutlined, MailOutlined, PhoneOutlined, HomeOutlined, BookOutlined } from "@ant-design/icons";
import { NurseRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const notify = (text) => toast(text);

const Add_Nurse = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
      // window.location.reload();
     
  }, []); 
  const InitData = {
    nurseName: "",
    age: "",
    mobile: "",
    email: "",
    gender: "",
    DOB: "",
    address: "",
    education: "",
    department: "",
    nurseID: Date.now(),
    password: "",
    details: "",
    bloodGroup: "",
  };
  const [NurseValue, setNurseValue] = useState(InitData);

  const HandleDoctorChange = (e) => {
    setNurseValue({ ...NurseValue, [e.target.name]: e.target.value });
  };

  const HandleDoctorSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(NurseRegister(NurseValue)).then((res) => {
      if (res.message === "Nures already exists") {
        setLoading(false);
        return notify("Nurse Already Exist");
      }
      if (res.message === "error") {
        setLoading(false);
        return notify("Something went wrong, Please try Again");
      }
      notify("Nurse Added");

      let data = {
        email: res.data.email,
        password: res.data.password,
        userId: res.data.nurseID,
      };
      dispatch(SendPassword(data)).then((res) => notify("Account Detais Sent"));
      setLoading(false);
      setNurseValue(InitData);
    });
  };

  if (data?.isAuthticated === false) {
    return <Navigate to={"/"} />;
  }

  if (data?.user.userType !== "admin") {
    return <Navigate to={"/dashboard"} />;
  }

  return (
    <>
      <ToastContainer />
      <div className="registration-container">
        <div className="registration-content">
          <div className="registration-header">
            <h1>User Registration</h1>
            <p>Complete the form below to register a new user</p>
          </div>
          
          <div className="registration-form-container">
            <form onSubmit={HandleDoctorSubmit} className="registration-form">
              <div className="form-row">
                <div className="form-group">
                  <label><UserOutlined /> Full Name</label>
                  <input
                    type="text"
                    placeholder="Enter student's full name"
                    name="nurseName"
                    value={NurseValue.nurseName}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="Enter age"
                    name="age"
                    value={NurseValue.age}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><PhoneOutlined /> Contact Number</label>
                  <input
                    type="number"
                    placeholder="Enter contact number"
                    name="mobile"
                    value={NurseValue.mobile}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label><MailOutlined /> Email Address</label>
                  <input
                    type="email"
                    placeholder="Enter email address"
                    name="email"
                    value={NurseValue.email}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={NurseValue.gender}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Gender">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Date of Birth</label>
                  <input
                    type="date"
                    name="DOB"
                    value={NurseValue.DOB}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group full-width">
                  <label><HomeOutlined /> Address</label>
                  <input
                    type="text"
                    placeholder="Enter complete address"
                    name="address"
                    value={NurseValue.address}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label><BookOutlined /> Education</label>
                  <input
                    type="text"
                    placeholder="Enter field of study (e.g. CSE)"
                    name="education"
                    value={NurseValue.education}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={NurseValue.bloodGroup}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Blood Group">Select Blood Group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                  </select>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    placeholder="Create a password"
                    name="password"
                    value={NurseValue.password}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Additional Information</label>
                  <textarea
                    placeholder="Any other relevant information"
                    rows="3"
                    name="details"
                    value={NurseValue.details}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <button type="submit" className="submit-button">
                {loading ? (
                  <>
                    <LoadingOutlined /> Processing...
                  </>
                ) : (
                  "Register User"
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <style jsx>{`
        .registration-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
          background-color: #f8f9fa;
          min-height: 100vh;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
        }
        
        .registration-content {
          background: white;
          border-radius: 10px;
          box-shadow: 0 0 20px rgba(0, 0, 0, 0.05);
          overflow: hidden;
        }
        
        .registration-header {
          background: linear-gradient(135deg, #4a90e2 0%, #365b8f 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }
        
        .registration-header h1 {
          margin: 0;
          font-size: 2rem;
          font-weight: 600;
        }
        
        .registration-header p {
          margin-top: 0.5rem;
          opacity: 0.9;
        }
        
        .registration-form-container {
          padding: 2rem;
        }
        
        .registration-form {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .form-row {
          display: flex;
          gap: 1.5rem;
        }
        
        @media (max-width: 768px) {
          .form-row {
            flex-direction: column;
            gap: 1rem;
          }
        }
        
        .form-group {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        
        .full-width {
          flex: 1 0 100%;
        }
        
        label {
          font-weight: 500;
          color: #333;
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        input, select, textarea {
          padding: 0.75rem 1rem;
          border: 1px solid #ddd;
          border-radius: 6px;
          font-size: 1rem;
          transition: border-color 0.3s;
        }
        
        input:focus, select:focus, textarea:focus {
          outline: none;
          border-color: #4a90e2;
          box-shadow: 0 0 0 3px rgba(74, 144, 226, 0.1);
        }
        
        .submit-button {
          margin-top: 1rem;
          background: #4a90e2;
          color: white;
          border: none;
          padding: 1rem;
          font-size: 1rem;
          font-weight: 600;
          border-radius: 6px;
          cursor: pointer;
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          transition: background-color 0.3s;
        }
        
        .submit-button:hover {
          background: #3a7bc8;
        }
      `}</style>
    </>
  );
};

export default Add_Nurse;
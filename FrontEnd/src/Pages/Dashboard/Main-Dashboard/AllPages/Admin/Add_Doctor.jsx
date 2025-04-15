import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DoctorRegister, SendPassword } from "../../../../../Redux/auth/action";
import Sidebar from "../../GlobalFiles/Sidebar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom";
import "./Add_Doctor.css"; // Make sure this CSS file exists

const notify = (text) => toast(text);

const AddDoctor = () => {
  const { data } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const initData = {
    docName: "",
    age: "",
    mobile: "",
    email: "",
    bloodGroup: "",
    gender: "",
    DOB: "",
    address: "",
    education: "",
    department: "",
    docID: Date.now(),
    password: "",
    details: "",
  };
  
  const [DoctorValue, setDoctorValue] = useState(initData);

  const HandleDoctorChange = (e) => {
    setDoctorValue({ ...DoctorValue, [e.target.name]: e.target.value });
  };

  const HandleDoctorSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    dispatch(DoctorRegister(DoctorValue)).then((res) => {
      if (res.message === "Doctor already exists") {
        setLoading(false);
        return notify("Doctor Already Exist");
      }
      if (res.message === "error") {
        setLoading(false);
        return notify("Something went wrong, Please try Again");
      }

      let data = {
        email: res.data.email,
        password: res.data.password,
        userId: res.data.docID,
      };
      console.log(data, "DOCTOR REGISTER SUCCESSFULLY");
      dispatch(SendPassword(data)).then((res) => notify("Account Details Sent"));
      setLoading(false);
      setDoctorValue(initData);
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
      <div className="container">
        <div className="AfterSideBar">
          <div className="registration-card">
            <div className="registration-header">
              <h2>Registration</h2>
              <p>Enter User details to register a new account</p>
            </div>
            
            <form onSubmit={HandleDoctorSubmit} className="registration-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Name</label>
                  <input
                    type="text"
                    placeholder="Full Name"
                    name="docName"
                    value={DoctorValue.docName}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Age</label>
                  <input
                    type="number"
                    placeholder="Age"
                    name="age"
                    value={DoctorValue.age}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Emergency Number</label>
                  <input
                    type="number"
                    placeholder="Emergency Number"
                    name="mobile"
                    value={DoctorValue.mobile}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Email</label>
                  <input
                    type="email"
                    placeholder="abc@abc.com"
                    name="email"
                    value={DoctorValue.email}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Gender</label>
                  <select
                    name="gender"
                    value={DoctorValue.gender}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Gender">Choose Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Others">Others</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Blood Group</label>
                  <select
                    name="bloodGroup"
                    value={DoctorValue.bloodGroup}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="Choose Blood Group">Select</option>
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
                
                <div className="form-group">
                  <label>Birthdate</label>
                  <input
                    type="date"
                    placeholder="dd-mm-yy"
                    name="DOB"
                    value={DoctorValue.DOB}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Landmark</label>
                  <input
                    type="text"
                    placeholder="eg.MBBS"
                    name="education"
                    value={DoctorValue.education}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>District</label>
                  <select
                    name="department"
                    value={DoctorValue.department}
                    onChange={HandleDoctorChange}
                    required
                  >
                    <option value="General">Select</option>
                    <option value="Cardiology">Trivandrum</option>
                    <option value="Neurology">Kollam</option>
                    <option value="Pathanamthitta">Pathanamthitta</option>
                    <option value="Alappi">Alappi</option>
                    <option value="kottayam">kottayam</option>
                    <option value="Edukki">Edukki</option>


                  </select>
                </div>
                
                <div className="form-group">
                  <label>Password</label>
                  <input
                    type="text"
                    placeholder="Password"
                    name="password"
                    value={DoctorValue.password}
                    onChange={HandleDoctorChange}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group full-width">
                <label>Address</label>
                <input
                  type="text"
                  placeholder="Address"
                  name="address"
                  value={DoctorValue.address}
                  onChange={HandleDoctorChange}
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label>Other Details</label>
                <textarea
                  placeholder="Extra Info"
                  rows="4"
                  name="details"
                  value={DoctorValue.details}
                  onChange={HandleDoctorChange}
                  required
                />
              </div>
              
              <div className="form-submit">
                <button
                  type="submit"
                  className="submit-button"
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Register Your Account"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddDoctor;
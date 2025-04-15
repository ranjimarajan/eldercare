import React, { useState } from "react";
import "../Doctor/CSS/Doctor_Profile.css";
import { BiTime } from "react-icons/bi";
import { GiMeditation } from "react-icons/gi";
import { AiFillCalendar, AiFillEdit } from "react-icons/ai";
import { MdBloodtype } from "react-icons/md";
import { BsFillTelephoneFill } from "react-icons/bs";
import { BsHouseFill, BsGenderAmbiguous } from "react-icons/bs";
import { MdOutlineCastForEducation } from "react-icons/md";
import { FaRegHospital, FaMapMarkedAlt, FaBirthdayCake } from "react-icons/fa";
import Sidebar from "../../GlobalFiles/Sidebar";
import { useDispatch, useSelector } from "react-redux";
import { Button, message, Modal } from "antd";
// import { UpdateStudent } from "../../../../../Redux/auth/action";
import profileImg from "../../../../../img/profile.png";
import "./CSS/Profiles.css";
import Payment from "../../GlobalFiles/Payment";

const Student_Profile = () => {
  const {
    data: { user },
  } = useSelector((state) => state.auth);

  const dispatch = useDispatch();

  const [formData, setFormData] = useState({
    studentName: user.studentName,
    age: user.age,
    gender: user.gender,
    bloodGroup: user.bloodGroup,
    education: user.education,
    mobile: user.mobile,
    DOB: user.DOB,
    ID: user._id,
  });

  const [open, setOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const showModal = () => {
    setOpen(true);
  };

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setOpen(false);
      setConfirmLoading(false);
    }, 2000);
  };

  const [messageApi, contextHolder] = message.useMessage();

  const success = (text) => {
    messageApi.success(text);
  };

  const handleCancel = () => {
    setOpen(false);
  };

  const handleFormChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = () => {
    // dispatch(UpdateStudent(formData, user._id));
    success("User updated");
    handleOk();
  };

  return (
    <>
      {contextHolder}
      <div className="container">
        <Sidebar />
        <div className="AfterSideBar">
          <div className="mainProfile">
            <div className="firstBox profileFirstDiv">
              <div>
                <img src={user?.image || profileImg} alt="profile" />
              </div>
              <hr />
              <div className="singleItemDiv">
                <GiMeditation className="singleDivIcons" />
                <p>{user?.studentName}</p>
              </div>
              <div className="singleItemDiv">
                <MdBloodtype className="singleDivIcons" />
                <p>{user?.bloodGroup}</p>
              </div>
              <div className="singleItemDiv">
                <FaBirthdayCake className="singleDivIcons" />
                <p>{user?.DOB}</p>
              </div>
              <div className="singleItemDiv">
                <BsFillTelephoneFill className="singleDivIcons" />
                <p>{user?.mobile}</p>
              </div>
              <Payment/>
              <div className="singleItemDiv">
                <button onClick={showModal}>
                  <AiFillEdit /> Edit Profile
                </button>
              </div>

              <Modal
                title="Edit Details"
                open={open}
                onOk={handleOk}
                confirmLoading={confirmLoading}
                onCancel={handleCancel}
                footer={[
                  <Button key="back" onClick={handleCancel}>
                    Cancel
                  </Button>,
                  <Button key="submit" onClick={handleFormSubmit}>
                    Edit
                  </Button>,
                ]}
              >
                <form className="inputForm">
                  <input
                    name="studentName"
                    value={formData.studentName}
                    onChange={handleFormChange}
                    type="text"
                    placeholder="Full Name"
                  />
                  <input
                    name="age"
                    value={formData.age}
                    onChange={handleFormChange}
                    type="number"
                    placeholder="Age"
                  />
                  <select name="gender" onChange={handleFormChange}>
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <input
                    name="bloodGroup"
                    value={formData.bloodGroup}
                    onChange={handleFormChange}
                    type="text"
                    placeholder="Blood Group"
                  />
                  <input
                    name="education"
                    value={formData.education}
                    onChange={handleFormChange}
                    type="text"
                    placeholder="Education"
                  />
                  <input
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleFormChange}
                    type="number"
                    placeholder="Mobile"
                  />
                  <input
                    name="DOB"
                    value={formData.DOB}
                    onChange={handleFormChange}
                    type="date"
                    placeholder="Date of Birth"
                  />
                </form>
              </Modal>
            </div>
            {/* ***********  Second Div ******************** */}
            <div className="secondBox">
              <div className="subFirstBox">
                <h2 style={{ textAlign: "center", marginTop: "10px" }}>
                  Other Info
                </h2>
                <div className="singleItemDiv">
                  <BsGenderAmbiguous className="singleDivIcons" />
                  <p>{user?.gender}</p>
                </div>
                <div className="singleItemDiv">
                  <AiFillCalendar className="singleDivIcons" />
                  <p>{user?.age}</p>
                </div>
                <div className="singleItemDiv">
                  <MdOutlineCastForEducation className="singleDivIcons" />
                  <p>{user?.education}</p>
                </div>
                <div className="singleItemDiv">
                  <BsHouseFill className="singleDivIcons" />
                  <p>{user?.address}</p>
                </div>
              </div>
              {/* ***********  Third Div ******************** */}
              {/* <div className="subSecondBox">
                <h2 style={{ textAlign: "center", marginTop: "10px" }}>
                  Collage Details
                </h2>
                <div className="singleItemDiv">
                  <BiTime className="singleDivIcons" />
                  <p>09:00 AM - 20:00 PM (Timing)</p>
                </div>
                <div className="singleItemDiv">
                  <FaRegHospital className="singleDivIcons" />
                  <p>ABC School</p>
                </div>
                <div className="singleItemDiv">
                  <FaMapMarkedAlt className="singleDivIcons" />
                  <p>123 Main Street, City, Country</p>
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Student_Profile;

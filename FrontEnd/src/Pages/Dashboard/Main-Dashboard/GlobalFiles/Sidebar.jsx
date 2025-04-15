import React, { useState } from "react";
import { AiOutlineUserAdd } from "react-icons/ai";
import { FaAddressBook, FaAdjust, FaAmazonPay, FaAmbulance, FaAngleUp, FaAppStore, FaDochub, FaUser } from "react-icons/fa";
import { GiNurseFemale } from "react-icons/gi";
import { RiSecurePaymentLine } from "react-icons/ri";
import { SlUserFollow } from "react-icons/sl";
import { BsBookmarkPlus, BsFillBookmarkCheckFill } from "react-icons/bs";
import { BiArrowFromBottom, BiArrowFromTop, BiCodeBlock, BiDetail } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import { FaHospitalUser } from "react-icons/fa";
import { TbReportMedical } from "react-icons/tb";
import { MdBedroomChild } from "react-icons/md";
import { Link } from "react-router-dom";
import { ImMenu } from "react-icons/im";
import { FiLogOut } from "react-icons/fi";
import { RiAdminLine } from "react-icons/ri";
import { TbBed } from "react-icons/tb";
import { MdDashboardCustomize } from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();

  const {
    data: { user },
  } = useSelector((state) => state.auth);

  function toggle() {
    setIsOpen(!isOpen);
  }

  return (
    <>
      <div>
        <div style={{ width: isOpen ? "200px" : "70px" }} className={`sidebar`}>
          <div className="top_section">
            <h1 style={{ display: isOpen ? "block" : "none" }} className="logo">
              Care Home
            </h1>
            <div
              style={{ marginLeft: isOpen ? "50px" : "0px" }}
              className="bars"
            >
              <ImMenu onClick={toggle} style={{ cursor: "pointer" }} />
            </div>
          </div>
          <div className="bottomSection">
            <Link className="link" activeclassname="active" to={"/dashboard"}>
              <div className="icon">
                <MdDashboardCustomize className="mainIcon" />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                DashBoard
              </div>
            </Link>

            {user?.userType === "nurse" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/nurseprofile"}
              >
                <div className="icon">
                  <CgProfile className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Profile
                </div>
              </Link>
            ) : null}
            {user?.userType === "nurse" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/addpatient"}
              >
                <div className="icon">
                  <FaAddressBook className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                 Add Project
                </div>
              </Link>
            ) : null}
             {user?.userType === "nurse" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/addDocs"}
              >
                <div className="icon">
                  <FaAngleUp className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                Upload Docs
                </div>
              </Link>
            ) : null}
             {user?.userType === "nurse" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/myDocs"}
              >
                <div className="icon">
                  <FaAppStore className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                Uploads
                </div>
              </Link>
            ) : null}

            {user?.userType === "nurse" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/bookappointment"}
              >
                <div className="icon">
                  <BsBookmarkPlus className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Events
                </div>
              </Link>
            ) : null}
            {/* {user?.userType === "admin" ? (
              <Link className="link" activeclassname="active" to={"/addoctor"}>
                <div className="icon">
                  <AiOutlineUserAdd className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add Staff
                </div>
              </Link>
            ) : null} */}
            {user?.userType === "admin" ? (
              <Link className="link" activeclassname="active" to={"/addnurse"}>
                <div className="icon">
                  <FaUser className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add User
                </div>
              </Link>
            ) : null}
            {user?.userType === "admin" ? (
              <Link className="link" activeclassname="active" to={"/admin"}>
                <div className="icon">
                  <RiAdminLine
                    className="mainIcon"
                    style={{ color: "white" }}
                  />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add Admin
                </div>
              </Link>
            ) : null}

            {/* {user?.userType === "admin" ? (
              <Link className="link" activeclassname="active" to={"/addbeds"}>
                <div className="icon">
                  <TbBed className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add Beds
                </div>
              </Link>
            ) : null} */}

            {/* {user?.userType === "admin" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/addambulance"}
              >
                <div className="icon">
                  <FaAmbulance className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add AMBU
                </div>
              </Link>
            ) : null} */}
            {/* {user?.userType === "admin" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/checkPayment"}
              >
                <div className="icon">
                  <RiSecurePaymentLine className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Payments
                </div>
              </Link>
            ) : null} */}

            {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/doctorprofile"}
              >
                <div className="icon">
                  <SlUserFollow className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Profile
                </div>
              </Link>
            ) : null}
            {/* <Link className="link" activeclassname="active" to={"/rooms"}>
              <div className="icon">
                <MdBedroomChild className="mainIcon" />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                Meetings
              </div>
            </Link> */}
            {user?.userType === "doctor" ? (
              <Link className="link" activeclassname="active" to={"/reports"}>
                <div className="icon">
                  <TbReportMedical className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Add Events
                </div>
              </Link>
            ) : null}
            {/* {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/checkappointment"}
              >
                <div className="icon">
                  <BsFillBookmarkCheckFill className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Events
                </div>
              </Link>
            ) : null} */}
            {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/createslip"}
              >
                <div className="icon">
                  <BiCodeBlock className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Schedule Meeting
                </div>
              </Link>
            ) : null}
            {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/addDocs"}
              >
                <div className="icon">
                  <BiArrowFromBottom className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Docs Upload
                </div>
              </Link>
            ) : null}
            {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/myDocs"}
              >
                <div className="icon">
                  <BiDetail className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Uploads
                </div>
              </Link>
            ) : null}
          {user?.userType === "doctor" ? (
              <Link
                className="link"
                activeclassname="active"
                to={"/bookappointment"}
              >
                <div className="icon">
                  <BsBookmarkPlus className="mainIcon" />
                </div>
                <div
                  style={{ display: isOpen ? "block" : "none" }}
                  className="link_text"
                >
                  Events
                </div>
              </Link>
            ) : null}

            <Link
              className="LogOutPath link"
              onClick={() => {
                dispatch({ type: "AUTH_LOGOUT" });
              }}
              to={"/"}
            >
              <div className="icon">
                <FiLogOut />
              </div>
              <div
                style={{ display: isOpen ? "block" : "none" }}
                className="link_text"
              >
                Logout
              </div>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;

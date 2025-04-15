import { Table } from "antd";
import React from "react";
import { MdPersonAdd } from "react-icons/md";
import { FaUserNurse } from "react-icons/fa";
import { RiEmpathizeLine } from "react-icons/ri";
import { FaBed } from "react-icons/fa";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaAmbulance } from "react-icons/fa";
import { BsFillBookmarkCheckFill } from "react-icons/bs";
import { MdPayment } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";
import Sidebar from "./Sidebar";
import { useEffect } from "react";
import { GetAllData, GetPatients } from "../../../../Redux/Datas/action";
import Projects from "../../../../Components/Table/Projects";
import FeedBack from "../../../../Components/projectRelated/FeedBack";
import ChartModal from "../../../../Components/projectRelated/ChartModal";
import { useDispatch, useSelector } from "react-redux";

const FrontPage = () => {
  useEffect(() => {
      
  },[])
  const {
    data: { user },
  } = useSelector((state) => state.auth);

  const columns = [
    { title: "Name", dataIndex: "patientName", key: "patientName" },
    { title: "Age", dataIndex: "age", key: "age" },
    { title: "Disease", dataIndex: "disease", key: "disease" },
    { title: "Blood Group", dataIndex: "bloodGroup", key: "bloodGroup" },
    { title: "Department", dataIndex: "department", key: "department" },
    { title: "Email", dataIndex: "email", key: "email" },
  ];

  const { patients } = useSelector((store) => store.data.patients);
  const {
    dashboard: { data },
  } = useSelector((store) => store.data);

  console.log(data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(GetPatients());
    dispatch(GetAllData());
  }, []);

  return (
    <div className="container">
      <Sidebar />
      <div className="AfterSideBar">
        <h1 style={{ color: "rgb(184 191 234)" }}>Overview</h1>
        {
          user.userType === "doctor" ?  <ChartModal/> : ""
        }
           
        {/* ************************************* */}
        <div className="patientDetails">
          <h1>Team</h1>
          <div className="patientBox">
            <Projects/>
            {/* <Table columns={columns} dataSource={patients} /> */}
          </div>
        </div>

        {/* <FeedBack/> */}
      </div>
    </div>
  );
};

export default FrontPage;

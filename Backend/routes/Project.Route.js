const express = require("express");
const { ReportModel } = require("../models/Report.model");
const {feedBackS} = require('../models/FeedBackMOdal')
const meetingAdd = require('../models/MeetingModal')
const router = express.Router();
const SeminarModal = require('../models/SeminarModal')
const ProjecctModel = require('../models/project')
const {docsModal} = require('../models/docsModal')
const {DoctorModel} = require('../models/Doctor.model')
router.post("/create", async (req, res) => {
  const payload = req.body;
  console.log('create..',payload)
  try {
    const report = new ProjecctModel(payload);
    await report.save();
    console.log(report,"r")
    res.json(true)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

router.get('/getAllProject', async(req,res)=>{
  try {
    let myProject = await ProjecctModel.find({})
    res.json(myProject)
  } catch (error) {
      console.log(error)
  }
})

router.post("/addDocs", async (req, res) => {

  console.log('docs',req.body)
  try {
    const docs = new docsModal(req.body.dataNew);
    await docs.save();
    console.log(docs,"r")
    res.json(docs)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});


router.get("/getMyDocs/:email", async (req, res) => {
  const  id = req.params.email;
  console.log(id,"----")
  try {
    const feedback = await docsModal.find({email:id});
    res.json(feedback)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});
router.get("/getAllDoctors", async (req, res) => {
  try {
    const doctor = await DoctorModel.find({});
    res.json(doctor)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});


router.get("/updateGuid/:id/:email", async (req, res) => {
  try {
    console.log("update fn")
    let id = req.params.id;
    let email = req.params.email;

    let updatedData = await ProjecctModel.findByIdAndUpdate(
      { _id: id },
      { $set: { guid: email } },
      { new: true }
    );
    
    // Send response back to client
    res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

router.get("/submitWork/:id/:status", async (req, res) => {
  try {
    console.log("submitWork fn")
    let id = req.params.id;
    let status = req.params.status
    var updation = status
    let updatedData = await ProjecctModel.findByIdAndUpdate(
      { _id: id },
      { $set: { status: updation } },
      { new: true }
    );
    
    // Send response back to client
    res.status(200).json(updatedData);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});




router.post("/createFeedBack", async (req, res) => {
  const payload = req.body;
  console.log('create..',payload)
  try {
    const report = new feedBackS(payload);
    await report.save();
    console.log(report,"r")
    res.json(true)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

router.get("/getFeedBack/:id", async (req, res) => {
  const  id = req.params.id;
  console.log(id,"----")
  // console.log('create..',payload)
  try {
    const feedback = await feedBackS.find({selectedProjectId:id});
    res.json(feedback)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

router.post("/SeminarAdd", async (req, res) => {
  const payload = req.body;
  console.log('create..',payload)
  try {
    const seminar = await SeminarModal.create(payload)
    // await seminar.save();
    console.log(seminar,"r")
    res.json(true)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});

router.get("/getAllSeminars", async (req, res) => {
  try {
    const seminar = await SeminarModal.find({})
    // await seminar.save();
    console.log(seminar,"r")
    res.json(seminar)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});
router.post("/meetingAdd", async (req, res) => {
  const payload = req.body;
  console.log('create..',payload)
  try {
    const report = new meetingAdd(payload);
    await report.save();
    console.log(report,"r")
    res.json(true)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});
router.post("/Mymeetings", async (req, res) => {
  const {email} = req.body;
  console.log(email,"-----------------------")

  try {
    const meeting = await meetingAdd.find({participants:email});
    console.log(meeting,"r")
    res.json(meeting)
  } catch (error) {
    console.log(error)
    res.send(error);
  }
});
router.get('/getMyproject/:email', async(req,res)=>{
  try {
    let myProject = await ProjecctModel.find({selectedNurse4:req.params.email})
    res.json(myProject)
  } catch (error) {
      console.log(error)
  }
})
router.patch("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  const payload = req.body;
  try {
    const report = await ReportModel.findByIdAndUpdate({ _id: id }, payload);
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} updated`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Update." });
  }
});

router.delete("/:reportId", async (req, res) => {
  const id = req.params.reportId;
  try {
    const report = await ReportModel.findByIdAndDelete({ _id: id });
    if (!report) {
      res.status(404).send({ msg: `Report with id ${id} not found` });
    }
    res.status(200).send(`Report with id ${id} deleted`);
  } catch (error) {
    console.log(error);
    res.status(400).send({ error: "Something went wrong, unable to Delete." });
  }
});

module.exports = router;

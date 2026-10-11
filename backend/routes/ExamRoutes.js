const express = require("express");
const router = express.Router();
const Exam = require("../models/Exam");

router.get("/", async (req, res) => {
  try {
    const exams = await Exam.find();
    res.json(exams);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve exams",
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const exam = await Exam.create(req.body);
    res.status(201).json(exam);
  } catch (error) {
    res.status(400).json({
      message: "Failed to create exam",
      error: error.message,
    });
  }
});

module.exports = router;
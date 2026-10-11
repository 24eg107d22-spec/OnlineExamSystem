
const express = require("express");
const router = express.Router();
const Result = require("../models/Result");

// GET - Retrieve all student results
router.get("/", async (req, res) => {
  try {
    const results = await Result.find()
      .populate("examId", "title subject")
      .sort({ createdAt: -1 });

    res.json(results);
  } catch (error) {
    res.status(500).json({
      message: "Failed to retrieve results",
      error: error.message,
    });
  }
});

// POST - Save a student's exam result
router.post("/", async (req, res) => {
  try {
    const {
      examId,
      studentName,
      studentEmail,
      score,
      total,
      percentage,
      status,
    } = req.body;

    const result = await Result.create({
      examId,
      studentName,
      studentEmail,
      score,
      total,
      percentage,
      status,
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save result",
      error: error.message,
    });
  }
});

module.exports = router;


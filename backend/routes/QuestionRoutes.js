
const express = require("express");
const router = express.Router();
const Question = require("../models/Question");

// GET questions for a particular exam
router.get("/:examId", async (req, res) => {
  try {
    const questions = await Question.find({
      examId: req.params.examId,
    });

    res.json(questions);
  } catch (error) {
    res.status(400).json({
      message: "Failed to retrieve questions",
      error: error.message,
    });
  }
});

// POST - Save a new question
router.post("/", async (req, res) => {
  try {
    const { examId, questionText, options, correctAnswer } = req.body;

    const question = await Question.create({
      examId,
      questionText,
      options,
      correctAnswer,
    });

    res.status(201).json(question);
  } catch (error) {
    res.status(400).json({
      message: "Failed to save question",
      error: error.message,
    });
  }
});

module.exports = router;

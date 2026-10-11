
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();
const examRoutes = require("./routes/ExamRoutes");
const questionRoutes = require("./routes/QuestionRoutes");
const resultRoutes = require("./routes/ResultRoutes");

const app = express();

app.use(cors());
app.use(express.json());
app.get("/api/exams/check", (req, res) => {
  res.send("EXAM API PATH WORKING");
});
app.use("/api/exams", examRoutes);
app.use("/api/questions", questionRoutes);
app.use("/api/results", resultRoutes);
app.get("/", (req, res) => {
  res.send("Online Examination Backend is Running!");
});
app.get("/test-route", (req, res) => {
  res.send("NEW BACKEND IS WORKING");
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error.message);
  });

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Backend server running on port ${PORT}`);
  console.log("CURRENT SERVER PID:", process.pid);
});

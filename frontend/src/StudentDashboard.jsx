
import { useEffect, useState } from "react";
import {
  getExams,
  getQuestions,
  getResults
} from "./examStorage";
import { fetchExams, fetchQuestions } from "./api";

function StudentDashboard({ goBack, goToExam }) {

  const [exams, setExams] = useState([]);
const [loading, setLoading] = useState(true);
const [loadError, setLoadError] = useState("");

useEffect(() => {
  let active = true;

  async function loadExams() {
    try {
      const data = await fetchExams();

      if (active) {
        setExams(data);
      }
    } catch (error) {
      console.error("Error loading exams:", error);

      if (active) {
        setLoadError("Unable to load exams from MongoDB.");
      }
    } finally {
      if (active) {
        setLoading(false);
      }
    }
  }

  loadExams();

  return () => {
    active = false;
  };
}, []);
  
const [questions, setQuestions] = useState([]);

useEffect(() => {
  let active = true;

  async function loadQuestions() {
    try {
      const examData = await fetchExams();

      const questionLists = await Promise.all(
        examData.map((exam) => fetchQuestions(exam._id))
      );

      if (active) {
        setQuestions(questionLists.flat());
      }
    } catch (error) {
      console.error("Error loading questions:", error);
    }
  }

  loadQuestions();

  return () => {
    active = false;
  };
}, []);

  const [results] = useState(() => getResults());

   function getQuestionCount(examId) {
  return questions.filter(
    (question) => String(question.examId) === String(examId)
  ).length;
}
  const readyExams = exams.filter(
    (exam) =>
      getQuestionCount(exam.id) >= exam.totalQuestions
  );

  const averageScore = results.length > 0
    ? (
        results.reduce(
          (sum, result) => sum + result.percentage,
          0
        ) / results.length
      ).toFixed(1)
    : null;

  const sortedResults = [...results].sort(
    (a, b) =>
      new Date(b.submittedAt) - new Date(a.submittedAt)
  );

  return (
    <div className="dashboard">

      <header className="dashboard-header">
        <h1>Student Dashboard</h1>

        <button onClick={goBack}>
          Back to Home
        </button>
      </header>

      <div className="dashboard-content">

        <h2>Welcome, Student!</h2>
        <p>Here are your available examinations.</p>

        <div className="stats-container">

          <div className="stat-card">
            <h3>Total Exams</h3>
            <h2>{exams.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Ready Exams</h3>
            <h2>{readyExams.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Completed Attempts</h3>
            <h2>{results.length}</h2>
          </div>

          <div className="stat-card">
            <h3>Average Score</h3>
            <h2>
              {averageScore === null
                ? "--"
                : `${averageScore}%`}
            </h2>
          </div>

        </div>

        <h2>Available Examinations</h2>
        {loading && <p>Loading exams from MongoDB...</p>}
{loadError && <p style={{ color: "red" }}>{loadError}</p>}

        {!loading && !loadError && exams.length === 0 ? (
          <p>No examinations are available yet.</p>
        ) : (
          <div className="exam-list">

            {exams.map((exam) => {

              const questionCount =
               getQuestionCount(exam._id);

              const isReady =
                questionCount >= exam.totalQuestions;

              return (
                <div className="exam-card" key={exam.id}>

                  <h3>{exam.title}</h3>

                  <p>Subject: {exam.subject}</p>

                  <p>
                    Duration: {exam.duration} minutes
                  </p>

                  <p>
                    Total Questions: {exam.totalQuestions}
                  </p>

                  <p>
                    Exam Date: {exam.examDate}
                  </p>

                  <p>
                    Questions Ready: {questionCount}
                    /{exam.totalQuestions}
                  </p>

                  <button
                    onClick={() => goToExam(exam)}
                    disabled={!isReady}
                    className={
                      isReady
                        ? "start-exam-button"
                        : "exam-not-ready-button"
                    }
                  >
                    {isReady
                      ? "Start Exam"
                      : "Exam Not Ready"}
                  </button>

                </div>
              );
            })}

          </div>
        )}

        <h2 className="result-history-heading">
          Examination Result History
        </h2>

        {sortedResults.length === 0 ? (
          <p>
            No examination results available yet.
            Complete an exam to see your history.
          </p>
        ) : (
          <div className="result-history-list">

            {sortedResults.map((result) => (
              <div
                className="result-history-card"
                key={result.id}
              >

                <div>
                  <h3>{result.examTitle}</h3>

                  <p>Subject: {result.subject}</p>

                  <p>
                    Score: {result.score}
                    /{result.total}
                  </p>
                  
<p>
  Percentage:{" "}
  {result.total > 0
    ? ((result.score / result.total) * 100).toFixed(1)
    : "0.0"}
  %
</p>

<div
  style={{
    width: "100%",
    height: "12px",
    backgroundColor: "#e2e8f0",
    borderRadius: "8px",
    overflow: "hidden",
    marginTop: "10px",
    marginBottom: "15px",
  }}
>
  <div
    style={{
      width: `${
        result.total > 0
          ? Math.min(
              100,
              Math.max(0, (result.score / result.total) * 100)
            )
          : 0
      }%`,
      height: "100%",
      backgroundColor:
        result.total > 0 &&
        (result.score / result.total) * 100 >= 40
          ? "#16a34a"
          : "#dc2626",
      borderRadius: "8px",
    }}
  />
</div>


<p>
  Status:{" "}
  <span
    style={{
      color:
        result.total > 0 &&
        (result.score / result.total) * 100 >= 40
          ? "green"
          : "red",
      fontWeight: "bold",
    }}
  >
    {result.total > 0 &&
    (result.score / result.total) * 100 >= 40
      ? "PASS"
      : "FAIL"}
  </span>
</p>


                  <p>
                    Submitted:{" "}
                    {new Date(
                      result.submittedAt
                    ).toLocaleString()}
                  </p>
                </div>

                <div className="result-percentage">
                  {result.percentage}%
                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
}

export default StudentDashboard;

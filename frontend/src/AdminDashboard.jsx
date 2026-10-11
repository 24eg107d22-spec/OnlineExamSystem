
import { useEffect, useState } from "react";
import {
  fetchExams,
  fetchQuestions,
  fetchResults
} from "./api";

function AdminDashboard({
  goBack,
  goToCreateExam,
  goToManageQuestions,
  goToResults
}) {
  const [exams, setExams] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadDashboard() {
      try {
        const [examData, resultData] = await Promise.all([
          fetchExams(),
          fetchResults()
        ]);

        const questionLists = await Promise.all(
          examData.map((exam) => fetchQuestions(exam._id))
        );

        if (!active) return;

        setExams(examData);
        setQuestions(questionLists.flat());
        setResults(resultData);
        setError("");
      } catch (err) {
        console.error("Dashboard loading error:", err);

        if (active) {
          setError(
            "Unable to load dashboard data. Check your backend connection."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadDashboard();

    return () => {
      active = false;
    };
  }, []);

  const totalExams = exams.length;
  const totalQuestions = questions.length;
  const totalSubmissions = results.length;

  const readyExams = exams.filter((exam) => {
    const questionCount = questions.filter(
      (question) =>
        String(question.examId?._id || question.examId) ===
        String(exam._id)
    ).length;

    return (
      Number(exam.totalQuestions) > 0 &&
      questionCount >= Number(exam.totalQuestions)
    );
  }).length;

  const averageScore =
    totalSubmissions > 0
      ? (
          results.reduce(
            (sum, result) =>
              sum + Number(result.percentage || 0),
            0
          ) / totalSubmissions
        ).toFixed(1)
      : null;

  const stats = [
    { title: "Total Exams", value: totalExams },
    { title: "Total Questions", value: totalQuestions },
    { title: "Ready Exams", value: readyExams },
    { title: "Submitted Results", value: totalSubmissions },
    {
      title: "Average Score",
      value:
        averageScore === null ? "--" : `${averageScore}%`
    }
  ];

  function handleViewStudents() {
    alert(
      "Student management is not yet implemented in this prototype."
    );
  }

  return (
    <div className="admin-dashboard">
      <header className="admin-dashboard-header">
        <div>
          <h1>Admin Dashboard</h1>
          <p>Online Examination System</p>
        </div>

        <button onClick={goBack}>
          Back to Home
        </button>
      </header>

      <main className="admin-dashboard-content">
        <h2>Welcome, Administrator!</h2>

        <p>
          Manage examinations, questions, and results.
        </p>

        {loading && <p>Loading MongoDB dashboard data...</p>}

        {error && (
          <p style={{ color: "red" }}>{error}</p>
        )}

        {!loading && !error && (
          <div className="admin-stats">
            {stats.map((stat) => (
              <div
                className="admin-stat-card"
                key={stat.title}
              >
                <h3>{stat.title}</h3>
                <h2>{stat.value}</h2>
              </div>
            ))}
          </div>
        )}

        <h2>Quick Actions</h2>

        <div className="admin-actions">
          <button onClick={goToCreateExam}>
            Create Exam
          </button>

          <button onClick={goToManageQuestions}>
            Manage Questions
          </button>

          <button onClick={handleViewStudents}>
            View Students
          </button>

          <button onClick={goToResults}>
            View Results
          </button>
        </div>
      </main>
    </div>
  );
}

export default AdminDashboard;

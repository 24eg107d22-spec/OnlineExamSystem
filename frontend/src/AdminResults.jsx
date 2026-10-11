
import { useEffect, useState } from "react";
import { fetchExams, fetchResults } from "./api";

function AdminResults({ goBack }) {
  const [exams, setExams] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedExam, setSelectedExam] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;

    async function loadData() {
      try {
        const [examData, resultData] = await Promise.all([
          fetchExams(),
          fetchResults(),
        ]);

        if (active) {
          setExams(examData);
          setResults(resultData);
          setError("");
        }
      } catch (err) {
        console.error("Unable to load results:", err);
        if (active) {
          setError(
            "Unable to load results. Check that your backend is running."
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadData();

    return () => {
      active = false;
    };
  }, []);

  const filteredResults = results.filter(
    (result) =>
      selectedExam === "all" ||
      String(result.examId?._id || result.examId) === selectedExam
  );

  const sortedResults = [...filteredResults].sort(
    (a, b) =>
      new Date(b.submittedAt || b.createdAt || 0) -
      new Date(a.submittedAt || a.createdAt || 0)
  );

  const averageScore = filteredResults.length
    ? (
        filteredResults.reduce(
          (sum, result) => sum + Number(result.percentage || 0),
          0
        ) / filteredResults.length
      ).toFixed(1)
    : null;

  function getExam(result) {
    const id = String(result.examId?._id || result.examId);

    return exams.find((exam) => String(exam._id) === id);
  }

  return (
    <div className="admin-results-page">
      <div className="admin-results-container">
        <h1>Admin Results Management</h1>
        <p>View and filter submitted examination results.</p>

        {loading && <p>Loading results from MongoDB...</p>}
        {error && <p style={{ color: "red" }}>{error}</p>}

        <div className="admin-results-stats">
          <div className="admin-result-stat">
            <h3>Total Submissions</h3>
            <h2>{filteredResults.length}</h2>
          </div>

          <div className="admin-result-stat">
            <h3>Average Score</h3>
            <h2>
              {averageScore === null ? "--" : `${averageScore}%`}
            </h2>
          </div>
        </div>

        <div className="admin-results-filter">
          <label htmlFor="exam-filter">
            Filter by Examination
          </label>

          <select
            id="exam-filter"
            value={selectedExam}
            onChange={(e) => setSelectedExam(e.target.value)}
          >
            <option value="all">All Examinations</option>

            {exams.map((exam) => (
              <option key={exam._id} value={exam._id}>
                {exam.title}
              </option>
            ))}
          </select>
        </div>

        <h2>Submitted Results</h2>

        {!loading && !error && sortedResults.length === 0 ? (
          <div className="admin-results-empty">
            <p>No examination results found for this filter.</p>
          </div>
        ) : (
          <div className="admin-results-list">
            {sortedResults.map((result) => {
              const exam = getExam(result);

              return (
                <div
                  className="admin-result-card"
                  key={result._id || result.id}
                >
                  <div className="admin-result-info">
                    <h3>
                      {exam?.title ||
                        result.examId?.title ||
                        "Examination"}
                    </h3>

                    <p>
                      Subject:{" "}
                      {exam?.subject ||
                        result.examId?.subject ||
                        "Not available"}
                    </p>

                    <p>
                      Student: {result.studentName || "Unknown"}
                    </p>

                    <p>
                      Email: {result.studentEmail || "Not available"}
                    </p>

                    <p>
                      Score: {result.score}/{result.total}
                    </p>

                    <p>
                      Status:{" "}
                      <strong>
                        {result.status ||
                          (Number(result.percentage) >= 40
                            ? "PASS"
                            : "FAIL")}
                      </strong>
                    </p>

                    <p>
                      Submitted:{" "}
                      {result.submittedAt || result.createdAt
                        ? new Date(
                            result.submittedAt || result.createdAt
                          ).toLocaleString()
                        : "Not available"}
                    </p>
                  </div>

                  <div className="admin-result-percentage">
                    {result.percentage}%
                  </div>
                </div>
              );
            })}
          </div>
        )}

        <button className="back-button" onClick={goBack}>
          Back to Admin Dashboard
        </button>
      </div>
    </div>
  );
}

export default AdminResults;

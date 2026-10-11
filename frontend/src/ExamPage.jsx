
import { useEffect, useRef, useState } from "react";
import { fetchQuestions, createResult } from "./api";

function ExamPage({ exam, goBack }) {
  const examId = exam._id || exam.id;
  const answersKey = `examAnswers_${examId}`;
  const reviewKey = `examReview_${examId}`;
  const timerKey = `examTimer_${examId}`;

  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [answers, setAnswers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(answersKey) || "{}");
    } catch {
      return {};
    }
  });

  const [markedForReview, setMarkedForReview] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(reviewKey) || "[]");
    } catch {
      return [];
    }
  });

  const [result, setResult] = useState(null);
  const [saving, setSaving] = useState(false);
  const submittedRef = useRef(false);

  const [endTime] = useState(() => {
    const saved = Number(localStorage.getItem(timerKey));

    if (saved > 0) return saved;

    const newEndTime =
      Date.now() + Number(exam.duration || 10) * 60000;

    localStorage.setItem(timerKey, String(newEndTime));
    return newEndTime;
  });

  const [timeLeft, setTimeLeft] = useState(() =>
    Math.max(0, Math.ceil((endTime - Date.now()) / 1000))
  );

  useEffect(() => {
    let active = true;

    async function loadQuestions() {
      try {
        const data = await fetchQuestions(examId);
        if (active) setQuestions(data);
      } catch (error) {
        console.error(error);
        if (active) {
          setLoadError("Unable to load questions from MongoDB.");
        }
      } finally {
        if (active) setLoading(false);
      }
    }

    loadQuestions();
    return () => {
      active = false;
    };
  }, [examId]);

  useEffect(() => {
    if (!result) {
      localStorage.setItem(answersKey, JSON.stringify(answers));
    }
  }, [answers, answersKey, result]);

  useEffect(() => {
    if (!result) {
      localStorage.setItem(
        reviewKey,
        JSON.stringify(markedForReview)
      );
    }
  }, [markedForReview, reviewKey, result]);

  const questionId = (question) => question._id || question.id;

  function selectAnswer(option) {
    if (saving) return;

    setAnswers((previous) => ({
      ...previous,
      [questionId(questions[currentIndex])]: option,
    }));
  }

  async function submitExam(autoSubmit = false) {
    if (submittedRef.current || result || loading) return;
    if (questions.length === 0) return;

    if (
      !autoSubmit &&
      !window.confirm("Are you sure you want to submit?")
    ) {
      return;
    }

    submittedRef.current = true;
    setSaving(true);

    let score = 0;

    questions.forEach((question) => {
      const selected = answers[questionId(question)];
      const correct = question.correctAnswer;

      // Supports both "A" and the actual answer text.
      const correctLetter = ["A", "B", "C", "D"].find(
        (letter, index) =>
          letter === correct ||
          question.options[index] === correct
      );

      if (selected && selected === correctLetter) {
        score++;
      }
    });

    const total = questions.length;
    const percentage = Number(
      ((score / total) * 100).toFixed(1)
    );

    const newResult = {
      examId,
      studentName:
        localStorage.getItem("studentName") || "Demo Student",
      studentEmail:
        localStorage.getItem("studentEmail") || "demo@example.com",
      score,
      total,
      percentage,
      status: percentage >= 40 ? "PASS" : "FAIL",
    };

    try {
      const savedResult = await createResult(newResult);

      localStorage.removeItem(timerKey);
      localStorage.removeItem(answersKey);
      localStorage.removeItem(reviewKey);

      setResult(savedResult);

      alert(
        autoSubmit
          ? "Time is up! Your exam was submitted."
          : "Result saved successfully to MongoDB!"
      );
    } catch (error) {
      console.error("Result save failed:", error);
      submittedRef.current = false;
      alert(
        "Could not save your result. Check the backend and try again."
      );
    } finally {
      setSaving(false);
    }
  }

  useEffect(() => {
    if (loading || result || questions.length === 0) return;

    const interval = setInterval(() => {
      const remaining = Math.max(
        0,
        Math.ceil((endTime - Date.now()) / 1000)
      );
      setTimeLeft(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [endTime, loading, result, questions.length]);

  useEffect(() => {
    if (
      !loading &&
      questions.length > 0 &&
      timeLeft === 0 &&
      !submittedRef.current
    ) {
      submitExam(true);
    }
  }, [timeLeft, loading, questions.length]);

  const currentQuestion = questions[currentIndex];

  const answeredCount = questions.filter(
    (question) => answers[questionId(question)] !== undefined
  ).length;

  const progressPercentage = questions.length
    ? Math.round((answeredCount / questions.length) * 100)
    : 0;

  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  const formattedTime =
    `${String(minutes).padStart(2, "0")}:` +
    `${String(seconds).padStart(2, "0")}`;

  if (result) {
    return (
      <div className="exam-page">
        <div className="exam-result-box">
          <h1>Examination Submitted!</h1>
          <h2>{exam.title}</h2>
          <p>Your Score</p>
          <h1>{result.score} / {result.total}</h1>
          <h2>{Number(result.percentage).toFixed(1)}%</h2>
          <h3>{result.status}</h3>
          <p>Result saved in MongoDB</p>
          <button onClick={goBack}>
            Back to Student Dashboard
          </button>
        </div>
      </div>
    );
  }

  if (loading || loadError || questions.length === 0) {
    return (
      <div className="exam-page">
        <div className="exam-result-box">
          <h2>
            {loading
              ? "Loading examination..."
              : loadError || "No questions available."}
          </h2>
          <button onClick={goBack}>Back to Dashboard</button>
        </div>
      </div>
    );
  }

  return (
    <div className="exam-page">
      <div className="exam-container">
        <header className="exam-header">
          <h1>{exam.title}</h1>
          <p>Subject: {exam.subject}</p>
          <p>Duration: {exam.duration} minutes</p>
        </header>

        <div
          className={
            timeLeft <= 60
              ? "exam-timer exam-timer-warning"
              : "exam-timer"
          }
        >
          <span>Time Remaining</span>
          <strong>{formattedTime}</strong>
        </div>

        <div className="exam-progress">
          <div className="exam-progress-header">
            <h3>Examination Progress</h3>
            <span>
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          <div className="exam-progress-track">
            <div
              className="exam-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="exam-progress-footer">
            <span>
              {questions.length - answeredCount} questions remaining
            </span>
            <strong>{progressPercentage}%</strong>
          </div>
        </div>

        <div className="question-navigation">
          <h3>Question Navigation</h3>
          <div className="question-navigation-grid">
            {questions.map((question, index) => {
              const id = questionId(question);
              const isAnswered = answers[id] !== undefined;
              const isMarked = markedForReview.includes(id);

              return (
                <button
                  key={id}
                  type="button"
                  disabled={saving}
                  className={`question-nav-button ${
                    currentIndex === index
                      ? "current"
                      : isMarked
                      ? "marked"
                      : isAnswered
                      ? "answered"
                      : "unanswered"
                  }`}
                  onClick={() => setCurrentIndex(index)}
                >
                  {index + 1}
                </button>
              );
            })}
          </div>
          <div className="question-navigation-legend">
            <span>🟩 Answered</span>
            <span>🟦 Current Question</span>
            <span>🟪 Marked for Review</span>
            <span>⬜ Not Answered</span>
          </div>
        </div>

        <div className="exam-progress">
          <p>
            Question {currentIndex + 1} of {questions.length}
          </p>
          <p>Answered: {answeredCount}/{questions.length}</p>
        </div>

        <div className="exam-question-box">
          <h2>
            Q{currentIndex + 1}. {currentQuestion.questionText}
          </h2>

          <button
            type="button"
            className="mark-review-button"
            disabled={saving}
            onClick={() => {
              const id = questionId(currentQuestion);
              setMarkedForReview((previous) =>
                previous.includes(id)
                  ? previous.filter((item) => item !== id)
                  : [...previous, id]
              );
            }}
          >
            {markedForReview.includes(questionId(currentQuestion))
              ? "★ Remove Mark for Review"
              : "☆ Mark for Review"}
          </button>

          {currentQuestion.options.map((value, index) => {
            const letter = ["A", "B", "C", "D"][index];
            const id = questionId(currentQuestion);

            return (
              <label className="exam-option" key={letter}>
                <input
                  type="radio"
                  name={`question-${id}`}
                  value={letter}
                  disabled={saving}
                  checked={answers[id] === letter}
                  onChange={() => selectAnswer(letter)}
                />
                <span>{letter}. {value}</span>
              </label>
            );
          })}
        </div>

        <div className="exam-navigation">
          <button
            disabled={currentIndex === 0 || saving}
            onClick={() => setCurrentIndex(currentIndex - 1)}
          >
            Previous
          </button>

          {currentIndex < questions.length - 1 ? (
            <button
              disabled={saving}
              onClick={() => setCurrentIndex(currentIndex + 1)}
            >
              Next Question
            </button>
          ) : (
            <button
              className="submit-exam-button"
              disabled={saving}
              onClick={() => submitExam(false)}
            >
              {saving ? "Saving Result..." : "Submit Exam"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ExamPage;


import { createExam } from "./api";
import { saveExam } from "./examStorage";

function CreateExam({ goBack }) {
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [duration, setDuration] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [examDate, setExamDate] = useState("");

  
async function handleSubmit(event) {
  event.preventDefault();

  const exam = {
    title: title.trim(),
    subject: subject.trim(),
    duration: Number(duration),
    totalQuestions: Number(totalQuestions),
    examDate: examDate,
  };

  if (
    !exam.title ||
    !exam.subject ||
    !Number.isInteger(exam.duration) ||
    exam.duration < 1 ||
    !Number.isInteger(exam.totalQuestions) ||
    exam.totalQuestions < 1 ||
    !exam.examDate
  ) {
    alert("Please enter valid examination details.");
    return;
  }

  try {
    await createExam(exam);

    alert("Examination saved successfully to MongoDB!");

    setTitle("");
    setSubject("");
    setDuration("");
    setTotalQuestions("");
    setExamDate("");
  } catch (error) {
    console.error("Error saving examination:", error);
    alert("Unable to save examination. Please check the backend server.");
  }
}

  return (
    <div className="create-exam-page">
      <div className="create-exam-box">

        <h1>Create New Examination</h1>
        <p>Enter the examination details below.</p>

        <form onSubmit={handleSubmit}>

          <label>Examination Title</label>
          <input
            type="text"
            placeholder="Example: AI Midterm Exam"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Subject</label>
          <input
            type="text"
            placeholder="Example: Artificial Intelligence"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />

          <label>Duration (Minutes)</label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Example: 30"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
            required
          />

          <label>Total Questions</label>
          <input
            type="number"
            min="1"
            step="1"
            placeholder="Example: 20"
            value={totalQuestions}
            onChange={(e) => setTotalQuestions(e.target.value)}
            required
          />

          <label>Examination Date</label>
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            required
          />

          <button type="submit">
            Create Examination
          </button>

        </form>

        <button className="back-button" onClick={goBack}>
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default CreateExam;

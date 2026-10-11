
import { useEffect, useState } from "react";
import { fetchExams, fetchQuestions, createQuestion } from "./api";


function ManageQuestions({ goBack }) {
 
const [exams, setExams] = useState([]);

useEffect(() => {
  async function loadExams() {
    try {
      const data = await fetchExams();
      setExams(data);
    } catch (error) {
      console.error("Unable to load exams:", error);
      alert("Unable to load examinations from MongoDB.");
    }
  }

  loadExams();
}, []);

  
const [questions, setQuestions] = useState([]);
  const [examId, setExamId] = useState("");
  const [question, setQuestion] = useState("");
  const [optionA, setOptionA] = useState("");
  const [optionB, setOptionB] = useState("");
  const [optionC, setOptionC] = useState("");
  const [optionD, setOptionD] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");
 
useEffect(() => {
  if (!examId) {
    setQuestions([]);
    return;
  }

  let active = true;

  async function loadQuestions() {
    try {
      const data = await fetchQuestions(examId);

      if (active) {
        setQuestions(data);
      }
    } catch (error) {
      console.error("Error loading questions:", error);

      if (active) {
        setQuestions([]);
        alert("Unable to load questions from MongoDB.");
      }
    }
  }

  loadQuestions();

  return () => {
    active = false;
  };
}, [examId]);
 

 const selectedExam = exams.find(
  (exam) => exam._id === examId
); 

  const examQuestions = questions.filter(
    (item) => item.examId === examId
  );

 async function handleAddQuestion(event) {
    event.preventDefault();

    if (!selectedExam) {
      alert("Please select an examination.");
      return;
    }

    if (examQuestions.length >= selectedExam.totalQuestions) {
      alert("This exam already has its planned number of questions.");
      return;
    }
const newQuestion = {
  examId,
  questionText: question.trim(),
  options: [
    optionA.trim(),
    optionB.trim(),
    optionC.trim(),
    optionD.trim()
  ],
  correctAnswer
};

    if (
  !newQuestion.questionText ||
  newQuestion.options.some((option) => !option) ||
  !correctAnswer
) {
  alert("Please complete all question fields.");
  return;
}

    try {
     await createQuestion(newQuestion);

const updatedQuestions = await fetchQuestions(examId);
setQuestions(updatedQuestions);

  

  alert("Question saved successfully to MongoDB!");

  setQuestion("");
  setOptionA("");
  setOptionB("");
  setOptionC("");
  setOptionD("");
  setCorrectAnswer("");
} catch (error) {
  console.error("Error saving question:", error);
  alert("Unable to save question to MongoDB.");
}
  }

  function deleteQuestion(id) {
    try {
      deleteStoredQuestion(id);
      setQuestions(getQuestions());
    } catch {
      alert("Unable to delete question.");
    }
  }

  return (
    <div className="questions-page">
      <div className="questions-container">

        <h1>Manage Questions</h1>
        <p>Select an examination and add its MCQ questions.</p>

        <div className="question-form-box">

          <h2>Add New Question</h2>

          <form onSubmit={handleAddQuestion}>

            <label>Select Examination</label>
            <select
              value={examId}
              onChange={(e) => setExamId(e.target.value)}
              required
            >
              <option value="">Choose an examination</option>

             {exams.map((exam) => (
  <option key={exam._id} value={exam._id}>
    {exam.title} - {exam.subject}
  </option>
))}
            </select>

            {exams.length === 0 && (
              <p>
                No examinations found.
                Please create an examination first.
              </p>
            )}

            {selectedExam && (
              <p>
                Questions added: {examQuestions.length}
                /{selectedExam.totalQuestions}
              </p>
            )}

            <label>Question</label>
            <textarea
              placeholder="Enter your question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              required
            />

            <label>Option A</label>
            <input
              type="text"
              value={optionA}
              onChange={(e) => setOptionA(e.target.value)}
              required
            />

            <label>Option B</label>
            <input
              type="text"
              value={optionB}
              onChange={(e) => setOptionB(e.target.value)}
              required
            />

            <label>Option C</label>
            <input
              type="text"
              value={optionC}
              onChange={(e) => setOptionC(e.target.value)}
              required
            />

            <label>Option D</label>
            <input
              type="text"
              value={optionD}
              onChange={(e) => setOptionD(e.target.value)}
              required
            />

            <label>Correct Answer</label>
            <select
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              required
            >
              <option value="">Select Correct Answer</option>
              <option value="A">Option A</option>
              <option value="B">Option B</option>
              <option value="C">Option C</option>
              <option value="D">Option D</option>
            </select>

            <button type="submit" disabled={exams.length === 0}>
              Add Question
            </button>

          </form>
        </div>

        <div className="questions-list">

          <h2>
            Questions for Selected Exam ({examQuestions.length})
          </h2>

          {!selectedExam ? (
            <p>Select an examination to view its questions.</p>
          ) : examQuestions.length === 0 ? (
            <p>No questions added to this examination yet.</p>
          ) : (
            examQuestions.map((item, index) => (
             <div className="question-card" key={item._id}> 

               <h3>Q{index + 1}. {item.questionText}</h3>

                <p>A. {item.options[0]}</p>
<p>B. {item.options[1]}</p>
<p>C. {item.options[2]}</p>
<p>D. {item.options[3]}</p>

                <p className="correct-answer">
                  Correct Answer: Option {item.correctAnswer}
                </p>

               <button
  className="delete-question-button"
  disabled
  title="MongoDB question deletion is not connected yet"
>
  Delete Question (Coming Soon)
</button>

              </div>
            ))
          )}

        </div>

        <button className="back-button" onClick={goBack}>
          Back to Dashboard
        </button>

      </div>
    </div>
  );
}

export default ManageQuestions;

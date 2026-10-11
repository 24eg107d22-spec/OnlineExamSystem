
import { useState } from "react";
function ExamInstructions({ exam, onStart, goBack }) {
    
const [instructionsAccepted, setInstructionsAccepted] = useState(false);
  return (
    <div className="exam-instructions-page">
      <div className="exam-instructions-box">
        <h1>Examination Instructions</h1>

        <h2>{exam.title}</h2>

        <p>Subject: {exam.subject}</p>
        <p>Duration: {exam.duration} minutes</p>
        <p>Total Questions: {exam.totalQuestions}</p>

        <h3>Important Instructions</h3>

        <ol>
          <li>Read each question carefully.</li>
          <li>Select one answer for each question.</li>
          <li>Use the navigation panel to switch questions.</li>
          <li>You can mark questions for review.</li>
          <li>Your answers are saved during the exam.</li>
          <li>
            The exam will be submitted automatically
            when the timer reaches zero.
          </li>
        </ol>

       
<label className="exam-instructions-confirmation">
  <input
    type="checkbox"
    checked={instructionsAccepted}
    onChange={(event) =>
      setInstructionsAccepted(event.target.checked)
    }
  />
  I have read and understood the examination instructions.
</label>

<button
  type="button"
  onClick={onStart}
  disabled={!instructionsAccepted}
>
  Start Examination
</button>


        <button type="button" onClick={goBack}>
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}

export default ExamInstructions;

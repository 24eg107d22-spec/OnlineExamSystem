
const EXAMS_KEY = "onlineExamSystem_exams";
const QUESTIONS_KEY = "onlineExamSystem_questions";
const RESULTS_KEY = "onlineExamSystem_results";

function readList(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || "[]");
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

// EXAM STORAGE

export function getExams() {
  return readList(EXAMS_KEY);
}

export function saveExam(exam) {
  const exams = getExams();

  localStorage.setItem(
    EXAMS_KEY,
    JSON.stringify([...exams, exam])
  );
}

// QUESTION STORAGE

export function getQuestions() {
  return readList(QUESTIONS_KEY);
}

export function saveQuestion(question) {
  const questions = getQuestions();

  localStorage.setItem(
    QUESTIONS_KEY,
    JSON.stringify([...questions, question])
  );
}

export function deleteStoredQuestion(id) {
  const updated = getQuestions().filter(
    (question) => question.id !== id
  );

  localStorage.setItem(
    QUESTIONS_KEY,
    JSON.stringify(updated)
  );
}

// RESULT STORAGE

export function getResults() {
  return readList(RESULTS_KEY);
}

export function saveResult(result) {
  const results = getResults();

  localStorage.setItem(
    RESULTS_KEY,
    JSON.stringify([...results, result])
  );
}

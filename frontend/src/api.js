
const API_URL = "http://localhost:5000/api";

// EXAM APIs

export async function fetchExams() {
  const response = await fetch(`${API_URL}/exams`);

  if (!response.ok) {
    throw new Error("Failed to fetch exams");
  }

  return response.json();
}

export async function createExam(exam) {
  const response = await fetch(`${API_URL}/exams`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(exam),
  });

  if (!response.ok) {
    throw new Error("Failed to create exam");
  }

  return response.json();
}

// QUESTION APIs

export async function fetchQuestions(examId) {
  const response = await fetch(`${API_URL}/questions/${examId}`);

  if (!response.ok) {
    throw new Error("Failed to fetch questions");
  }

  return response.json();
}

export async function createQuestion(question) {
  const response = await fetch(`${API_URL}/questions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(question),
  });

  if (!response.ok) {
    throw new Error("Failed to create question");
  }

  return response.json();
}

// RESULT APIs

export async function fetchResults() {
  const response = await fetch(`${API_URL}/results`);

  if (!response.ok) {
    throw new Error("Failed to fetch results");
  }

  return response.json();
}

export async function createResult(result) {
  const response = await fetch(`${API_URL}/results`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(result),
  });

  if (!response.ok) {
    throw new Error("Failed to save result");
  }

  return response.json();
}

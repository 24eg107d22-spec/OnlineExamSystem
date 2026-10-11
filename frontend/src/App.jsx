
import { useState } from "react";
import StudentLogin from "./StudentLogin";
import AdminLogin from "./AdminLogin";
import StudentRegister from "./StudentRegister";
import StudentDashboard from "./StudentDashboard";
import AdminDashboard from "./AdminDashboard";
import CreateExam from "./CreateExam";
import ManageQuestions from "./ManageQuestions";
import ExamPage from "./ExamPage";
import ExamInstructions from "./ExamInstructions";
import AdminResults from "./AdminResults";
import "./App.css";

function App() {
  const [page, setPage] = useState("home");
  const [selectedExam, setSelectedExam] = useState(null);

  function openExam(exam) {
    setSelectedExam(exam);
    setPage("examInstructions");
  }

  if (page === "student") {
    return (
      <StudentLogin
        goBack={() => setPage("home")}
        onLogin={() => setPage("dashboard")}
      />
    );
  }
if (page === "admin") {
  return (
    <AdminLogin
      goBack={() => setPage("home")}
      onLogin={() => setPage("adminDashboard")}
    />
  );
}

  if (page === "register") {
    return (
      <StudentRegister
        goBack={() => setPage("home")}
        goToLogin={() => setPage("student")}
      />
    );
  }

  if (page === "dashboard") {
    return (
      <StudentDashboard
        goBack={() => setPage("home")}
        goToExam={openExam}
      />
    );
  }

  if (page === "adminDashboard") {
    return (
      <AdminDashboard
        goBack={() => setPage("home")}
        goToCreateExam={() => setPage("createExam")}
        goToManageQuestions={() => setPage("manageQuestions")}
        goToResults={() => setPage("adminResults")}
      />
    );
  }

  if (page === "createExam") {
    return (
      <CreateExam
        goBack={() => setPage("adminDashboard")}
      />
    );
  }

  if (page === "manageQuestions") {
    return (
      <ManageQuestions
        goBack={() => setPage("adminDashboard")}
      />
    );
  }

  if (page === "adminResults") {
    return (
      <AdminResults
        goBack={() => setPage("adminDashboard")}
      />
    );
  }

  if (page === "examInstructions" && selectedExam) {
    return (
      <ExamInstructions
        exam={selectedExam}
        onStart={() => setPage("exam")}
        goBack={() => setPage("dashboard")}
      />
    );
  }

  if (page === "exam" && selectedExam) {
    return (
      <ExamPage
        exam={selectedExam}
        goBack={() => setPage("dashboard")}
      />
    );
  }

  return (
    <div className="container">
      <h1>Online Examination System</h1>

      <p>
        Welcome to the Online Examination
        and Result Management System
      </p>

      <h2>Choose Your Login</h2>

      <button onClick={() => setPage("student")}>
        Student Login
      </button>

      <button onClick={() => setPage("admin")}>
        Admin Login
      </button>

      <button onClick={() => setPage("register")}>
        Student Registration
      </button>

      <h2>Dashboard Previews</h2>

      <button onClick={() => setPage("dashboard")}>
        Demo Student Dashboard
      </button>

      <button onClick={() => setPage("adminDashboard")}>
        Demo Admin Dashboard
      </button>
    </div>
  );
}

export default App;


import { useState } from "react";

function StudentLogin({ goBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    // Store the student's email for the exam result.
    localStorage.setItem("studentEmail", email.trim());

    // Demo identity only; not authenticated by the server.
    localStorage.setItem(
      "studentName",
      email.split("@")[0]
    );

    onLogin();
  }

  return (
    <div className="login-page">
      <div className="login-box">
        <h1>Student Login</h1>
        <p>Online Examination System</p>

        <form onSubmit={handleLogin}>
          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">Login</button>
        </form>

        <button className="back-button" onClick={goBack}>
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default StudentLogin;

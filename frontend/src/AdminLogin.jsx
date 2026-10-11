
import { useState } from "react";

function AdminLogin({ goBack, onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    // Demo login only; no server-side authentication yet.
    onLogin();
  }

  return (
    <div className="admin-login-page">
      <div className="login-box">
        <h1>Admin Login</h1>

        <p>Online Examination Management System</p>

        <form onSubmit={handleLogin}>
          <label>Admin Email</label>
          <input
            type="email"
            placeholder="Enter admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit">
            Login as Admin
          </button>
        </form>

        <button
          className="back-button"
          onClick={goBack}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default AdminLogin;

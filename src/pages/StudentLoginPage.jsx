// src/pages/StudentLoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "animate.css";

export default function StudentLoginPage() {
  const [userId, setUserId] = useState("");
  const [loading, setLoading] = useState(false);
  const [studentName, setStudentName] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `https://script.google.com/macros/s/AKfycbw2hIDLwLJ-Q8ZbLB8OFSZL8mlElUweGi6WQmlZmBCBqiDTOD501405YqKgPrGxErWuNQ/exec?userId=${userId}`
      );
      const data = await response.json();

      if (data.error) {
        alert("❌ Invalid UserID");
      } else if (data.role === "student") {
        // ✅ Correct storage for student login
        localStorage.setItem("userId", data.userId);
        localStorage.setItem("studentName", data.studentName || studentName);
        localStorage.setItem("role", "student");
        navigate("/dashboard");
      } else {
        alert("⚠️ Invalid student credentials");
      }
    } catch (err) {
      alert("🚨 Network error, please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100"
      style={{
        background: "linear-gradient(to right, #001f3f, #003366)",
        color: "#FFD700",
      }}
    >
      <div
        className="p-5 rounded animate__animated animate__fadeInUp shadow-lg"
        style={{
          width: "100%",
          maxWidth: "450px",
          backdropFilter: "blur(12px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <h2 className="text-center mb-4">👨‍🎓 Student Login</h2>

        {loading ? (
          <div className="text-center">
            <div className="spinner-border text-warning mb-3" role="status"></div>
            <p>Authenticating...</p>
          </div>
        ) : (
          <form
            onSubmit={handleLogin}
            className="animate__animated animate__fadeIn"
          >
            <div className="mb-3">
              <label className="form-label">Student Name</label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Enter your name"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />
              <label className="form-label">User ID</label>
              <input
                type="text"
                className="form-control custom-input"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
              />
            </div>
            <button
              type="submit"
              className="btn btn-outline-warning w-100 fw-bold custom-btn"
            >
              🔓 Login
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
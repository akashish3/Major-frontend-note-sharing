// src/pages/LandingPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "animate.css";

export default function LandingPage() {
  const navigate = useNavigate();
  const [checkingSession, setCheckingSession] = useState(true);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    const role = localStorage.getItem("role");

    if (userId && role === "student") {
      navigate("/dashboard");
    } else if (userId && role === "educator") {
      navigate("/educator-dashboard");
    } else {
      // simulate fade-out before showing landing
      setTimeout(() => {
        setShowSpinner(false);
        setCheckingSession(false);
      }, 1000); // 1s spinner fade-out
    }
  }, [navigate]);

  const handleLoginStudent = () => navigate("/student-login");
  const handleLoginEducator = () => navigate("/educator-login");

  // 👇 Spinner phase with animated background + floating shapes
  if (checkingSession && showSpinner) {
    return (
      <div
        className="d-flex justify-content-center align-items-center min-vh-100 animated-bg"
        style={{ color: "#FFD700" }}
      >
        {/* Floating shapes */}
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>
        <div className="shape"></div>

        {/* Spinner */}
        <div className="text-center animate__animated animate__fadeOut animate__delay-1s">
          <div className="spinner-border text-warning mb-3" role="status"></div>
          <p>Checking session...</p>
        </div>
      </div>
    );
  }

  // 👇 Landing page after session check
  return (
    <div
      className="d-flex justify-content-center align-items-center min-vh-100 animate__animated animate__fadeIn"
      style={{
        background: "linear-gradient(to right, #001f3f, #003366)",
        color: "#FFD700",
        padding: "20px",
      }}
    >
      <div
        className="text-center p-5 rounded animate__animated animate__fadeInDown"
        style={{
          backdropFilter: "blur(10px)",
          backgroundColor: "rgba(255, 255, 255, 0.05)",
          border: "1px solid rgba(255, 255, 255, 0.1)",
          boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
          maxWidth: "700px",
          width: "100%",
        }}
      >
        <h1 className="mb-4 animate__animated animate__fadeInUp animate__delay-1s">
          Welcome to <span style={{ color: "#FFD700" }}>Coding Thinker</span>
        </h1>
        <p className="lead mb-5 animate__animated animate__fadeInUp animate__delay-2s">
          A Centralized Notes Sharing Platform for Students and Educators ✨
        </p>

        <div className="d-flex justify-content-center gap-4 animate__animated animate__fadeInUp animate__delay-3s">
          <button
            className="btn btn-outline-warning px-4 py-2 shadow-sm rounded-pill custom-btn animate__animated animate__pulse animate__infinite"
            onClick={handleLoginStudent}
          >
            👨‍🎓 Login as Student
          </button>
          <button
            className="btn btn-outline-light px-4 py-2 shadow-sm rounded-pill custom-btn animate__animated animate__pulse animate__infinite"
            onClick={handleLoginEducator}
          >
            👩‍🏫 Login as Educator
          </button>
        </div>
      </div>
    </div>
  );
}
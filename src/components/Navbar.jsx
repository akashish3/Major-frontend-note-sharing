// src/components/Navbar.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();

  const studentName = localStorage.getItem("studentName");
  const educatorName = localStorage.getItem("educatorName");
  const userId = localStorage.getItem("userId");
  const role = localStorage.getItem("role"); // 👈 stored at login

  const handleLogout = () => {
    localStorage.clear();
    navigate("/"); // back to landing page
  };

  const handleSwitchAccount = () => {
    localStorage.clear();
    if (role === "student") {
      navigate("/educator-login");
    } else {
      navigate("/student-login");
    }
  };

  return (
    <nav
      className="navbar navbar-expand-lg navbar-dark"
      style={{ backgroundColor: "#001f3f" }}
    >
      <div className="container-fluid">
        <a className="navbar-brand fw-bold text-warning" href="#">
          📚 Notes App
        </a>

        <div className="ms-auto d-flex align-items-center">
          {/* 👇 User name + role badge */}
          <span className="me-3 text-warning fw-bold">
            {studentName || educatorName || userId || "Guest"}{" "}
            {role === "student" && (
              <span className="badge bg-info text-dark ms-2">🎓 Student</span>
            )}
            {role === "educator" && (
              <span className="badge bg-success ms-2">👨‍🏫 Educator</span>
            )}
          </span>

          <button
            onClick={handleSwitchAccount}
            className="btn btn-outline-info fw-bold me-2"
          >
            🔄 Switch Account
          </button>
          <button
            onClick={handleLogout}
            className="btn btn-outline-warning fw-bold"
          >
            🚪 Logout
          </button>
        </div>
      </div>
    </nav>
  );
}
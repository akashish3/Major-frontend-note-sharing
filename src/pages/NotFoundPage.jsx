// src/pages/NotFoundPage.jsx
import React from "react";
import { Link } from "react-router-dom";
import "animate.css";

export default function NotFoundPage() {
  return (
    <div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center"
      style={{
        background: "linear-gradient(to right, #001f3f, #003366)",
        color: "#FFD700",
      }}
    >
      {/* 👇 Illustration (SVG or image) */}
      <img
        src="/images/lost-student.svg" // place your SVG or PNG in public/images
        alt="Lost student illustration"
        className="mb-4 animate__animated animate__fadeIn"
        style={{ maxWidth: "300px" }}
      />

      {/* Animated emoji for fun */}
      <div className="animate__animated animate__bounce animate__infinite mb-3">
        🚧
      </div>

      {/* Heading */}
      <h1 className="fw-bold display-4 animate__animated animate__fadeInDown">
        404 - Page Not Found
      </h1>

      <p className="lead mb-4 animate__animated animate__fadeInUp">
        Looks like you’re a bit lost, but don’t worry — we’ll guide you back!
      </p>

      <Link
        to="/"
        className="btn btn-outline-warning fw-bold animate__animated animate__pulse animate__infinite"
      >
        ⬅️ Back to Home
      </Link>
    </div>
  );
}
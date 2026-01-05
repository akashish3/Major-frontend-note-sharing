// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const userId = localStorage.getItem("userId");
  const storedRole = localStorage.getItem("role"); // 👈 save role at login

  // If no userId or role mismatch → redirect
  if (!userId || (role && storedRole !== role)) {
    return <Navigate to="/" replace />;
  }

  return children;
}
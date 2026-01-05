// 
// src/pages/EducatorDashboard.jsx
import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import FileUploadModal from "../components/FileUploadModal";
import FileList from "../components/FileList";
import Navbar from "../components/Navbar";

export default function EducatorDashboard() {
  const [showModal, setShowModal] = useState(false);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const educatorName = localStorage.getItem("educatorName");
  const userId = localStorage.getItem("userId");
  const navigate = useNavigate();

  // ✅ Fetch notes function - Wrapped in useCallback to prevent re-renders
  const fetchNotes = useCallback(() => {
    if (!userId) return;
    setLoading(true);
    
    // Ensure the query param matches what your backend expects (userId)
    fetch(`/api/educator/notes?userId=${userId}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch notes");
        return res.json();
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load notes. Please try again.");
        setLoading(false);
      });
  }, [userId]);

  // ✅ Delete handler
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`/api/educator/delete/${id}`, { method: "DELETE" });
      if (res.ok) {
        setSuccess("🗑️ Note deleted successfully!");
        fetchNotes(); // Refresh list
        setTimeout(() => setSuccess(null), 3000);
      } else {
        throw new Error("Delete failed");
      }
    } catch (err) {
      setError("Failed to delete note.");
      setTimeout(() => setError(null), 3000);
    }
  };

  useEffect(() => {
    if (!userId) {
      // Small delay before redirecting to allow the warning to show if desired
      // navigate("/login"); 
    } else {
      fetchNotes();
    }
  }, [userId, fetchNotes]);

  // ✅ Success handler after upload
  const handleUploadSuccess = () => {
    setShowModal(false);
    setSuccess("✅ Note uploaded successfully!");
    fetchNotes(); // trigger refresh
    setTimeout(() => setSuccess(null), 4000);
  };

  // ✅ Login check view
  if (!userId) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100 bg-dark">
        <div className="text-center text-warning p-5 border border-warning rounded">
          <h2 className="mb-3">⚠️ Access Denied</h2>
          <p>Please login to view your educator dashboard.</p>
          <button className="btn btn-warning mt-3" onClick={() => navigate("/login")}>Go to Login</button>
        </div>
      </div>
    );
  }

  return (
    <div
      className="min-vh-100 d-flex flex-column align-items-center"
      style={{
        background: "linear-gradient(to bottom right, #001f3f, #003366)",
        color: "#FFD700",
        padding: "40px 20px",
      }}
    >
      <Navbar />

      <div className="w-100 text-center mt-5 mb-4">
        <h2 className="fw-bold">Welcome back, {educatorName || userId} 🎓</h2>
        <p className="lead" style={{ opacity: 0.8 }}>Manage your educational content and notes.</p>
      </div>

      {/* --- Toast Notifications (Fixed Position) --- */}
      <div className="position-fixed top-0 start-50 translate-middle-x mt-3" style={{ zIndex: 2000 }}>
        {error && (
          <div className="alert alert-danger alert-dismissible fade show shadow" role="alert">
            {error}
            <button type="button" className="btn-close" onClick={() => setError(null)}></button>
          </div>
        )}
        {success && (
          <div className="alert alert-success alert-dismissible fade show shadow" role="alert">
            {success}
            <button type="button" className="btn-close" onClick={() => setSuccess(null)}></button>
          </div>
        )}
      </div>

      {/* --- Notes Content --- */}
      <div className="w-100" style={{ maxWidth: "1000px" }}>
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-warning mb-3" role="status"></div>
            <p>Fetching your classroom notes...</p>
          </div>
        ) : (
          <FileList 
            /* Merging common backend response keys */
            notes={data?.notes || data?.files || data || []} 
            onDelete={handleDelete} 
          />
        )}
      </div>

      {/* --- Action UI --- */}
      <button
        className="btn btn-warning rounded-circle shadow-lg border-white border-2 animate-bounce"
        style={{
          position: "fixed",
          bottom: "30px",
          right: "30px",
          width: "70px",
          height: "70px",
          fontSize: "32px",
          fontWeight: "bold",
          zIndex: 1000
        }}
        onClick={() => setShowModal(true)}
        title="Upload New Notes"
      >
        +
      </button>

      {showModal && (
        <FileUploadModal
          onClose={() => setShowModal(false)}
          onSuccess={handleUploadSuccess}
        />
      )}
    </div>
  );
}
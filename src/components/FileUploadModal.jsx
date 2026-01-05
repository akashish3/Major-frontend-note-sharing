// src/components/FileUploadModal.jsx
import React, { useState } from "react";

export default function FileUploadModal({ onClose, onSuccess }) {
  // --- State Management ---
  const [educatorName, setEducatorName] = useState("");
  const [batchName, setBatchName] = useState("");
  const [uploadMethod, setUploadMethod] = useState("link"); // 'link' or 'file'
  const [fileUrl, setFileUrl] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isValidLink, setIsValidLink] = useState(null);

  // ✅ Validation for Google Drive, Docs, Sheets, and Slides
  const validateGoogleLink = (url) => {
    const patterns = [
      /\/file\/d\/[a-zA-Z0-9_-]+\/view/,
      /\/document\/d\/[a-zA-Z0-9_-]+/,
      /\/spreadsheets\/d\/[a-zA-Z0-9_-]+/,
      /\/presentation\/d\/[a-zA-Z0-9_-]+/,
    ];
    return patterns.some((regex) => regex.test(url));
  };

  // 🎥 Generator for Iframe-ready preview links
  const getPreviewLink = (url) => {
    if (!url) return null;
    const driveMatch = url.match(/\/file\/d\/(.*)\/view/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    if (url.includes("docs.google.com")) return url;
    return null;
  };

  // 🚀 Unified Upload Handler
  const handleUpload = async () => {
    // 1. Validation
    if (!educatorName || !batchName) {
      setMessage("⚠️ Educator and Batch names are required.");
      return;
    }

    if (uploadMethod === "link" && (!fileUrl || !validateGoogleLink(fileUrl))) {
      setMessage("🚨 Please provide a valid Google Drive share link.");
      return;
    }

    if (uploadMethod === "file" && !file) {
      setMessage("🚨 Please select a file to upload.");
      return;
    }

    setLoading(true);
    setMessage(uploadMethod === "file" ? "⏳ Uploading file..." : "⏳ Saving link...");

    try {
      const userId = localStorage.getItem("userId"); //
      const formData = new FormData();
      formData.append("educatorName", educatorName);
      formData.append("batchName", batchName);
      formData.append("userId", userId); // Critical for educator dashboard visibility
      formData.append("uploadTime", new Date().toISOString());

      let endpoint;
      if (uploadMethod === "link") {
        formData.append("fileUrl", fileUrl);
        // Link specific endpoint
        endpoint = "https://script.google.com/macros/s/AKfycbzpGZGKymxkAq0k2vS3gmTraiQntx_aYQ5D91IEM0j-14vszGt9OXsdIGQYEOwPnU3K/exec";
      } else {
        formData.append("file", file); // Physical file object
        endpoint = "/api/educator/upload";
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: formData, // Browser sets multipart/form-data boundary automatically
      });

      const result = await response.json();

      if (result.success || response.ok) {
        setMessage("✅ Success!");
        if (onSuccess) onSuccess(); // Refresh dashboard list
        setTimeout(onClose, 1500);
      } else {
        throw new Error("Upload failed");
      }
    } catch (err) {
      console.error(err);
      setMessage("🚨 Upload failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Backdrop */}
      <div className="modal-backdrop fade show" onClick={onClose} style={{ zIndex: 1040 }}></div>
      
      {/* Modal Container */}
      <div className="modal d-block" style={{ zIndex: 1050 }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content shadow-lg border-0 p-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h5 className="mb-0 fw-bold">📚 Add New Notes</h5>
              <button type="button" className="btn-close" onClick={onClose}></button>
            </div>

            {/* Metadata Fields */}
            <div className="mb-3">
              <label className="form-label small fw-bold text-dark">Educator & Batch</label>
              <div className="d-flex gap-2">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Educator Name"
                  value={educatorName}
                  onChange={(e) => setEducatorName(e.target.value)}
                />
                <input
                  type="text"
                  className="form-control"
                  placeholder="Batch Name"
                  value={batchName}
                  onChange={(e) => setBatchName(e.target.value)}
                />
              </div>
            </div>

            {/* Method Switcher */}
            <ul className="nav nav-pills nav-fill mb-3 bg-light rounded p-1" style={{ fontSize: "0.85rem" }}>
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 ${uploadMethod === "link" ? "active" : ""}`}
                  onClick={() => setUploadMethod("link")}
                >
                  🔗 Link Google Drive
                </button>
              </li>
              <li className="nav-item">
                <button 
                  className={`nav-link py-1 ${uploadMethod === "file" ? "active" : ""}`}
                  onClick={() => setUploadMethod("file")}
                >
                  📁 Upload Local File
                </button>
              </li>
            </ul>

            {/* Link Input */}
            {uploadMethod === "link" && (
              <div className="mb-3">
                <div className="input-group mb-2">
                  <input
                    type="text"
                    className={`form-control ${isValidLink === false ? "is-invalid" : ""}`}
                    placeholder="Paste Drive/Docs link"
                    value={fileUrl}
                    onChange={(e) => {
                      setFileUrl(e.target.value);
                      setIsValidLink(validateGoogleLink(e.target.value));
                    }}
                  />
                  <span className="input-group-text">{isValidLink ? "✅" : "❌"}</span>
                </div>
                {isValidLink && (
                  <div className="rounded border overflow-hidden">
                    <iframe 
                      src={getPreviewLink(fileUrl)} 
                      width="100%" 
                      height="180" 
                      title="Preview"
                      style={{ border: "none" }}
                    ></iframe>
                  </div>
                )}
              </div>
            )}

            {/* File Input */}
            {uploadMethod === "file" && (
              <div className="mb-3">
                <input
                  type="file"
                  className="form-control"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                {file && <small className="text-success d-block mt-1">Ready: {file.name}</small>}
              </div>
            )}

            {/* Feedback Message */}
            {message && (
              <div className={`alert py-2 small ${message.includes("✅") ? "alert-success" : "alert-info"}`}>
                {message}
              </div>
            )}

            {/* Footer Buttons */}
            <div className="d-flex gap-2 mt-3">
              <button 
                className="btn btn-primary flex-fill fw-bold" 
                onClick={handleUpload} 
                disabled={loading}
              >
                {loading ? (
                  <><span className="spinner-border spinner-border-sm me-2"></span>Processing...</>
                ) : "Save Notes"}
              </button>
              <button className="btn btn-outline-secondary" onClick={onClose} disabled={loading}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
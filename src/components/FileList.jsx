// src/components/FileList.jsx
import React, { useState } from "react";

export default function FileList({ notes }) {
  // 1. Logic & State Management
  const safeNotes = Array.isArray(notes) ? notes : [];
  
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState("newest");
  const [fileTypeFilter, setFileTypeFilter] = useState("all");
  const [previewUrl, setPreviewUrl] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [notesPerPage, setNotesPerPage] = useState(6);

  // Helper: Get Icon based on URL
  const getFileTypeIcon = (url) => {
    if (!url) return "📄";
    if (url.includes("drive.google.com/file") && url.toLowerCase().includes(".pdf")) return "📕";
    if (url.includes("docs.google.com/document")) return "📄";
    if (url.includes("docs.google.com/spreadsheets")) return "📊";
    if (url.includes("docs.google.com/presentation")) return "📽️";
    return "📎";
  };

  // Helper: Get Type String for filtering
  const getFileType = (url) => {
    if (!url) return "other";
    if (url.includes("drive.google.com/file") && url.toLowerCase().includes(".pdf")) return "pdf";
    if (url.includes("docs.google.com/document")) return "doc";
    if (url.includes("docs.google.com/spreadsheets")) return "sheet";
    if (url.includes("docs.google.com/presentation")) return "slide";
    return "other";
  };

  // Helper: Convert View link to Preview link for Iframe
  const getPreviewLink = (url) => {
    if (!url) return null;
    const driveMatch = url.match(/\/file\/d\/(.*)\/view/);
    if (driveMatch && driveMatch[1]) {
      return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    }
    // For Docs/Sheets/Slides, they usually work directly in iframe if permissions allow
    return url;
  };

  // 🔍 Filter Logic
  let filteredNotes = safeNotes.filter((note) => {
    const matchesSearch = 
      note.batchName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.educatorName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = 
      fileTypeFilter === "all" || getFileType(note.fileUrl) === fileTypeFilter;
    return matchesSearch && matchesType;
  });

  // 📅 Sort Logic
  filteredNotes.sort((a, b) => {
    if (sortOption === "newest") return new Date(b.uploadTime) - new Date(a.uploadTime);
    if (sortOption === "oldest") return new Date(a.uploadTime) - new Date(b.uploadTime);
    if (sortOption === "batchAZ") return (a.batchName || "").localeCompare(b.batchName || "");
    if (sortOption === "batchZA") return (b.batchName || "").localeCompare(a.batchName || "");
    return 0;
  });

  // 📑 Pagination Logic
  const totalPages = Math.ceil(filteredNotes.length / notesPerPage) || 1;
  const startIndex = (currentPage - 1) * notesPerPage;
  const currentNotes = filteredNotes.slice(startIndex, startIndex + notesPerPage);

  // Early return if no data at all
  if (safeNotes.length === 0) {
    // return (
      <div className="text-center p-5 border rounded bg-light">
        <p className="text-muted mb-0">📂 No notes have been uploaded yet.</p>
      </div>
    // );
  }

  return (
    <div className="container-fluid py-3">
      {/* --- Toolbar: Search, Sort, Filter --- */}
      <div className="row g-3 mb-4 align-items-end">
        <div className="col-md-4">
          <label className="form-label small fw-bold">Search</label>
          <input
            type="text"
            className="form-control"
            placeholder="Search batch or educator..."
            value={searchQuery}
            onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-bold">Sort By</label>
          <select className="form-select" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
            <option value="newest">📅 Newest First</option>
            <option value="oldest">📅 Oldest First</option>
            <option value="batchAZ">🔤 Batch A–Z</option>
            <option value="batchZA">🔤 Batch Z–A</option>
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label small fw-bold">File Type</label>
          <select className="form-select" value={fileTypeFilter} onChange={(e) => { setFileTypeFilter(e.target.value); setCurrentPage(1); }}>
            <option value="all">📂 All Types</option>
            <option value="pdf">📕 PDF</option>
            <option value="doc">📄 Docs</option>
            <option value="sheet">📊 Sheets</option>
            <option value="slide">📽️ Slides</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label small fw-bold">Show</label>
          <select className="form-select" value={notesPerPage} onChange={(e) => { setNotesPerPage(Number(e.target.value)); setCurrentPage(1); }}>
            <option value={6}>6</option>
            <option value={12}>12</option>
            <option value={24}>24</option>
          </select>
        </div>
      </div>

      {/* --- Notes Grid --- */}
      <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
        {currentNotes.length > 0 ? (
          currentNotes.map((note, index) => (
            <div key={note.id || index} className="col">
              <div className="card shadow-sm h-100 border-0">
                <div className="card-body d-flex flex-column">
                  <h6 className="card-title text-primary text-truncate">
                    {getFileTypeIcon(note.fileUrl)} {note.batchName}
                  </h6>
                  <p className="card-text mb-1 small">
                    Educator: <strong>{note.educatorName}</strong>
                  </p>
                  <p className="text-muted extra-small mb-3" style={{ fontSize: "0.75rem" }}>
                    🕒 {new Date(note.uploadTime).toLocaleString()}
                  </p>
                  <div className="mt-auto d-flex gap-2">
                    <a href={note.fileUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-primary flex-fill">
                      📥 Download
                    </a>
                    <button 
                      className="btn btn-sm btn-primary flex-fill"
                      onClick={() => setPreviewUrl(getPreviewLink(note.fileUrl))}
                    >
                      👁️ Preview
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-12 text-center py-5">
            <p className="text-muted">No matching results found.</p>
          </div>
        )}
      </div>

      {/* --- Pagination --- */}
      {totalPages > 1 && (
        <div className="d-flex justify-content-center align-items-center mt-5 gap-3">
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={currentPage === 1} 
            onClick={() => setCurrentPage(p => p - 1)}
          >
            Prev
          </button>
          <span className="small">Page <strong>{currentPage}</strong> of {totalPages}</span>
          <button 
            className="btn btn-sm btn-outline-secondary" 
            disabled={currentPage === totalPages} 
            onClick={() => setCurrentPage(p => p + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* --- Preview Modal (Conditional Overlay) --- */}
      {previewUrl && (
        <div className="modal d-block" style={{ backgroundColor: "rgba(0,0,0,0.8)", zIndex: 1050 }}>
          <div className="modal-dialog modal-xl modal-dialog-centered" style={{ height: "90vh" }}>
            <div className="modal-content h-100">
              <div className="modal-header">
                <h5 className="modal-title">File Preview</h5>
                <button type="button" className="btn-close" onClick={() => setPreviewUrl(null)}></button>
              </div>
              <div className="modal-body p-0 bg-dark overflow-hidden">
                <iframe
                  src={previewUrl}
                  width="100%"
                  height="100%"
                  allow="autoplay"
                  title="File Preview"
                  style={{ border: "none" }}
                ></iframe>
              </div>
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={() => setPreviewUrl(null)}>Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
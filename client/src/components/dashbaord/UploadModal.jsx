import { useState } from "react";
import styles from "./Dashboard.module.css";
import { uploadResume } from "../../api/resumeService";

export default function UploadModal({ onClose, onSuccess }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError]         = useState("");

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    setError("");
    try {
      await uploadResume(file);
      if (onSuccess) onSuccess();
      onClose();
    } catch (err) {
      setError(err?.response?.data?.message || "Failed to upload resume.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={styles.modalOverlay} onClick={!uploading ? onClose : undefined}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Upload Resume</span>
          {!uploading && <button className={styles.closeBtn} onClick={onClose}>✕</button>}
        </div>

        {error && (
          <div style={{ color: "#b91c1c", background: "#fef2f2", padding: "0.5rem", borderRadius: "6px", marginBottom: "1rem", fontSize: "0.85rem" }}>
            {error}
          </div>
        )}

        {/* Dropzone */}
        <div
          className={styles.dropzone}
          style={{
            borderColor: dragging ? "#6366f1" : "#cbd5e1",
            background: dragging ? "rgba(99,102,241,0.04)" : "#f8fafc",
            pointerEvents: uploading ? "none" : "auto",
            opacity: uploading ? 0.6 : 1
          }}
          onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
          onDragLeave={() => setDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragging(false);
            setFile(e.dataTransfer.files[0]);
          }}
        >
          {file ? (
            <div className={styles.dropzoneContent}>
              <div className={styles.dropzoneIcon}>📄</div>
              <div className={styles.fileName}>{file.name}</div>
              <div className={styles.fileSize}>{(file.size / 1024).toFixed(0)} KB</div>
            </div>
          ) : (
            <div className={styles.dropzoneContent}>
              <div className={styles.dropzoneArrow}>↑</div>
              <div className={styles.dropText}>Drop your PDF or DOCX here</div>
              <div className={styles.dropSub}>or click to browse</div>
            </div>
          )}
          <input
            type="file"
            accept=".pdf,.docx"
            className={styles.fileInput}
            onChange={(e) => setFile(e.target.files[0])}
            disabled={uploading}
          />
        </div>

        {/* Upload button */}
        <button
          className={styles.accentBtn}
          style={{ opacity: file && !uploading ? 1 : 0.45, cursor: file && !uploading ? "pointer" : "not-allowed" }}
          disabled={!file || uploading}
          onClick={handleUpload}
        >
          {uploading ? "Uploading..." : "Upload & Analyze"}
        </button>
      </div>
    </div>
  );
}

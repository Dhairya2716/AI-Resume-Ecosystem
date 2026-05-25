import { useState } from "react";
import styles from "./Dashboard.module.css";

export default function UploadModal({ onClose }) {
  const [dragging, setDragging] = useState(false);
  const [file, setFile]         = useState(null);

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.modalHeader}>
          <span className={styles.modalTitle}>Upload Resume</span>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        {/* Dropzone */}
        <div
          className={styles.dropzone}
          style={{
            borderColor: dragging ? "#6366f1" : "#cbd5e1",
            background: dragging ? "rgba(99,102,241,0.04)" : "#f8fafc",
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
          />
        </div>

        {/* Upload button */}
        <button
          className={styles.accentBtn}
          style={{ opacity: file ? 1 : 0.45, cursor: file ? "pointer" : "not-allowed" }}
          disabled={!file}
        >
          Upload &amp; Analyze
        </button>
      </div>
    </div>
  );
}

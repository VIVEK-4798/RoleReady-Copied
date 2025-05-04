import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";

const ResumePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showResumeTips, setShowResumeTips] = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [savedResumeName, setSavedResumeName] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  useEffect(() => {
    if (showPopup || showResumeTips) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showResumeTips]);

  useEffect(() => {
    fetchResume();
  }, []);

  const fetchResume = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-resume/${user_id}?role=mentor`);
      if (res.data.resume_name) {
        setSavedResumeName(res.data.resume_name);
      }
    } catch (err) {
      console.error("Error fetching resume:", err.message);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
      setShowResumeTips(false);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setResumeFile(file);
    if (file) {
      setSavedResumeName(file.name);
    }
  };

  const handleSave = async () => {
    if (!resumeFile) {
      toast.error("Please select a file");
      return;
    }
  
    const formData = new FormData();
    formData.append("user_id", user_id);
    formData.append("resume", resumeFile);
    formData.append("role", "mentor"); 
  
    try {
      const res = await axios.post(`${api}/api/profile/upload-resume`, formData);
      if (res.data.success) {
        toast.success("Resume uploaded successfully");
        setSavedResumeName(resumeFile.name);
        setResumeFile(null);
        setShowPopup(false);
      } else {
        toast.error("Failed to upload resume");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };
  

  const openEditPopup = () => {
    setResumeFile(null); // Reset to allow new selection
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col" style={{ width: "80%" }}>
            <h5 className="text-20 fw-600 mb-15">Resume</h5>
            <p className="text-16 text-light-1 mb-10">
              Add your Resume & get your profile filled in a click!
            </p>
            {savedResumeName ? (
              <span>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={openEditPopup}
                  className="text-blue-500 cursor-pointer hover:opacity-80"
                  size="lg"
                />
              </span>
            ) : (
              <span
                onClick={() => setShowPopup(true)}
                className="text-blue-1"
                style={{ textDecoration: "underline", cursor: "pointer" }}
              >
                Upload Resume
              </span>
            )}
          </div>
          <img
            src="/img/profile/resume.webp"
            alt="resume"
            style={{ width: 140, height: 110 }}
          />
        </div>
      </div>

      {/* Upload Popup */}
      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Resume <span style={{ color: "red" }}>*</span>
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
              Upload a one-pager that highlights your skills, experience, and accomplishments.
            </p>

            {/* Preview previously uploaded resume */}
            {savedResumeName && !resumeFile && (
              <div style={{ marginBottom: "1rem", color: "#4B5563", fontSize: "0.875rem" }}>
                <strong>Current Resume:</strong> {savedResumeName}
              </div>
            )}

            {/* New file input */}
            <input type="file" accept=".pdf,.doc,.docx" onChange={handleFileChange} />

            {/* Resume Tips Button */}
            <button
              onClick={() => setShowResumeTips(true)}
              style={{
                marginTop: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "0.5rem",
                backgroundColor: "#4F46E5",
                color: "white",
                padding: "0.5rem 1rem",
                borderRadius: "0.375rem",
                fontSize: "0.875rem",
                border: "none",
                cursor: "pointer",
              }}
            >
              <img
                src="/img/profile/tips.png"
                alt="Resume Tips"
                style={{ width: "20px", height: "20px", filter: "brightness(2) invert(1)" }}
              />
              Resume Tips
            </button>

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
              <button onClick={handleSave} className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* Resume Tips Modal */}
      {showResumeTips && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div style={{
            backgroundColor: "#fff",
            borderRadius: "0.5rem",
            padding: "1.5rem",
            maxWidth: "480px",
            width: "100%",
            boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)"
          }}>
            <h4 style={{ fontSize: "1rem", fontWeight: "bold", marginBottom: "1rem" }}>
              Tips for Uploading a Great Resume
            </h4>
            <ul style={{ paddingLeft: "1rem", marginBottom: "1rem", color: "#374151" }}>
              <li>✔ Keep it to 1-2 pages</li>
              <li>✔ Highlight achievements, not just responsibilities</li>
              <li>✔ Use clear formatting</li>
              <li>✔ Save as PDF for better compatibility</li>
              <li>✔ Tailor it to the job you’re applying for</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowResumeTips(false)}
                style={{
                  backgroundColor: "#4F46E5",
                  color: "white",
                  padding: "0.5rem 1rem",
                  borderRadius: "0.375rem",
                  fontSize: "0.875rem",
                  border: "none",
                  cursor: "pointer",
                }}
              >
                Got it!
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResumePopupPage;

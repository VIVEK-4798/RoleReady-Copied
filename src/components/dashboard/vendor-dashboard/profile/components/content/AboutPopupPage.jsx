import React, { useState, useEffect } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const AboutPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showAITips, setShowAITips] = useState(false);
  const [aboutText, setAboutText] = useState('');
  const [savedAboutText, setSavedAboutText] = useState('');

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;
  
  useEffect(() => {
    if (!user_id) {
      console.error("No user ID found. Please log in.");
      return;
    }
    fetchAbout();
  }, []);

  const fetchAbout = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-about/${user_id}`);
      if (res.data.about_text) {
        setSavedAboutText(res.data.about_text);
      }
    } catch (err) {
      console.error("Error fetching about text:", err.message);
      if (err.response) {
        console.error("Status:", err.response.status);
        console.error("Data:", err.response.data);
      } else if (err.request) {
        console.error("No response received:", err.request);
      } else {
        console.error("Axios setup error:", err.message);
      }
    }
  };
  

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
      setShowAITips(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${api}/api/profile/save-about`, {
        user_id,
        about_text: aboutText
      });

      if (response.data.success) {
        toast.success("Profile about info saved");
        setSavedAboutText(aboutText);
        setShowPopup(false);
      } else {
        toast.error("Failed to save profile about info");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAbout();
  }, []);

  useEffect(() => {
    if (showPopup || showAITips) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup, showAITips]);

  const openEditPopup = () => {
    setAboutText(savedAboutText);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div style={{ borderRadius: "0.375rem", padding: "1rem", marginTop: "0.7rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column", width: "80%" }}>
            <h5 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>About</h5>
            <p style={{ fontSize: "1rem", color: "#4B5563",  whiteSpace: "pre-line" }}>
              {savedAboutText
                ? savedAboutText
                : "Craft an engaging story in your bio and make meaningful connections with peers and recruiters alike!"}
            </p>
            {savedAboutText ? (
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
                style={{ color: "#3B82F6", cursor: "pointer", textDecoration: "underline" }}
              >
                Add About
              </span>
            )}
          </div>
          <img
            src="/img/profile/about.webp"
            alt="about"
            style={{ width: "140px", height: "110px", objectFit: "cover" }}
          />
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              About Me <span style={{ color: "red" }}>*</span>
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
              Maximum 1000 characters can be added
            </p>
            <textarea
              value={aboutText}
              onChange={(e) => setAboutText(e.target.value)}
              placeholder="Introduce yourself here!"
              maxLength={1000}
              className="profile-textarea"
            ></textarea>

            <button
              onClick={() => setShowAITips(true)}
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
                alt="AI"
                style={{ width: "20px", height: "20px", filter: "brightness(2) invert(1)" }}
              />
              Tips
            </button>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
              <button onClick={handleSave} className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}

      {/* AI Tips Modal */}
      {showAITips && (
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
              Tips for Writing a Great About Section
            </h4>
            <ul style={{ paddingLeft: "1rem", marginBottom: "1rem", color: "#374151" }}>
              <li>✔ Highlight your achievements</li>
              <li>✔ Mention your interests and passions</li>
              <li>✔ Add what tools/technologies you use</li>
              <li>✔ Keep it concise and genuine</li>
              <li>✔ Show your personality</li>
            </ul>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
              <button
                onClick={() => setShowAITips(false)}
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

export default AboutPopupPage;

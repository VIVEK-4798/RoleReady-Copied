import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";

const SkillsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [savedSkills, setSavedSkills] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  const suggestions = [
    "TensorFlow Serving",
    "M&A Analysis",
    "Manufacturing",
    "Performance Management",
    "Resourcefulness",
    "IAM",
    "Portfolio Development",
    "UpKeep",
    "Environmental Regulations",
    "Wireshark",
  ];

  useEffect(() => {
    if (user_id) {
      fetchSkills();
    }
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-skills/${user_id}`);
      if (res.data.skills) {
        const skillArray = res.data.skills.split(",").map((s) => s.trim());
        setSavedSkills(skillArray);
        setSelectedSkills(skillArray);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSave = async () => {
    try {
      const response = await axios.post(`${api}/api/profile/save-skills`, {
        user_id,
        skills: selectedSkills.join(", "),
      });

      if (response.data.success) {
        toast.success("Skills updated successfully");
        setSavedSkills(selectedSkills);
        setShowPopup(false);
      } else {
        toast.error("Failed to update skills");
      }
    } catch (error) {
      toast.error("Server error");
      console.error(error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const openEditPopup = () => {
    setSelectedSkills(savedSkills);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12" style={{ padding: "1rem", marginTop: "0.7rem" }}>
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col w-4/5">
            <h5 className="text-20 fw-600 mb-15">Skills</h5>
            {savedSkills.length > 0 ? (
              <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem", marginBottom: "0.6rem" }}>
                {savedSkills.map((skill) => (
                  <span
                    key={skill}
                    style={{
                      backgroundColor: "#EEF2FF",
                      color: "#4338CA",
                      padding: "0.3rem 0.6rem",
                      borderRadius: "1rem",
                      fontSize: "0.85rem",
                    }}
                  >
                    {skill}
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-16 text-light-1 mb-10">
                Spotlight your unique skills for recruiters!
              </p>
            )}
            {savedSkills.length > 0 ? (
              <FontAwesomeIcon
                icon={faPenToSquare}
                onClick={openEditPopup}
                className="text-blue-500 cursor-pointer hover:opacity-80"
                size="lg"
              />
            ) : (
              <span
                onClick={() => setShowPopup(true)}
                style={{ color: "#3B82F6", cursor: "pointer", textDecoration: "underline" }}
              >
                Add Skills
              </span>
            )}
          </div>
          <div>
            <img src="/img/profile/skills.webp" alt="skills" style={{ width: 140, height: 110 }} />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Skills <span style={{ color: "red" }}>*</span>
            </h3>
            <p style={{ fontSize: "0.875rem", color: "#6B7280", marginBottom: "1rem" }}>
              List your skills here, showcasing what you excel at.
            </p>
            <textarea
              placeholder="Selected skills..."
              style={{
                width: "100%",
                border: "1px solid #D1D5DB",
                borderRadius: "0.375rem",
                padding: "0.75rem",
                minHeight: "120px",
                fontSize: "0.875rem",
                marginBottom: "1rem",
              }}
              value={selectedSkills.join(", ")}
              readOnly
            />

            <p style={{ fontWeight: 500, fontSize: "0.9rem", marginBottom: "0.5rem" }}>
              Suggestions
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem" }}>
              {suggestions.map((skill) => (
                <span
                  key={skill}
                  onClick={() => toggleSkill(skill)}
                  style={{
                    padding: "0.4rem 0.8rem",
                    borderRadius: "1rem",
                    backgroundColor: selectedSkills.includes(skill) ? "#2563EB" : "#F3F4F6",
                    color: selectedSkills.includes(skill) ? "#ffffff" : "#1F2937",
                    fontSize: "0.8rem",
                    cursor: "pointer",
                  }}
                >
                  {skill}
                </span>
              ))}
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem", gap: "1rem" }}>
              <button onClick={() => setShowPopup(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPopupPage;

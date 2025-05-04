import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/utils/apiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const ExperiencePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [experience, setExperience] = useState({
    designation: "",
    organisation: "",
    employmentType: "",
    startDate: "",
    endDate: "",
    location: "",
    skills: "",
    description: "",
  });
  const [savedExperience, setSavedExperience] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  useEffect(() => {
    if (!user_id) return;
    fetchExperience();
  }, []);

  const fetchExperience = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-experience/${user_id}?role=mentor`);
      if (res.data.experience) {
        const parsedExperience = JSON.parse(res.data.experience);
        setSavedExperience(parsedExperience);
      }
    } catch (err) {
      console.error("Error fetching experience:", err);
    }
  };
  

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const handleChange = (e) => {
    setExperience({ ...experience, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${api}/api/profile/save-experience`, {
        user_id,
        experience, 
        role: 'mentor'
      });
  
      if (res.data.success) {
        toast.success("Experience saved successfully");
        setSavedExperience(experience);
        setShowPopup(false);
      } else {
        toast.error("Failed to save experience");
      }
    } catch (err) {
      toast.error("Error saving experience");
      console.error(err);
    }
  };
  

  const openEditPopup = () => {
    if (savedExperience) setExperience(savedExperience);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12" style={{ padding: "1rem", marginTop: "0.7rem" }}>
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-15">Work Experience</h5>
            {savedExperience ? (
              <>
                <p className="text-16 text-light-1 mb-10 whitespace-pre-line">
                  <strong>{savedExperience.designation}</strong> at <strong>{savedExperience.organisation}</strong>
                  <br />
                  {savedExperience.startDate} to {savedExperience.endDate}
                  <br />
                  {savedExperience.location} | {savedExperience.employmentType}
                  <br />
                  Skills: {savedExperience.skills}
                  <br />
                  {savedExperience.description}
                </p>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={openEditPopup}
                  className="text-blue-500 cursor-pointer hover:opacity-80"
                  size="lg"
                />
              </>
            ) : (
              <Link to="#" 
              style={{ color: "#3B82F6", cursor: "pointer", textDecoration: "underline" }}
                onClick={() => setShowPopup(true)}>
                Add Work Experience
              </Link>
            )}
          </div>
          <div>
            <img
              src="/img/profile/work_experience.webp"
              alt="work-experience"
              style={{ width: 140, height: 110 }}
            />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1.5rem" }}>Work Experience</h3>
            <div className="grid grid-cols-1 gap-4">
              {[
                { label: "Designation *", name: "designation", type: "text", placeholder: "Select Designation" },
                { label: "Organisation *", name: "organisation", type: "text", placeholder: "Select Organisation" },
                { label: "Location *", name: "location", type: "text", placeholder: "Select Location" },
                { label: "Skills", name: "skills", type: "text", placeholder: "Add Skills" },
              ].map(({ label, name, type, placeholder }) => (
                <div key={name}>
                  <label>{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={experience[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="custom-input-style"
                  />
                </div>
              ))}

              <div>
                <label>Employment Type *</label>
                <select
                  name="employmentType"
                  value={experience.employmentType}
                  onChange={handleChange}
                  className="custom-input-style"
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-Time">Full-Time</option>
                  <option value="Part-Time">Part-Time</option>
                  <option value="Internship">Internship</option>
                  <option value="Freelance">Freelance</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label>Start Date *</label>
                  <input
                    type="date"
                    name="startDate"
                    value={experience.startDate}
                    onChange={handleChange}
                    className="custom-input-style"
                  />
                </div>
                <div>
                  <label>End Date *</label>
                  <input
                    type="date"
                    name="endDate"
                    value={experience.endDate}
                    onChange={handleChange}
                    className="custom-input-style"
                  />
                </div>
              </div>

              <div>
                <label>Description</label>
                <textarea
                  name="description"
                  value={experience.description}
                  onChange={handleChange}
                  placeholder="Describe your responsibilities or achievements"
                  className="custom-input-style"
                  rows={4}
                />
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button onClick={() => setShowPopup(false)} className="cancel-button">Cancel</button>
              <button onClick={handleSave} className="save-button">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExperiencePopupPage;

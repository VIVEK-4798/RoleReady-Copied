import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/utils/apiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const EducationPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [education, setEducation] = useState({
    qualification: "",
    course: "",
    specialization: "",
    college: "",
    startYear: "",
    endYear: "",
    courseType: "",
    percentage: "",
    cgpa: "",
    rollNumber: "",
    lateralEntry: false,
    skills: "",
    description: "",
  });
  const [savedEducation, setSavedEducation] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  useEffect(() => {
    if (user_id) fetchEducation();
  }, []);

  const fetchEducation = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-education/${user_id}`);
      if (res.data.education) {
        const parsedEducation = JSON.parse(res.data.education); 
        setSavedEducation(parsedEducation);
      }
    } catch (err) {
      console.error("Error fetching education:", err);
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
    const { name, value, type, checked } = e.target;
    setEducation((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${api}/api/profile/save-education`, {
        user_id,
        education,
      });
      if (res.data.success) {
        toast.success("Education saved successfully");
        setSavedEducation(education);
        setShowPopup(false);
      } else {
        toast.error("Failed to save education");
      }
    } catch (err) {
      toast.error("Error saving education");
      console.error(err);
    }
  };

  const openEditPopup = () => {
    if (savedEducation) setEducation(savedEducation);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div style={{ borderRadius: "0.375rem", padding: "1rem", marginTop: "0.7rem" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <h5 style={{ fontSize: "1.25rem", fontWeight: 600, marginBottom: "0.5rem" }}>
              Education
            </h5>
            {savedEducation ? (
              <>
                <div style={{ display: "flex",flexDirection: "column",  gap: "0.5rem", flexWrap: "wrap" }}>
                  <div>
                  <p style={{ fontSize: "1rem", color: "#4B5563", whiteSpace: "pre-line", marginBottom: 0 }}>
                    <strong>{savedEducation.course}</strong> in <strong>{savedEducation.specialization}</strong> at <strong>{savedEducation.college}</strong><br />
                    {savedEducation.startYear} to {savedEducation.endYear}<br />
                    {savedEducation.qualification} | {savedEducation.courseType}<br />
                    CGPA: {savedEducation.cgpa} | Skills: {savedEducation.skills}<br />
                    {savedEducation.description}
                  </p>
                  </div>
                  <div>
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={openEditPopup}
                    className="text-blue-500 cursor-pointer hover:opacity-80"
                    size="lg"
                  />
                  </div>
                </div>
              </>
            ) : (
              <span
                style={{ color: "#3B82F6", textDecoration: "underline", cursor: "pointer" }}
                onClick={() => setShowPopup(true)}
              >
                Add Education
              </span>
            )}
          </div>
          <img
            src="/img/profile/education.webp"
            alt="education"
            style={{ width: "140px", height: "110px", objectFit: "cover" }}
          />
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second">
            <h3 style={{ fontSize: "1.125rem", fontWeight: 600, marginBottom: "1rem" }}>
              Add Education <span style={{ color: "red" }}>*</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: "Qualification *", name: "qualification", placeholder: "Enter qualification" },
                { label: "Course *", name: "course", placeholder: "Enter course" },
                { label: "Specialization *", name: "specialization", placeholder: "Enter specialization" },
                { label: "College *", name: "college", placeholder: "Enter college" },
                { label: "Start Year *", name: "startYear", type: "month" },
                { label: "End Year *", name: "endYear", type: "month" },
                { label: "CGPA", name: "cgpa", placeholder: "Enter CGPA" },
              ].map(({ label, name, type = "text", placeholder = "" }) => (
                <div key={name}>
                  <label className="text-sm font-medium">{label}</label>
                  <input
                    type={type}
                    name={name}
                    value={education[name]}
                    onChange={handleChange}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mb-1"
                  />
                </div>
              ))}

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={education.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mt-1"
                />
              </div>

              <div className="md:col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={education.description}
                  onChange={handleChange}
                  placeholder="Describe your academic experience"
                  rows="3"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none mt-1"
                ></textarea>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
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

export default EducationPopupPage;

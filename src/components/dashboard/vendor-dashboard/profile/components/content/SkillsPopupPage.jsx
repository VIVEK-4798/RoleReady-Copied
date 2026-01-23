import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSearch, faTimes, faPlus } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";

const SkillsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  // Level options
  const levelOptions = [
    { value: "beginner", label: "Beginner", color: "#3B82F6" },
    { value: "intermediate", label: "Intermediate", color: "#8B5CF6" },
    { value: "advanced", label: "Advanced", color: "#10B981" }
  ];

  // Some default suggestions
  const defaultSuggestions = [
    { skill_id: 1, skill_name: "JavaScript", category: "Web Development" },
    { skill_id: 2, skill_name: "React", category: "Frontend" },
    { skill_id: 3, skill_name: "Node.js", category: "Backend" },
    { skill_id: 4, skill_name: "Python", category: "Programming" },
    { skill_id: 5, skill_name: "SQL", category: "Database" },
    { skill_id: 6, skill_name: "Git", category: "Tools" },
    { skill_id: 7, skill_name: "Docker", category: "DevOps" },
    { skill_id: 8, skill_name: "AWS", category: "Cloud" },
    { skill_id: 9, skill_name: "TypeScript", category: "Web Development" },
    { skill_id: 10, skill_name: "MongoDB", category: "Database" }
  ];

  useEffect(() => {
    if (user_id) {
      fetchUserSkills();
    }
  }, [user_id]);

  useEffect(() => {
    // Debounce search
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSkills(searchQuery);
      } else {
        setAvailableSkills(defaultSuggestions);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const fetchUserSkills = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${api}/api/profile/get-skills/${user_id}?role=user`);
      if (res.data.skills) {
        setUserSkills(res.data.skills);
      }
    } catch (error) {
      console.error("Error fetching skills:", error);
      toast.error("Failed to load skills");
    } finally {
      setLoading(false);
    }
  };

  const searchSkills = async (query) => {
    try {
      setSearchLoading(true);
      const res = await axios.get(`${api}/api/profile/available-skills?search=${query}`);
      if (res.data.skills) {
        setAvailableSkills(res.data.skills);
      }
    } catch (error) {
      console.error("Error searching skills:", error);
      // Fallback to default suggestions on error
      setAvailableSkills(defaultSuggestions.filter(skill => 
        skill.skill_name.toLowerCase().includes(query.toLowerCase())
      ));
    } finally {
      setSearchLoading(false);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  const addSkill = (skill) => {
    // Check if skill already exists
    if (!userSkills.find(s => s.skill_id === skill.skill_id)) {
      setUserSkills(prev => [...prev, {
        ...skill,
        level: "beginner", // Default level
        source: "self"
      }]);
    } else {
      toast.info("Skill already added");
    }
  };

  const removeSkill = (skillId) => {
    setUserSkills(prev => prev.filter(skill => skill.skill_id !== skillId));
  };

  const updateSkillLevel = (skillId, newLevel) => {
    setUserSkills(prev => prev.map(skill => 
      skill.skill_id === skillId ? { ...skill, level: newLevel } : skill
    ));
  };

  const handleSave = async () => {
    if (userSkills.length === 0) {
      toast.error("Please add at least one skill");
      return;
    }

    try {
      const response = await axios.post(`${api}/api/profile/save-skills`, {
        user_id,
        skills: userSkills,
        role: 'user',
        source: 'self'
      });

      if (response.data.success) {
        toast.success("Skills updated successfully!");
        setShowPopup(false);
        // Refresh skills
        fetchUserSkills();
      } else {
        toast.error("Failed to update skills");
      }
    } catch (error) {
      console.error("Save error:", error);
      toast.error(error.response?.data?.message || "Server error");
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const openEditPopup = () => {
    setAvailableSkills(defaultSuggestions);
    setSearchQuery("");
    setShowPopup(true);
  };

  const getLevelColor = (level) => {
    const levelObj = levelOptions.find(opt => opt.value === level);
    return levelObj ? levelObj.color : "#6B7280";
  };

  const getLevelLabel = (level) => {
    const levelObj = levelOptions.find(opt => opt.value === level);
    return levelObj ? levelObj.label : "Beginner";
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12" style={{ padding: "1rem", marginTop: "0.7rem" }}>
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col w-4/5">
            <h5 className="text-20 fw-600 mb-15">Skills</h5>
            
            {loading ? (
              <div className="flex items-center gap-2 mb-4">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                <span className="text-gray-500">Loading skills...</span>
              </div>
            ) : userSkills.length > 0 ? (
              <>
                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                  {userSkills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      style={{
                        backgroundColor: "#EEF2FF",
                        padding: "0.4rem 0.8rem",
                        borderRadius: "1rem",
                        display: "flex",
                        alignItems: "center",
                        gap: "0.5rem"
                      }}
                    >
                      <span style={{ color: "#4338CA", fontSize: "0.85rem", fontWeight: "500" }}>
                        {skill.skill_name}
                      </span>
                      <span
                        style={{
                          backgroundColor: getLevelColor(skill.level),
                          color: "white",
                          padding: "0.1rem 0.4rem",
                          borderRadius: "0.5rem",
                          fontSize: "0.7rem",
                          fontWeight: "500"
                        }}
                      >
                        {getLevelLabel(skill.level)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center gap-2">
                  <FontAwesomeIcon
                    icon={faPenToSquare}
                    onClick={openEditPopup}
                    className="text-blue-500 cursor-pointer hover:opacity-80"
                    size="lg"
                  />
                  <span 
                    className="text-blue-500 text-sm cursor-pointer hover:underline"
                    onClick={openEditPopup}
                  >
                    Edit Skills
                  </span>
                </div>
              </>
            ) : (
              <>
                <p className="text-16 text-light-1 mb-4">
                  Spotlight your unique skills for recruiters! Add your skills and proficiency levels.
                </p>
                <button
                  onClick={openEditPopup}
                  className="flex items-center gap-2 text-blue-500 hover:text-blue-600 font-medium"
                  style={{ cursor: "pointer" }}
                >
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                  Add Skills
                </button>
              </>
            )}
          </div>
          <div>
            <img src="/img/profile/skills.webp" alt="skills" style={{ width: 140, height: 110 }} />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <div className="popup-second" style={{ maxWidth: "600px", maxHeight: "80vh", overflow: "hidden" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "1rem" }}>
              <div>
                <h3 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem", color: "#111827" }}>
                  Manage Your Skills
                </h3>
                <p style={{ fontSize: "0.875rem", color: "#6B7280" }}>
                  Add your skills and set proficiency levels to showcase your expertise
                </p>
              </div>
              <button
                onClick={() => setShowPopup(false)}
                className="text-gray-400 hover:text-gray-600"
                style={{ background: "none", border: "none", fontSize: "1.25rem", cursor: "pointer" }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>

            {/* Search and Add Skills Section */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ position: "relative", marginBottom: "1rem" }}>
                <FontAwesomeIcon
                  icon={faSearch}
                  style={{
                    position: "absolute",
                    left: "12px",
                    top: "50%",
                    transform: "translateY(-50%)",
                    color: "#9CA3AF"
                  }}
                />
                <input
                  type="text"
                  placeholder="Search for skills (JavaScript, React, Python...)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.75rem 1rem 0.75rem 2.5rem",
                    border: "1px solid #D1D5DB",
                    borderRadius: "0.5rem",
                    fontSize: "0.875rem",
                    outline: "none",
                    transition: "border-color 0.2s"
                  }}
                  onFocus={(e) => e.target.style.borderColor = "#3B82F6"}
                  onBlur={(e) => e.target.style.borderColor = "#D1D5DB"}
                />
              </div>

              {/* Available Skills */}
              <div style={{ marginBottom: "1rem" }}>
                <p style={{ fontWeight: 500, fontSize: "0.9rem", marginBottom: "0.5rem", color: "#374151" }}>
                  Available Skills
                </p>
                {searchLoading ? (
                  <div className="flex justify-center py-4">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                  </div>
                ) : (
                  <div style={{ 
                    display: "flex", 
                    flexWrap: "wrap", 
                    gap: "0.5rem",
                    maxHeight: "120px",
                    overflowY: "auto",
                    padding: "0.25rem"
                  }}>
                    {availableSkills.map((skill) => (
                      <button
                        key={skill.skill_id}
                        onClick={() => addSkill(skill)}
                        style={{
                          padding: "0.4rem 0.8rem",
                          borderRadius: "1rem",
                          backgroundColor: "#F3F4F6",
                          color: "#1F2937",
                          fontSize: "0.8rem",
                          cursor: "pointer",
                          border: "none",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.25rem",
                          transition: "all 0.2s"
                        }}
                        onMouseEnter={(e) => {
                          e.target.style.backgroundColor = "#E5E7EB";
                          e.target.style.transform = "translateY(-1px)";
                        }}
                        onMouseLeave={(e) => {
                          e.target.style.backgroundColor = "#F3F4F6";
                          e.target.style.transform = "translateY(0)";
                        }}
                      >
                        <FontAwesomeIcon icon={faPlus} size="xs" />
                        {skill.skill_name}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Selected Skills with Levels */}
            <div style={{ marginBottom: "1.5rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.75rem" }}>
                <p style={{ fontWeight: 600, fontSize: "0.9rem", color: "#374151" }}>
                  Your Skills ({userSkills.length})
                </p>
                {userSkills.length > 0 && (
                  <button
                    onClick={() => setUserSkills([])}
                    className="text-sm text-red-500 hover:text-red-600"
                    style={{ background: "none", border: "none", cursor: "pointer" }}
                  >
                    Clear All
                  </button>
                )}
              </div>

              {userSkills.length === 0 ? (
                <div style={{ 
                  textAlign: "center", 
                  padding: "2rem", 
                  backgroundColor: "#F9FAFB", 
                  borderRadius: "0.5rem",
                  border: "1px dashed #D1D5DB"
                }}>
                  <p style={{ color: "#6B7280", marginBottom: "0.5rem" }}>No skills added yet</p>
                  <p style={{ color: "#9CA3AF", fontSize: "0.875rem" }}>Search and add skills from above</p>
                </div>
              ) : (
                <div style={{ 
                  maxHeight: "200px", 
                  overflowY: "auto",
                  padding: "0.25rem"
                }}>
                  {userSkills.map((skill) => (
                    <div
                      key={skill.skill_id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "0.75rem",
                        backgroundColor: "#F9FAFB",
                        borderRadius: "0.5rem",
                        marginBottom: "0.5rem",
                        border: "1px solid #E5E7EB"
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        <span style={{ 
                          backgroundColor: "#DBEAFE", 
                          color: "#1E40AF",
                          padding: "0.25rem 0.5rem",
                          borderRadius: "0.25rem",
                          fontSize: "0.75rem",
                          fontWeight: "500"
                        }}>
                          {skill.skill_name}
                        </span>
                        {skill.category && (
                          <span style={{ 
                            color: "#6B7280", 
                            fontSize: "0.75rem"
                          }}>
                            {skill.category}
                          </span>
                        )}
                      </div>
                      
                      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                        {/* Level Selector */}
                        <div style={{ display: "flex", gap: "0.25rem" }}>
                          {levelOptions.map((level) => (
                            <button
                              key={level.value}
                              onClick={() => updateSkillLevel(skill.skill_id, level.value)}
                              style={{
                                padding: "0.25rem 0.5rem",
                                borderRadius: "0.25rem",
                                fontSize: "0.7rem",
                                fontWeight: "500",
                                cursor: "pointer",
                                border: "none",
                                backgroundColor: skill.level === level.value ? level.color : "#F3F4F6",
                                color: skill.level === level.value ? "white" : "#6B7280",
                                transition: "all 0.2s"
                              }}
                            >
                              {level.label.charAt(0)}
                            </button>
                          ))}
                        </div>
                        
                        {/* Remove Button */}
                        <button
                          onClick={() => removeSkill(skill.skill_id)}
                          style={{
                            background: "none",
                            border: "none",
                            color: "#EF4444",
                            cursor: "pointer",
                            padding: "0.25rem"
                          }}
                        >
                          <FontAwesomeIcon icon={faTimes} size="sm" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Legend for Level Colors */}
            <div style={{ 
              backgroundColor: "#F9FAFB", 
              padding: "0.75rem", 
              borderRadius: "0.5rem",
              marginBottom: "1.5rem",
              border: "1px solid #E5E7EB"
            }}>
              <p style={{ fontWeight: 500, fontSize: "0.8rem", marginBottom: "0.5rem", color: "#374151" }}>
                Proficiency Levels:
              </p>
              <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
                {levelOptions.map((level) => (
                  <div key={level.value} style={{ display: "flex", alignItems: "center", gap: "0.25rem" }}>
                    <div style={{ 
                      width: "12px", 
                      height: "12px", 
                      borderRadius: "2px", 
                      backgroundColor: level.color 
                    }}></div>
                    <span style={{ fontSize: "0.75rem", color: "#6B7280" }}>
                      {level.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div style={{ 
              display: "flex", 
              justifyContent: "flex-end", 
              gap: "1rem",
              paddingTop: "1rem",
              borderTop: "1px solid #E5E7EB"
            }}>
              <button
                onClick={() => setShowPopup(false)}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.375rem",
                  border: "1px solid #D1D5DB",
                  backgroundColor: "white",
                  color: "#374151",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: "pointer",
                  transition: "all 0.2s"
                }}
                onMouseEnter={(e) => e.target.style.backgroundColor = "#F9FAFB"}
                onMouseLeave={(e) => e.target.style.backgroundColor = "white"}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={userSkills.length === 0}
                style={{
                  padding: "0.5rem 1.5rem",
                  borderRadius: "0.375rem",
                  border: "none",
                  backgroundColor: userSkills.length === 0 ? "#9CA3AF" : "#3B82F6",
                  color: "white",
                  fontSize: "0.875rem",
                  fontWeight: "500",
                  cursor: userSkills.length === 0 ? "not-allowed" : "pointer",
                  transition: "all 0.2s",
                  opacity: userSkills.length === 0 ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (userSkills.length > 0) {
                    e.target.style.backgroundColor = "#2563EB";
                  }
                }}
                onMouseLeave={(e) => {
                  if (userSkills.length > 0) {
                    e.target.style.backgroundColor = "#3B82F6";
                  }
                }}
              >
                Save Skills
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPopupPage;
import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faSearch, faTimes, faPlus, faCheckCircle, faExclamationTriangle, faInfoCircle } from "@fortawesome/free-solid-svg-icons";
import { api } from "@/utils/apiProvider";

/* ============================================================================
   🎓 STEP 6: User-Side Validation Display
   ============================================================================
   
   This component now shows validation status for each skill:
   - ✓ Validated: Green checkmark with mentor name
   - ⚠️ Rejected: Yellow warning with reason tooltip
   - 📄 Resume: Purple badge for resume-parsed skills
   - ✋ Self: Gray badge for self-declared skills
   
   ============================================================================ */

const SkillsPopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [userSkills, setUserSkills] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [availableSkills, setAvailableSkills] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedSkillDetail, setSelectedSkillDetail] = useState(null); // For validation detail modal
  
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

  // 🎓 STEP 6: Get validation badge styling
  const getValidationBadge = (skill) => {
    const { validation_status, source } = skill;
    
    if (validation_status === 'validated' || source === 'validated') {
      return {
        icon: '🎓',
        label: 'Validated',
        bgColor: '#DBEAFE',
        borderColor: '#3B82F6',
        textColor: '#1E40AF',
        showBadge: true
      };
    }
    
    if (validation_status === 'rejected') {
      return {
        icon: '⚠️',
        label: 'Rejected',
        bgColor: '#FEF3C7',
        borderColor: '#F59E0B',
        textColor: '#92400E',
        showBadge: true
      };
    }
    
    if (source === 'resume') {
      return {
        icon: '📄',
        label: 'Resume',
        bgColor: '#EDE9FE',
        borderColor: '#8B5CF6',
        textColor: '#5B21B6',
        showBadge: true
      };
    }
    
    // Default: self-declared
    return {
      icon: '✋',
      label: 'Self',
      bgColor: '#F3F4F6',
      borderColor: '#9CA3AF',
      textColor: '#4B5563',
      showBadge: false // Don't show badge for self (default)
    };
  };

  // 🎓 STEP 6: Get skill chip styling based on validation status
  const getSkillChipStyle = (skill) => {
    const { validation_status, source } = skill;
    
    if (validation_status === 'validated' || source === 'validated') {
      return {
        backgroundColor: '#EFF6FF',
        border: '2px solid #3B82F6',
        boxShadow: '0 0 0 2px rgba(59, 130, 246, 0.15)'
      };
    }
    
    if (validation_status === 'rejected') {
      return {
        backgroundColor: '#FFFBEB',
        border: '2px solid #F59E0B',
        opacity: 0.85
      };
    }
    
    if (source === 'resume') {
      return {
        backgroundColor: '#F5F3FF',
        border: '1px solid #C4B5FD'
      };
    }
    
    return {
      backgroundColor: '#EEF2FF',
      border: '1px solid #C7D2FE'
    };
  };

  // 🎓 STEP 6: Calculate validation stats
  const getValidationStats = () => {
    const validated = userSkills.filter(s => s.validation_status === 'validated' || s.source === 'validated').length;
    const rejected = userSkills.filter(s => s.validation_status === 'rejected').length;
    const resume = userSkills.filter(s => s.source === 'resume' && s.validation_status !== 'validated').length;
    const self = userSkills.filter(s => s.source === 'self' && !s.validation_status).length;
    
    return { validated, rejected, resume, self, total: userSkills.length };
  };

  // 🎓 STEP 6: Format validation date
  const formatValidationDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
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
                {/* 🎓 STEP 6: Validation Stats Banner */}
                {(() => {
                  const stats = getValidationStats();
                  return stats.validated > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#EFF6FF',
                      border: '1px solid #BFDBFE',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem'
                    }}>
                      <span>🎓</span>
                      <span style={{ color: '#1E40AF', fontWeight: '600' }}>
                        {stats.validated} skill{stats.validated > 1 ? 's' : ''} mentor-validated
                      </span>
                      <span style={{ color: '#60A5FA' }}>•</span>
                      <span style={{ color: '#3B82F6' }}>
                        Verified by industry professionals
                      </span>
                    </div>
                  ) : null;
                })()}
                
                {/* 🎓 STEP 6: Rejected Skills Warning */}
                {(() => {
                  const stats = getValidationStats();
                  return stats.rejected > 0 ? (
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      padding: '0.5rem 0.75rem',
                      backgroundColor: '#FFFBEB',
                      border: '1px solid #FCD34D',
                      borderRadius: '0.5rem',
                      marginBottom: '0.75rem',
                      fontSize: '0.8rem'
                    }}>
                      <span>⚠️</span>
                      <span style={{ color: '#92400E', fontWeight: '600' }}>
                        {stats.rejected} skill{stats.rejected > 1 ? 's' : ''} need attention
                      </span>
                      <span style={{ color: '#FCD34D' }}>•</span>
                      <span style={{ color: '#B45309' }}>
                        Click to see reviewer feedback
                      </span>
                    </div>
                  ) : null;
                })()}

                <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "0.8rem" }}>
                  {userSkills.map((skill) => {
                    const badge = getValidationBadge(skill);
                    const chipStyle = getSkillChipStyle(skill);
                    
                    return (
                      <div
                        key={skill.skill_id}
                        onClick={() => skill.validation_status && setSelectedSkillDetail(skill)}
                        style={{
                          ...chipStyle,
                          padding: "0.4rem 0.8rem",
                          borderRadius: "1rem",
                          display: "flex",
                          alignItems: "center",
                          gap: "0.5rem",
                          cursor: skill.validation_status ? 'pointer' : 'default',
                          transition: 'all 0.2s'
                        }}
                        title={skill.validation_status === 'rejected' 
                          ? `Rejected: ${skill.validation_note || 'No reason provided'}`
                          : skill.validation_status === 'validated'
                          ? `Validated by ${skill.validator_name || 'Mentor'}`
                          : `Source: ${skill.source || 'self'}`
                        }
                      >
                        {/* Validation icon */}
                        {badge.showBadge && (
                          <span style={{ fontSize: '0.75rem' }}>{badge.icon}</span>
                        )}
                        
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
                        
                        {/* Validation status indicator */}
                        {skill.validation_status === 'validated' && (
                          <span style={{ color: '#16A34A', fontSize: '0.75rem' }}>✓</span>
                        )}
                        {skill.validation_status === 'rejected' && (
                          <FontAwesomeIcon 
                            icon={faInfoCircle} 
                            style={{ color: '#F59E0B', fontSize: '0.7rem' }} 
                          />
                        )}
                      </div>
                    );
                  })}
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
      
      {/* 🎓 STEP 6: Validation Detail Modal */}
      {selectedSkillDetail && (
        <div 
          className="popup-main overlay" 
          onClick={(e) => e.target.classList.contains('overlay') && setSelectedSkillDetail(null)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001
          }}
        >
          <div style={{
            backgroundColor: 'white',
            borderRadius: '1rem',
            padding: '1.5rem',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            {/* Header */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: '1rem',
              paddingBottom: '1rem',
              borderBottom: '1px solid #E5E7EB'
            }}>
              <div>
                <h4 style={{ 
                  fontSize: '1.125rem', 
                  fontWeight: '600', 
                  color: '#1F2937',
                  marginBottom: '0.25rem'
                }}>
                  {selectedSkillDetail.skill_name}
                </h4>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.125rem 0.5rem',
                  borderRadius: '9999px',
                  backgroundColor: getLevelColor(selectedSkillDetail.level),
                  color: 'white'
                }}>
                  {getLevelLabel(selectedSkillDetail.level)}
                </span>
              </div>
              <button
                onClick={() => setSelectedSkillDetail(null)}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.25rem', 
                  cursor: 'pointer',
                  color: '#9CA3AF'
                }}
              >
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            
            {/* Validation Status */}
            <div style={{
              padding: '1rem',
              borderRadius: '0.5rem',
              backgroundColor: selectedSkillDetail.validation_status === 'validated' 
                ? '#ECFDF5' 
                : selectedSkillDetail.validation_status === 'rejected'
                ? '#FFFBEB'
                : '#F3F4F6',
              border: `1px solid ${
                selectedSkillDetail.validation_status === 'validated' 
                  ? '#A7F3D0' 
                  : selectedSkillDetail.validation_status === 'rejected'
                  ? '#FCD34D'
                  : '#E5E7EB'
              }`,
              marginBottom: '1rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '1.25rem' }}>
                  {selectedSkillDetail.validation_status === 'validated' ? '🎓' : '⚠️'}
                </span>
                <span style={{ 
                  fontWeight: '600',
                  color: selectedSkillDetail.validation_status === 'validated' ? '#065F46' : '#92400E'
                }}>
                  {selectedSkillDetail.validation_status === 'validated' ? 'Skill Validated' : 'Skill Rejected'}
                </span>
              </div>
              
              {/* Reviewer Info */}
              {selectedSkillDetail.validator_name && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Reviewed by: </span>
                  <span style={{ color: '#1F2937', fontWeight: '500', fontSize: '0.875rem' }}>
                    {selectedSkillDetail.validator_name}
                  </span>
                </div>
              )}
              
              {/* Review Date */}
              {selectedSkillDetail.validated_at && (
                <div style={{ marginBottom: '0.5rem' }}>
                  <span style={{ color: '#6B7280', fontSize: '0.875rem' }}>Review date: </span>
                  <span style={{ color: '#1F2937', fontSize: '0.875rem' }}>
                    {formatValidationDate(selectedSkillDetail.validated_at)}
                  </span>
                </div>
              )}
            </div>
            
            {/* Rejection Reason (if rejected) */}
            {selectedSkillDetail.validation_status === 'rejected' && selectedSkillDetail.validation_note && (
              <div style={{
                padding: '1rem',
                borderRadius: '0.5rem',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                marginBottom: '1rem'
              }}>
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'flex-start', 
                  gap: '0.5rem'
                }}>
                  <FontAwesomeIcon 
                    icon={faExclamationTriangle} 
                    style={{ color: '#DC2626', marginTop: '0.125rem' }} 
                  />
                  <div>
                    <p style={{ 
                      fontWeight: '600', 
                      color: '#991B1B', 
                      marginBottom: '0.25rem',
                      fontSize: '0.875rem'
                    }}>
                      Reviewer Feedback
                    </p>
                    <p style={{ color: '#7F1D1D', fontSize: '0.875rem', lineHeight: '1.5' }}>
                      {selectedSkillDetail.validation_note}
                    </p>
                  </div>
                </div>
              </div>
            )}
            
            {/* Validation Benefits (if validated) */}
            {selectedSkillDetail.validation_status === 'validated' && (
              <div style={{
                padding: '0.75rem',
                borderRadius: '0.5rem',
                backgroundColor: '#F0F9FF',
                border: '1px solid #BAE6FD'
              }}>
                <p style={{ fontSize: '0.8rem', color: '#0369A1', marginBottom: '0.25rem' }}>
                  <strong>✓ Validation Benefits:</strong>
                </p>
                <ul style={{ 
                  margin: 0, 
                  paddingLeft: '1.25rem', 
                  color: '#0369A1', 
                  fontSize: '0.8rem',
                  lineHeight: '1.5'
                }}>
                  <li>1.25× weight bonus in readiness calculation</li>
                  <li>Verified badge visible to recruiters</li>
                  <li>Third-party credibility proof</li>
                </ul>
              </div>
            )}
            
            {/* Actions */}
            <div style={{ 
              display: 'flex', 
              justifyContent: 'flex-end', 
              marginTop: '1.5rem',
              paddingTop: '1rem',
              borderTop: '1px solid #E5E7EB'
            }}>
              <button
                onClick={() => setSelectedSkillDetail(null)}
                style={{
                  padding: '0.5rem 1.25rem',
                  borderRadius: '0.375rem',
                  border: 'none',
                  backgroundColor: '#3B82F6',
                  color: 'white',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  cursor: 'pointer'
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillsPopupPage;
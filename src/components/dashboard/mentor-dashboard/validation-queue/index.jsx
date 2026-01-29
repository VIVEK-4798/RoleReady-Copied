import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/utils/apiProvider";

/* ============================================================================
   🎓 MENTOR VALIDATION QUEUE - STEP 3 + Evidence Context Enhancement
   ============================================================================
   
   Simple table view for mentors to validate/reject user skills.
   
   Displays:
   - User name
   - Skill name
   - Source (self/resume)
   - Level
   - Actions (Validate/Reject)
   - 🆕 Evidence Context (expandable panel with resume excerpt, related skills, etc.)
   
   Evidence Context allows informed validation WITHOUT chat.
   ============================================================================ */

const ValidationQueue = () => {
  const [queue, setQueue] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, validated: 0, rejected: 0 });
  const [rejectModal, setRejectModal] = useState({ show: false, skill: null });
  const [rejectNote, setRejectNote] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  // 🆕 Evidence Context state
  const [expandedEvidence, setExpandedEvidence] = useState(null); // {user_id, skill_id}
  const [evidenceData, setEvidenceData] = useState({});
  const [loadingEvidence, setLoadingEvidence] = useState(null);

  // Get mentor info from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const mentor_id = user?.user_id;

  useEffect(() => {
    if (mentor_id) {
      fetchQueue();
      fetchStats();
    }
  }, [mentor_id]);

  const fetchQueue = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(`${api}/api/mentor-validation/queue/${mentor_id}`);
      if (res.data.success) {
        setQueue(res.data.flat_list || []);
      }
    } catch (err) {
      console.error("Error fetching queue:", err);
      toast.error("Failed to load validation queue");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await axios.get(`${api}/api/mentor-validation/stats/${mentor_id}`);
      if (res.data.success) {
        setStats(res.data.stats);
      }
    } catch (err) {
      console.error("Error fetching stats:", err);
    }
  };

  // 🆕 Fetch evidence context for a skill
  const fetchEvidence = async (user_id, skill_id) => {
    const key = `${user_id}-${skill_id}`;
    
    // If already loaded, just toggle
    if (evidenceData[key]) {
      setExpandedEvidence(expandedEvidence === key ? null : key);
      return;
    }
    
    setLoadingEvidence(key);
    try {
      const res = await axios.get(`${api}/api/mentor-validation/evidence/${user_id}/${skill_id}`);
      if (res.data.success) {
        setEvidenceData(prev => ({ ...prev, [key]: res.data.evidence }));
        setExpandedEvidence(key);
      }
    } catch (err) {
      console.error("Error fetching evidence:", err);
      toast.error("Failed to load evidence context");
    } finally {
      setLoadingEvidence(null);
    }
  };

  const handleValidate = async (skill) => {
    setIsProcessing(true);
    try {
      const res = await axios.post(`${api}/api/mentor-validation/validate`, {
        mentor_id,
        user_id: skill.user_id,
        skill_id: skill.skill_id,
        note: null
      });
      
      if (res.data.success) {
        toast.success(`✅ Validated: ${skill.skill_name}`);
        // Remove from queue
        setQueue(prev => prev.filter(s => 
          !(s.user_id === skill.user_id && s.skill_id === skill.skill_id)
        ));
        fetchStats();
      }
    } catch (err) {
      console.error("Error validating:", err);
      toast.error(err.response?.data?.message || "Failed to validate skill");
    } finally {
      setIsProcessing(false);
    }
  };

  const openRejectModal = (skill) => {
    setRejectModal({ show: true, skill });
    setRejectNote("");
  };

  const closeRejectModal = () => {
    setRejectModal({ show: false, skill: null });
    setRejectNote("");
  };

  const handleReject = async () => {
    if (!rejectModal.skill) return;
    
    if (rejectNote.trim().length < 10) {
      toast.warning("Please provide a reason (at least 10 characters)");
      return;
    }
    
    setIsProcessing(true);
    try {
      const res = await axios.post(`${api}/api/mentor-validation/reject`, {
        mentor_id,
        user_id: rejectModal.skill.user_id,
        skill_id: rejectModal.skill.skill_id,
        note: rejectNote
      });
      
      if (res.data.success) {
        toast.info(`⚠️ Rejected: ${rejectModal.skill.skill_name}`);
        // Remove from queue
        setQueue(prev => prev.filter(s => 
          !(s.user_id === rejectModal.skill.user_id && s.skill_id === rejectModal.skill.skill_id)
        ));
        fetchStats();
        closeRejectModal();
      }
    } catch (err) {
      console.error("Error rejecting:", err);
      toast.error(err.response?.data?.message || "Failed to reject skill");
    } finally {
      setIsProcessing(false);
    }
  };

  // Source badge styling
  const getSourceBadge = (source) => {
    const styles = {
      self: { bg: "#fef3c7", color: "#92400e", label: "Self" },
      resume: { bg: "#dbeafe", color: "#1e40af", label: "Resume" },
      validated: { bg: "#d1fae5", color: "#065f46", label: "Validated" }
    };
    const style = styles[source] || styles.self;
    return (
      <span style={{
        padding: "0.25rem 0.5rem",
        borderRadius: "4px",
        fontSize: "0.75rem",
        fontWeight: 500,
        backgroundColor: style.bg,
        color: style.color
      }}>
        {style.label}
      </span>
    );
  };

  if (!mentor_id) {
    return (
      <div className="validation-queue" style={{ padding: "2rem", textAlign: "center" }}>
        <p>Please log in as a mentor to access the validation queue.</p>
      </div>
    );
  }

  return (
    <div className="validation-queue" style={{ padding: "1.5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 600, marginBottom: "0.5rem" }}>
          🎓 Skill Validation Queue
        </h2>
        <p style={{ color: "#6b7280", fontSize: "0.9rem" }}>
          Review and validate user skills. Your validation adds credibility to their profile.
        </p>
      </div>

      {/* Stats */}
      <div style={{
        display: "flex",
        gap: "1rem",
        marginBottom: "1.5rem",
        flexWrap: "wrap"
      }}>
        <div style={{
          padding: "1rem",
          backgroundColor: "#f3f4f6",
          borderRadius: "8px",
          minWidth: "120px"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 600 }}>{queue.length}</div>
          <div style={{ fontSize: "0.8rem", color: "#6b7280" }}>Pending</div>
        </div>
        <div style={{
          padding: "1rem",
          backgroundColor: "#d1fae5",
          borderRadius: "8px",
          minWidth: "120px"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#065f46" }}>{stats.validated}</div>
          <div style={{ fontSize: "0.8rem", color: "#065f46" }}>Validated</div>
        </div>
        <div style={{
          padding: "1rem",
          backgroundColor: "#fee2e2",
          borderRadius: "8px",
          minWidth: "120px"
        }}>
          <div style={{ fontSize: "1.5rem", fontWeight: 600, color: "#991b1b" }}>{stats.rejected}</div>
          <div style={{ fontSize: "0.8rem", color: "#991b1b" }}>Rejected</div>
        </div>
      </div>

      {/* Loading State */}
      {isLoading ? (
        <div style={{ textAlign: "center", padding: "2rem", color: "#6b7280" }}>
          Loading validation queue...
        </div>
      ) : queue.length === 0 ? (
        <div style={{
          textAlign: "center",
          padding: "3rem",
          backgroundColor: "#f9fafb",
          borderRadius: "8px",
          color: "#6b7280"
        }}>
          <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>✨</div>
          <p>No skills pending validation!</p>
          <p style={{ fontSize: "0.8rem" }}>Check back later for new skills to review.</p>
        </div>
      ) : (
        /* Skills Table */
        <div style={{ overflowX: "auto" }}>
          <table style={{
            width: "100%",
            borderCollapse: "collapse",
            fontSize: "0.9rem"
          }}>
            <thead>
              <tr style={{ backgroundColor: "#f9fafb" }}>
                <th style={thStyle}>User</th>
                <th style={thStyle}>Skill</th>
                <th style={thStyle}>Level</th>
                <th style={thStyle}>Source</th>
                <th style={thStyle}>Target Role</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {queue.map((skill, idx) => {
                const evidenceKey = `${skill.user_id}-${skill.skill_id}`;
                const isExpanded = expandedEvidence === evidenceKey;
                const evidence = evidenceData[evidenceKey];
                const isLoadingThis = loadingEvidence === evidenceKey;
                
                return (
                  <React.Fragment key={evidenceKey}>
                    <tr style={{
                      borderBottom: isExpanded ? "none" : "1px solid #e5e7eb",
                      backgroundColor: idx % 2 === 0 ? "#fff" : "#f9fafb"
                    }}>
                      <td style={tdStyle}>
                        <div>
                          <div style={{ fontWeight: 500 }}>{skill.user_name}</div>
                          <div style={{ fontSize: "0.75rem", color: "#9ca3af" }}>
                            {skill.user_email}
                          </div>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                          <span style={{ fontWeight: 500 }}>{skill.skill_name}</span>
                          {/* 🆕 Evidence toggle button */}
                          <button
                            onClick={() => fetchEvidence(skill.user_id, skill.skill_id)}
                            disabled={isLoadingThis}
                            style={{
                              padding: "0.25rem 0.5rem",
                              backgroundColor: isExpanded ? "#4f46e5" : "#e0e7ff",
                              color: isExpanded ? "white" : "#4f46e5",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.7rem",
                              cursor: "pointer",
                              fontWeight: 500,
                              transition: "all 0.2s"
                            }}
                            title="View evidence context"
                          >
                            {isLoadingThis ? "..." : isExpanded ? "▲ Hide" : "▼ Evidence"}
                          </button>
                        </div>
                      </td>
                      <td style={tdStyle}>
                        <span style={{ textTransform: "capitalize" }}>{skill.level}</span>
                      </td>
                      <td style={tdStyle}>
                        {getSourceBadge(skill.source)}
                      </td>
                      <td style={tdStyle}>
                        <span style={{ color: "#6b7280" }}>
                          {skill.target_role_name || "—"}
                        </span>
                      </td>
                      <td style={tdStyle}>
                        <div style={{ display: "flex", gap: "0.5rem" }}>
                          <button
                            onClick={() => handleValidate(skill)}
                            disabled={isProcessing}
                            style={{
                              padding: "0.375rem 0.75rem",
                              backgroundColor: "#10b981",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: isProcessing ? "not-allowed" : "pointer",
                              opacity: isProcessing ? 0.6 : 1
                            }}
                          >
                            ✓ Validate
                          </button>
                          <button
                            onClick={() => openRejectModal(skill)}
                            disabled={isProcessing}
                            style={{
                              padding: "0.375rem 0.75rem",
                              backgroundColor: "#ef4444",
                              color: "white",
                              border: "none",
                              borderRadius: "4px",
                              fontSize: "0.8rem",
                              cursor: isProcessing ? "not-allowed" : "pointer",
                              opacity: isProcessing ? 0.6 : 1
                            }}
                          >
                            ✗ Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                    
                    {/* 🆕 Evidence Context Panel (expandable row) */}
                    {isExpanded && evidence && (
                      <tr style={{ backgroundColor: "#f0f4ff" }}>
                        <td colSpan={6} style={{ padding: "0" }}>
                          <div style={{
                            padding: "1rem 1.5rem",
                            borderBottom: "1px solid #e5e7eb",
                            borderTop: "1px dashed #c7d2fe"
                          }}>
                            <div style={{
                              display: "grid",
                              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                              gap: "1rem"
                            }}>
                              
                              {/* Source & Added Date */}
                              <div style={evidenceCardStyle}>
                                <div style={evidenceCardTitleStyle}>📋 Source Info</div>
                                <div style={{ fontSize: "0.85rem" }}>
                                  <div><strong>Source:</strong> {evidence.source}</div>
                                  <div><strong>Level:</strong> {evidence.skill_level}</div>
                                  <div><strong>Added:</strong> {new Date(evidence.added_at).toLocaleDateString()}</div>
                                </div>
                              </div>
                              
                              {/* Resume Context (if available) */}
                              <div style={evidenceCardStyle}>
                                <div style={evidenceCardTitleStyle}>📄 Resume Context</div>
                                {evidence.resume_context ? (
                                  <div style={{ fontSize: "0.85rem" }}>
                                    <div style={{
                                      padding: "0.5rem",
                                      backgroundColor: "#fef3c7",
                                      borderRadius: "4px",
                                      marginBottom: "0.5rem",
                                      fontStyle: "italic",
                                      color: "#92400e"
                                    }}>
                                      "{evidence.resume_context.match_source}"
                                    </div>
                                    <div style={{ fontSize: "0.75rem", color: "#6b7280" }}>
                                      From: {evidence.resume_context.resume_name}
                                    </div>
                                  </div>
                                ) : (
                                  <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic" }}>
                                    No resume data available
                                  </div>
                                )}
                              </div>
                              
                              {/* Role Importance */}
                              <div style={evidenceCardStyle}>
                                <div style={evidenceCardTitleStyle}>🎯 Role Importance</div>
                                <div style={{ fontSize: "0.85rem" }}>
                                  <div><strong>Target:</strong> {evidence.target_role || "Not set"}</div>
                                  <div style={{
                                    display: "inline-block",
                                    marginTop: "0.5rem",
                                    padding: "0.25rem 0.5rem",
                                    borderRadius: "4px",
                                    fontSize: "0.75rem",
                                    fontWeight: 600,
                                    backgroundColor: evidence.role_importance?.is_required ? "#dcfce7" : "#f3f4f6",
                                    color: evidence.role_importance?.is_required ? "#15803d" : "#6b7280"
                                  }}>
                                    {evidence.role_importance?.importance_level || "Unknown"}
                                  </div>
                                </div>
                              </div>
                              
                              {/* Related Skills */}
                              <div style={evidenceCardStyle}>
                                <div style={evidenceCardTitleStyle}>🔗 Related Skills ({evidence.related_skills?.length || 0})</div>
                                {evidence.related_skills?.length > 0 ? (
                                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.25rem" }}>
                                    {evidence.related_skills.map((rs, i) => (
                                      <span key={i} style={{
                                        padding: "0.2rem 0.4rem",
                                        backgroundColor: rs.validation_status === "validated" ? "#dcfce7" : "#e5e7eb",
                                        borderRadius: "4px",
                                        fontSize: "0.7rem",
                                        color: rs.validation_status === "validated" ? "#15803d" : "#374151"
                                      }}>
                                        {rs.name} ({rs.level})
                                        {rs.validation_status === "validated" && " ✓"}
                                      </span>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ fontSize: "0.85rem", color: "#9ca3af", fontStyle: "italic" }}>
                                    No related skills in same category
                                  </div>
                                )}
                              </div>
                              
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* Reject Modal */}
      {rejectModal.show && (
        <div style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1000
        }} onClick={closeRejectModal}>
          <div style={{
            backgroundColor: "white",
            padding: "1.5rem",
            borderRadius: "8px",
            maxWidth: "400px",
            width: "90%",
            boxShadow: "0 10px 25px rgba(0,0,0,0.2)"
          }} onClick={e => e.stopPropagation()}>
            <h3 style={{ marginBottom: "1rem", fontSize: "1.1rem" }}>
              Reject Skill: {rejectModal.skill?.skill_name}
            </h3>
            <p style={{ fontSize: "0.85rem", color: "#6b7280", marginBottom: "1rem" }}>
              User: {rejectModal.skill?.user_name}
            </p>
            <div style={{ marginBottom: "1rem" }}>
              <label style={{
                display: "block",
                fontSize: "0.85rem",
                fontWeight: 500,
                marginBottom: "0.5rem"
              }}>
                Reason for rejection: *
              </label>
              <textarea
                value={rejectNote}
                onChange={(e) => setRejectNote(e.target.value)}
                placeholder="Explain why this skill is being rejected (at least 10 characters)..."
                style={{
                  width: "100%",
                  padding: "0.5rem",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  minHeight: "80px",
                  fontSize: "0.9rem",
                  resize: "vertical"
                }}
              />
              <div style={{ fontSize: "0.75rem", color: "#9ca3af", marginTop: "0.25rem" }}>
                {rejectNote.length}/10 characters minimum
              </div>
            </div>
            <div style={{ display: "flex", gap: "0.75rem", justifyContent: "flex-end" }}>
              <button
                onClick={closeRejectModal}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#f3f4f6",
                  border: "1px solid #d1d5db",
                  borderRadius: "4px",
                  cursor: "pointer"
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleReject}
                disabled={isProcessing || rejectNote.trim().length < 10}
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#ef4444",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  cursor: (isProcessing || rejectNote.trim().length < 10) ? "not-allowed" : "pointer",
                  opacity: (isProcessing || rejectNote.trim().length < 10) ? 0.6 : 1
                }}
              >
                {isProcessing ? "Rejecting..." : "Reject Skill"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Table styles
const thStyle = {
  padding: "0.75rem 1rem",
  textAlign: "left",
  fontWeight: 600,
  fontSize: "0.8rem",
  color: "#374151",
  borderBottom: "2px solid #e5e7eb"
};

const tdStyle = {
  padding: "0.75rem 1rem",
  verticalAlign: "middle"
};

// 🆕 Evidence Context card styles
const evidenceCardStyle = {
  backgroundColor: "white",
  padding: "0.75rem",
  borderRadius: "8px",
  border: "1px solid #e0e7ff",
  boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
};

const evidenceCardTitleStyle = {
  fontSize: "0.75rem",
  fontWeight: 600,
  color: "#4f46e5",
  marginBottom: "0.5rem",
  textTransform: "uppercase",
  letterSpacing: "0.025em"
};

export default ValidationQueue;

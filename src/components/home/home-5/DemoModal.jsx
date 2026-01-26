import { useEffect, useState, useRef } from "react";

const API_BASE = "http://localhost:5000/api";

/* ============================================================================
   🎭 STEP 6: DEMO MODAL (Landing Page Only)
   ============================================================================
   
   This is a DEMO-ONLY component for the landing page.
   
   KEY CHARACTERISTICS:
   1. Uses dedicated demo endpoints (/readiness/demo/*)
   2. Does NOT save to real readiness history
   3. Clearly labeled as "DEMO" throughout
   4. Prompts users to sign up for real tracking
   
   REAL READINESS requires:
   - User login
   - Profile setup
   - Target role selection
   ============================================================================
*/

const DemoModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [demoResult, setDemoResult] = useState(null);
  const [error, setError] = useState("");
  const [categoryName, setCategoryName] = useState("");

  const modalRef = useRef();

  /* ---------------- Handle outside click ---------------- */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/categories/get-categories`)
      .then(res => res.json())
      .then(data => setCategories(data.results))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ---------------- Category change ---------------- */
  const handleCategoryChange = async (categoryId) => {
    const selectedCategory = categories.find(cat => cat.category_id == categoryId);
    setCategoryName(selectedCategory?.category_name || "");
    setSelectedCategoryId(categoryId);
    setSelectedSkillIds([]);
    setSkills([]);
    setShowResult(false);
    setError("");

    if (!categoryId) return;

    try {
      const res = await fetch(
        `${API_BASE}/categories/get-skills-by-category/${categoryId}`
      );
      const data = await res.json();
      
      console.log("[DemoModal] Skills fetched for category", categoryId, ":", data);
      
      if (data.results && Array.isArray(data.results)) {
        setSkills(data.results);
      } else {
        console.warn("[DemoModal] Unexpected response format:", data);
        setSkills([]);
      }
    } catch (err) {
      console.error("[DemoModal] Error fetching skills:", err);
      setError("Failed to load skills");
    }
  };

  /* ---------------- Skill toggle ---------------- */
  const toggleSkill = (skillId) => {
    setSelectedSkillIds(prev =>
      prev.includes(skillId)
        ? prev.filter(id => id !== skillId)
        : [...prev, skillId]
    );
  };

  /* ---------------- Reset to category selection ---------------- */
  const handleReset = () => {
    setShowResult(false);
    setSelectedSkillIds([]);
    setDemoResult(null);
  };

  /* ---------------- Analyze readiness (DEMO ONLY) ---------------- */
  const handleAnalyze = async () => {
    if (!selectedCategoryId || selectedSkillIds.length === 0) return;

    setLoading(true);
    setError("");

    try {
      /* 1️⃣ Save demo skills (using new demo endpoint) */
      const saveRes = await fetch(`${API_BASE}/readiness/demo/skills`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skill_ids: selectedSkillIds,
          category_id: selectedCategoryId,
        }),
      });

      if (!saveRes.ok) throw new Error("Failed to save demo skills");

      /* 2️⃣ Calculate demo readiness (using new demo endpoint) */
      const calcRes = await fetch(`${API_BASE}/readiness/demo/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          category_id: selectedCategoryId,
        }),
      });

      if (!calcRes.ok) throw new Error("Failed to calculate demo score");

      const result = await calcRes.json();
      setDemoResult(result);
      setShowResult(true);
      
    } catch (err) {
      console.error("[DemoModal] Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzeDisabled =
    !selectedCategoryId || selectedSkillIds.length === 0 || loading;

  /* ---------------- UI ---------------- */
  return (
    <div className="demo-modal-overlay">
      <div className="demo-modal-container" ref={modalRef}>
        <button onClick={onClose} className="demo-modal-close">✕</button>

        {!showResult ? (
          <div className="demo-modal-content-initial">
            <div className="demo-modal-header-initial">
              <h3 className="demo-modal-title">Quick Readiness Demo</h3>
              <p className="demo-modal-subtitle">
                Select your target role and skills to see your readiness score
              </p>
            </div>

            {/* Category Selection */}
            <div className="demo-modal-section-initial">
              <label className="demo-modal-label">
                Target Role Category
              </label>
              <select
                className="demo-modal-select"
                value={selectedCategoryId}
                onChange={(e) => handleCategoryChange(e.target.value)}
              >
                <option value="">Select a category</option>
                {categories.map(cat => (
                  <option key={cat.category_id} value={cat.category_id}>
                    {cat.category_name}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Selection - Only show if category is selected */}
            {selectedCategoryId && (
              <div className="demo-modal-section-initial">
                <div className="demo-modal-skills-header">
                  <label className="demo-modal-label">Skills You Have</label>
                  <span className="demo-modal-skills-count">
                    {selectedSkillIds.length} selected
                  </span>
                </div>
                
                {skills.length > 0 ? (
                  <div className="demo-modal-skills-wrapper">
                    <div className="demo-modal-skills-grid">
                      {skills.map(skill => (
                        <button
                          key={skill.skill_id}
                          type="button"
                          onClick={() => toggleSkill(skill.skill_id)}
                          className={`demo-modal-skill-button ${
                            selectedSkillIds.includes(skill.skill_id)
                              ? "selected"
                              : ""
                          }`}
                        >
                          {skill.name}
                        </button>
                      ))}
                    </div>
                  </div>
                ) : (
                  <div className="demo-modal-loading-skills">
                    Loading skills...
                  </div>
                )}
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="demo-modal-error-initial">
                <span className="demo-modal-error-icon">⚠️</span>
                {error}
              </div>
            )}

            {/* Action Button */}
            <div className="demo-modal-actions-initial">
              <button
                onClick={handleAnalyze}
                disabled={isAnalyzeDisabled}
                className="demo-modal-primary-button"
              >
                {loading ? (
                  <>
                    <span className="demo-modal-spinner"></span>
                    Analyzing...
                  </>
                ) : (
                  "Analyze Readiness"
                )}
              </button>
              <p className="demo-modal-hint">
                Select at least one skill to analyze your readiness
              </p>
            </div>
            
            {/* STEP 6: Demo disclaimer */}
            <div className="demo-modal-disclaimer">
              <span className="demo-modal-disclaimer-icon">ℹ️</span>
              <span>This is a demo. <strong>Sign up</strong> to track your real progress!</span>
            </div>
          </div>
        ) : (
          <div className="demo-modal-content">
            {/* STEP 6: Clear DEMO badge */}
            <div className="demo-modal-demo-badge">
              <span className="demo-badge-icon">🎭</span>
              <span className="demo-badge-text">DEMO RESULT</span>
            </div>
            
            <div className="demo-modal-header">
              <h3 className="demo-modal-title">Your Demo Score</h3>
              <p className="demo-modal-category">{categoryName}</p>
            </div>

            {/* Main Score Card */}
            <div className="demo-modal-score-card">
              <div className="demo-modal-score-main">
                <span className="demo-modal-score-label">Readiness Score</span>
                <div className="demo-modal-score-value">
                  {demoResult?.percentage || 0}<span>%</span>
                </div>
                <div className="demo-modal-score-points">
                  {demoResult?.total_score || 0} / {demoResult?.max_possible_score || 0} points
                </div>
              </div>
              
              {/* Skills Summary */}
              <div className="demo-modal-skills-summary">
                <div className="demo-modal-skill-stat demo-modal-skill-stat--met">
                  <span className="demo-modal-skill-stat-value">{demoResult?.skills_met || 0}</span>
                  <span className="demo-modal-skill-stat-label">Skills Met</span>
                </div>
                <div className="demo-modal-skill-stat demo-modal-skill-stat--missing">
                  <span className="demo-modal-skill-stat-value">{demoResult?.skills_missing || 0}</span>
                  <span className="demo-modal-skill-stat-label">Skills Missing</span>
                </div>
              </div>
            </div>

            {/* Skill Gap Breakdown */}
            {demoResult?.breakdown?.length > 0 && (
              <div className="demo-modal-section">
                <h4 className="demo-modal-section-title">
                  Skill Gap Breakdown
                </h4>
                <div className="demo-modal-breakdown-grid">
                  {demoResult.breakdown.map(item => (
                    <div
                      key={item.skill_id}
                      className={`demo-modal-breakdown-item ${
                        item.status === "met" ? "met" : "missing"
                      }`}
                    >
                      <span className="demo-modal-breakdown-skill">{item.skill_name}</span>
                      <span className={`demo-modal-breakdown-status ${
                        item.status === "met" ? "status-met" : "status-missing"
                      }`}>
                        {item.status === "met" ? "✅ Met" : "❌ Missing"}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* What to focus on next */}
            {demoResult?.missing_required_skills?.length > 0 && (
              <div className="demo-modal-focus-section">
                <h4 className="demo-modal-focus-title">
                  ⚠️ Missing Required Skills
                </h4>
                <div className="demo-modal-focus-list">
                  {demoResult.missing_required_skills.map(skill => (
                    <div key={skill} className="demo-modal-focus-item">
                      <span className="demo-modal-focus-icon">❗</span>
                      <span>{skill}</span>
                    </div>
                  ))}
                </div>
                <p className="demo-modal-focus-text">
                  Focus on these required skills to improve your readiness.
                </p>
              </div>
            )}
            
            {/* STEP 6: Sign up CTA */}
            <div className="demo-modal-signup-cta">
              <p className="demo-modal-signup-text">
                🚀 <strong>Want to track your real progress?</strong>
              </p>
              <p className="demo-modal-signup-subtext">
                Sign up to save your skills, track improvement over time, and get personalized recommendations.
              </p>
              <a href="/register" className="demo-modal-signup-button">
                Create Free Account
              </a>
            </div>

            <div className="demo-modal-actions">
              <button onClick={handleReset} className="demo-modal-secondary-button">
                Try Again
              </button>
              <button onClick={onClose} className="demo-modal-close-button">
                Close Demo
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemoModal;
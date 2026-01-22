import { useEffect, useState } from "react";

const API_BASE = "http://localhost:5000/api";
const DEMO_USER_ID = 25;

const DemoModal = ({ onClose }) => {
  const [categories, setCategories] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState("");
  const [skills, setSkills] = useState([]);
  const [selectedSkillIds, setSelectedSkillIds] = useState([]);

  const [loading, setLoading] = useState(false);
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(null);
  const [breakdown, setBreakdown] = useState([]);
  const [error, setError] = useState("");

  /* ---------------- Fetch categories ---------------- */
  useEffect(() => {
    fetch(`${API_BASE}/categories/get-categories`)
      .then(res => res.json())
      .then(data => setCategories(data.results))
      .catch(() => setError("Failed to load categories"));
  }, []);

  /* ---------------- Category change ---------------- */
  const handleCategoryChange = async (categoryId) => {
    setSelectedCategoryId(categoryId);
    setSelectedSkillIds([]);
    setSkills([]);
    setShowResult(false);

    if (!categoryId) return;

    try {
      const res = await fetch(
        `${API_BASE}/categories/get-skills-by-category/${categoryId}`
      );
      const data = await res.json();
      setSkills(data.results);
    } catch {
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

  /* ---------------- Analyze readiness ---------------- */
  const handleAnalyze = async () => {
    if (!selectedCategoryId || selectedSkillIds.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/readiness/calculate`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: DEMO_USER_ID,
          category_id: selectedCategoryId,
          selected_skill_ids: selectedSkillIds,
        }),
      });

      if (!res.ok) throw new Error();

      const data = await res.json();
      setScore(data.total_score);

      const breakdownRes = await fetch(
        `${API_BASE}/readiness/breakdown/${data.readiness_id}`
      );

      if (!breakdownRes.ok) throw new Error();

      const breakdownData = await breakdownRes.json();
      setBreakdown(breakdownData);

      setShowResult(true);
    } catch {
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
      <div className="demo-modal-container">
        <button onClick={onClose} className="demo-modal-close">✕</button>

        {!showResult ? (
          <>
            <h3 className="demo-modal-title">Quick Readiness Demo</h3>

            {/* Category */}
            <label className="demo-modal-label">Category</label>
            <select
              className="demo-modal-select"
              value={selectedCategoryId}
              onChange={(e) => handleCategoryChange(e.target.value)}
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                <option key={cat.category_id} value={cat.category_id}>
                  {cat.category_name}
                </option>
              ))}
            </select>

            {/* Skills */}
            {skills.length > 0 && (
              <>
                <label className="demo-modal-label mt-4">Skills You Have</label>
                <div className="demo-modal-skills-grid">
                  {skills.map(skill => (
                    <button
                      key={skill.skill_id}
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
              </>
            )}

            {error && <p className="demo-modal-error">{error}</p>}

            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className="demo-modal-primary-button"
            >
              {loading ? "Analyzing..." : "Analyze Readiness"}
            </button>
          </>
        ) : (
          <>
            <h3 className="demo-modal-title">Demo Result</h3>

            <p className="demo-modal-result-text">
              <strong>Readiness Score:</strong>{" "}
              <span className="demo-modal-result-score">
                {score} / 100
              </span>
            </p>

            <div className="demo-modal-breakdown">
              <h4 className="demo-modal-breakdown-title">
                Skill Gap Breakdown
              </h4>
              <ul className="demo-modal-breakdown-list">
                {breakdown.map(item => (
                  <li
                    key={item.skill}
                    className={`demo-modal-breakdown-item ${
                      item.status === "met" ? "met" : "missing"
                    }`}
                  >
                    <span>{item.skill}</span>
                    <span>{item.status === "met" ? "✓ Met" : "✕ Missing"}</span>
                  </li>
                ))}
              </ul>
            </div>

            <button onClick={onClose} className="demo-modal-secondary-button">
              Close Demo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DemoModal;

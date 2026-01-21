import { useState } from "react";

const roles = [
  "Web Developer Intern",
  "Backend Developer Intern",
  "Full Stack Developer (Entry)",
];

const skillsList = [
  "HTML",
  "CSS",
  "JavaScript",
  "React",
  "Node.js",
  "Git",
];

// Demo-only mapping
const ROLE_ID_MAP = {
  "Web Developer Intern": 1,
  "Backend Developer Intern": 2,
  "Full Stack Developer (Entry)": 3,
};

const DEMO_USER_ID = 25; // fixed demo user

const DemoModal = ({ onClose }) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(false);
  const [score, setScore] = useState(null);
  const [error, setError] = useState("");

  const toggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill)
        ? prev.filter((s) => s !== skill)
        : [...prev, skill]
    );
  };

  const handleAnalyze = async () => {
    if (!selectedRole || selectedSkills.length === 0) return;

    setLoading(true);
    setError("");

    try {
      const role_id = ROLE_ID_MAP[selectedRole];

      const response = await fetch(
        "http://localhost:5000/readiness/calculate",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            user_id: DEMO_USER_ID,
            role_id,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to calculate readiness");
      }

      const data = await response.json();

      setScore(data.total_score);
      setShowResult(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const isAnalyzeDisabled =
    !selectedRole || selectedSkills.length === 0 || loading;

  return (
    <div className="demo-modal-overlay">
      <div className="demo-modal-container">
        {/* Close Button */}
        <button onClick={onClose} className="demo-modal-close">
          ✕
        </button>

        {!showResult ? (
          <>
            <h3 className="demo-modal-title">Quick Readiness Demo</h3>

            {/* Role Selection */}
            <div>
              <label className="demo-modal-label">Target Role</label>
              <select
                className="demo-modal-select"
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="">Select a role</option>
                {roles.map((role) => (
                  <option key={role} value={role}>
                    {role}
                  </option>
                ))}
              </select>
            </div>

            {/* Skills Selection (UI only for demo trust) */}
            <div className="demo-modal-skills-container">
              <label className="demo-modal-label">Skills You Have</label>
              <div className="demo-modal-skills-grid">
                {skillsList.map((skill) => (
                  <button
                    key={skill}
                    type="button"
                    onClick={() => toggleSkill(skill)}
                    className={`demo-modal-skill-button ${
                      selectedSkills.includes(skill) ? "selected" : ""
                    }`}
                  >
                    {skill}
                  </button>
                ))}
              </div>
            </div>

            {error && <p className="demo-modal-error">{error}</p>}

            {/* Action Button */}
            <button
              onClick={handleAnalyze}
              disabled={isAnalyzeDisabled}
              className="demo-modal-primary-button"
              style={{
                opacity: isAnalyzeDisabled ? 0.5 : 1,
                cursor: isAnalyzeDisabled ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Analyzing..." : "Analyze Readiness"}
            </button>
          </>
        ) : (
          <>
            {/* Result View */}
            <h3 className="demo-modal-title">Demo Result</h3>

            <div className="demo-modal-result-container">
              <p className="demo-modal-result-text">
                <span className="demo-modal-result-label">Role:</span>{" "}
                {selectedRole}
              </p>
              <p className="demo-modal-result-text">
                <span className="demo-modal-result-label">
                  Readiness Score:
                </span>{" "}
                <span className="demo-modal-result-score">
                  {score} / 100
                </span>
              </p>
            </div>

            <p className="demo-modal-description">
              This score is calculated using real role benchmarks and skill
              comparisons.
            </p>

            <button
              onClick={onClose}
              className="demo-modal-secondary-button"
            >
              Close Demo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default DemoModal;

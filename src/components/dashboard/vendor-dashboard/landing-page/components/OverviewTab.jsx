import { useState, useEffect } from "react";
import ScoreCard from "./ScoreCard";
import StatsCards from "./StatsCards";
import ProgressAnalysis from "./ProgressAnalysis";
import { MdTimeline, MdAssignment } from "react-icons/md";

const API_BASE = "http://localhost:5000/api";

const OverviewTab = ({ latest, history, progress, loading, formatDate, categoryName, userId, categoryId }) => {
  const [comparisonData, setComparisonData] = useState(null);
  const [comparisonLoading, setComparisonLoading] = useState(false);

  // Fetch comparison data when latest changes
  useEffect(() => {
    if (!userId || !categoryId || !latest) return;

    const fetchComparisonData = async () => {
      setComparisonLoading(true);
      try {
        const res = await fetch(`${API_BASE}/readiness/compare/${userId}/${categoryId}`);
        if (res.ok) {
          const data = await res.json();
          setComparisonData(data);
        }
      } catch (err) {
        console.error("Error fetching comparison data:", err);
      } finally {
        setComparisonLoading(false);
      }
    };

    fetchComparisonData();
  }, [userId, categoryId, latest]);

  if (loading) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-gray-600 mt-3">Loading readiness data...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!latest) {
    return (
      <div className="row y-gap-30 mt-30">
        <div className="col-12">
          <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
            <div className="text-center py-40">
              <div className="text-gray-400 mb-3">
                <MdAssignment size={48} />
              </div>
              <h3 className="text-20 fw-600 text-gray-700 mb-2">No Readiness Data</h3>
              <p className="text-gray-500 mb-4">Take your first assessment to see your readiness score.</p>
              <p className="text-sm text-gray-400 mb-0">
                Once completed, you'll see your score, progress analysis, and recommendations here.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Check if we have enough data for comparison
  const canCompare = history.length >= 2;
  const isFirstAssessmentAfterSetup = history.length === 1;

  return (
    <>
      <div className="row y-gap-30 mt-30">
        {/* Main Score Card */}
        <div className="col-lg-8">
          <ScoreCard latest={latest} history={history} formatDate={formatDate} />
        </div>

        {/* Stats Cards */}
        <div className="col-lg-4">
          <StatsCards 
            latest={latest} 
            history={history} 
            progress={progress} 
            formatDate={formatDate} 
          />
        </div>
      </div>

      {/* Progress Analysis Section - UPDATED FOR PHASE 5 */}
      {!isFirstAssessmentAfterSetup ? (
        <div className="row y-gap-30 mt-30">
          <div className="col-12">
            <div className="rounded-4 bg-white shadow-sm border border-gray-100 p-30">
              <div className="d-flex align-items-center justify-content-between mb-24">
                <h2 className="text-20 fw-600 text-gray-900 mb-0">Progress Analysis</h2>
                <div className="d-flex align-items-center gap-2 text-14 text-gray-600">
                  Updated in real-time
                </div>
              </div>

              {comparisonLoading ? (
                <div className="text-center py-30">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p className="text-gray-600 mt-3">Analyzing skill progress...</p>
                </div>
              ) : comparisonData && comparisonData.can_compare ? (
                <div className="row">
                  {/* Improved Skills */}
                  {comparisonData.improved_skills.length > 0 && (
                    <div className="col-md-6 mb-20">
                      <div className="bg-success-50 rounded-3 p-24 h-100 border border-success-100">
                        <div className="d-flex align-items-center gap-3 mb-16">
                          <div className="bg-success p-8 rounded-circle">
                            <span className="text-white fw-bold">✓</span>
                          </div>
                          <div>
                            <h3 className="text-18 fw-600 text-success-800 mb-0">Improved Skills</h3>
                            <p className="text-13 text-success-600 mb-0">
                              Skills that changed from missing to met
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {comparisonData.improved_skills.map(skill => (
                            <span 
                              key={skill} 
                              className="badge bg-success text-white py-2 px-3 rounded-pill d-flex align-items-center gap-2"
                            >
                              ✓ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Focus Areas */}
                  {comparisonData.focus_areas.length > 0 && (
                    <div className="col-md-6 mb-20">
                      <div className="bg-warning-50 rounded-3 p-24 h-100 border border-warning-100">
                        <div className="d-flex align-items-center gap-3 mb-16">
                          <div className="bg-warning p-8 rounded-circle">
                            <span className="text-white fw-bold">!</span>
                          </div>
                          <div>
                            <h3 className="text-18 fw-600 text-warning-800 mb-0">Focus Areas</h3>
                            <p className="text-13 text-warning-600 mb-0">
                              Missing required skills (priority)
                            </p>
                          </div>
                        </div>
                        <div className="d-flex flex-wrap gap-2">
                          {comparisonData.focus_areas.map(skill => (
                            <span 
                              key={skill} 
                              className="badge bg-warning text-dark py-2 px-3 rounded-pill d-flex align-items-center gap-2"
                            >
                              ⚠ {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* No Changes Section */}
                  {comparisonData.improved_skills.length === 0 && comparisonData.focus_areas.length === 0 && (
                    <div className="col-12">
                      <div className="text-center py-20">
                        <div className="text-gray-400 mb-3">
                          <MdTimeline size={48} />
                        </div>
                        <h3 className="text-18 fw-600 text-gray-700 mb-2">No Skill Changes Detected</h3>
                        <p className="text-gray-500">
                          Your skill profile has remained stable since the last assessment.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-center py-30">
                  <div className="text-gray-400 mb-3">
                    <MdTimeline size={48} />
                  </div>
                  <h3 className="text-18 fw-600 text-gray-700 mb-2">
                    {!canCompare ? "Complete Another Assessment" : "No Comparison Data"}
                  </h3>
                  <p className="text-gray-500">
                    {!canCompare 
                      ? "Complete a second assessment to see skill progress comparison."
                      : "Skill comparison data is not available at this time."}
                  </p>
                </div>
              )}

              {/* Recommendations */}
              <div className="mt-30 pt-24 border-top">
                <h3 className="text-18 fw-600 text-gray-900 mb-16">Recommendations</h3>
                <div className="row">
                  <div className="col-md-4">
                    <div className="bg-light-blue-50 p-20 rounded-3 h-100">
                      <div className="text-primary mb-2">
                        <span className="fw-bold">📊</span>
                      </div>
                      <h4 className="text-16 fw-600 text-gray-900 mb-2">Regular Assessment</h4>
                      <p className="text-13 text-gray-600">
                        Update skills weekly to track accurate progress
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light-green-50 p-20 rounded-3 h-100">
                      <div className="text-success mb-2">
                        <span className="fw-bold">🎯</span>
                      </div>
                      <h4 className="text-16 fw-600 text-gray-900 mb-2">Focus on Priority Areas</h4>
                      <p className="text-13 text-gray-600">
                        Prioritize required skills marked as "Focus Areas"
                      </p>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="bg-light-purple-50 p-20 rounded-3 h-100">
                      <div className="text-purple mb-2">
                        <span className="fw-bold">📈</span>
                      </div>
                      <h4 className="text-16 fw-600 text-gray-900 mb-2">Track Improvements</h4>
                      <p className="text-13 text-gray-600">
                        Monitor "Improved Skills" to see your growth
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Summary */}
              {comparisonData && comparisonData.can_compare && (
                <div className="mt-20 pt-20 border-top">
                  <h4 className="text-16 fw-600 text-gray-900 mb-16 text-center">Current Assessment Summary</h4>
                  <div className="row text-center">
                    <div className="col-md-3">
                      <div className="text-20 fw-700 text-primary">
                        {comparisonData.breakdown_summary.total_skills}
                      </div>
                      <div className="text-12 text-gray-600">Total Skills</div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-20 fw-700 text-success">
                        {comparisonData.breakdown_summary.met_skills}
                      </div>
                      <div className="text-12 text-gray-600">Met Skills</div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-20 fw-700 text-warning">
                        {comparisonData.breakdown_summary.required_missing}
                      </div>
                      <div className="text-12 text-gray-600">Focus Areas</div>
                    </div>
                    <div className="col-md-3">
                      <div className="text-20 fw-700 text-info">
                        {comparisonData.improved_skills.length}
                      </div>
                      <div className="text-12 text-gray-600">Improved</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* First Assessment Completed Section */
        <div className="row y-gap-30 mt-30">
          <div className="col-12">
            <div className="rounded-4 bg-light-blue-50 border border-primary-100 p-30">
              <div className="text-center">
                <div className="text-primary mb-3">
                  <MdTimeline size={48} />
                </div>
                <h3 className="text-20 fw-600 text-gray-900 mb-3">First Assessment Complete!</h3>
                <p className="text-gray-600 mb-4">
                  Great! You've completed your first readiness assessment for {categoryName}.
                  Your baseline score has been recorded.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <div className="text-center">
                    <div className="text-24 fw-700 text-primary">{latest.total_score}</div>
                    <div className="text-12 text-gray-500">Baseline Score</div>
                  </div>
                  <div className="text-center">
                    <div className="text-24 fw-700 text-success">{formatDate(latest.calculated_at)}</div>
                    <div className="text-12 text-gray-500">Assessment Date</div>
                  </div>
                </div>
                <p className="text-sm text-gray-500 mt-4 mb-0">
                  Complete another assessment to see progress comparison and skill improvements.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default OverviewTab;
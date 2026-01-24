import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '@/components/header/default-header';
import Footer4 from '@/components/footer/footer-4';

const ReadinessPage = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [readinessData, setReadinessData] = useState(null);
  const [calculationTriggered, setCalculationTriggered] = useState(false);
  const [cooldownInfo, setCooldownInfo] = useState(null);
  const [categoryId, setCategoryId] = useState(null);
  const [isLoadingCategory, setIsLoadingCategory] = useState(true);
  const [calculationResult, setCalculationResult] = useState(null);
  const [skillBreakdown, setSkillBreakdown] = useState([]);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;
  const userRole = user?.role || 'user';
  const API_BASE = "http://localhost:5000/api";
  
  // Step 1: Fetch user's target category from profile info
  useEffect(() => {
    const fetchUserCategory = async () => {
      if (!user_id) {
        setIsLoadingCategory(false);
        return;
      }
      
      try {
        const response = await fetch(
          `${API_BASE}/profile/get-profile-info/${user_id}?role=${userRole}`
        );
        
        if (response.ok) {
          const profileData = await response.json();
          const targetCategoryId = profileData.target_category_id;
          
          if (targetCategoryId) {
            setCategoryId(targetCategoryId);
            localStorage.setItem("selectedCategoryId", targetCategoryId);
          } else {
            setCategoryId(null);
          }
        } else {
          setCategoryId(null);
        }
      } catch (error) {
        console.error('Error fetching profile info:', error);
        setCategoryId(null);
      } finally {
        setIsLoadingCategory(false);
      }
    };
    
    fetchUserCategory();
  }, [user_id, userRole]);
  
  // Fetch breakdown when readiness data changes
  useEffect(() => {
    const fetchBreakdown = async () => {
      if (!calculationResult?.readiness_id) return;
      
      setIsLoadingBreakdown(true);
      try {
        const response = await fetch(
          `${API_BASE}/readiness/breakdown/${calculationResult.readiness_id}`
        );
        
        if (response.ok) {
          const breakdownData = await response.json();
          setSkillBreakdown(breakdownData);
        }
      } catch (error) {
        console.error('Error fetching breakdown:', error);
      } finally {
        setIsLoadingBreakdown(false);
      }
    };
    
    fetchBreakdown();
  }, [calculationResult]);
  
  // Step 2: Explicit calculation handler
  const handleCalculateReadiness = async () => {
    if (!user_id || !categoryId) {
      alert("Please select a role/category first.");
      navigate('/vendor-dashboard/dashboard');
      return;
    }
    
    setIsLoading(true);
    setCalculationTriggered(true);
    setCooldownInfo(null);
    setCalculationResult(null);
    setSkillBreakdown([]);
    
    try {
      // Using the original endpoint as per your response
      const response = await fetch(`${API_BASE}/readiness/explicit-calculate`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id,
          category_id: categoryId,
          trigger_source: 'user_explicit'
        }),
      });
      
      const result = await response.json();
      
      if (response.status === 429) {
        setCooldownInfo({
          message: result.message,
          nextAvailable: result.nextAvailable
        });
        return;
      }
      
      if (!response.ok) {
        throw new Error(result.message || 'Calculation failed');
      }
      
      // Store the calculation result
      setCalculationResult(result);
      
      // Also update readiness data for consistency
      setReadinessData({
        readiness_id: result.readiness_id,
        total_score: result.total_score,
        calculated_at: result.calculated_at
      });
      
    } catch (error) {
      console.error('Calculation failed:', error);
      alert(`Error: ${error.message}. Please try again.`);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Loading state while fetching category
  if (isLoadingCategory) {
    return (
      <>
        <DefaultHeader/>
        <div className="readiness-page">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>Loading your readiness information...</p>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }
  
  // Check if user has a target category selected
  if (!categoryId) {
    return (
      <>
        <DefaultHeader/>
        <div className="readiness-page">
          <h1>🎯 Readiness Score</h1>
          <div className="no-category-selected">
            <div className="warning-icon">⚠️</div>
            <h3>No Target Role Selected</h3>
            <p>You haven't set a target role/category in your profile yet.</p>
            <p>Please complete your profile and select a target role first.</p>
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/vendor-dashboard/edit-profile')}
                className="primary-btn"
              >
                Go to Profile Settings
              </button>
              <button 
                onClick={() => navigate('/vendor-dashboard/dashboard')}
                className="secondary-btn"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }
  
  return (
    <>
      <DefaultHeader/>
      <div className="readiness-page">
        <div className="page-header">
          <h1>🎯 Readiness Score</h1>
          <div className="category-badge">
            Target Role ID: <span className="category-name">{categoryId}</span>
          </div>
          <p className="subtitle">
            Your explicit readiness evaluation. Calculation happens only when you click the button below.
          </p>
        </div>
        
        {/* Explicit Calculation Section */}
        <div className="calculation-card">
          <h2>Calculate Readiness</h2>
          <p className="calculation-description">
            This will evaluate your current skills against the benchmark for target role ID: {categoryId}.
            You can calculate once every 24 hours.
          </p>
          
          <button 
            onClick={handleCalculateReadiness}
            disabled={isLoading}
            className={`calculate-btn ${isLoading ? 'loading' : 'primary'}`}
          >
            {isLoading ? (
              <>
                <span className="spinner"></span>
                Calculating...
              </>
            ) : (
              'Calculate My Readiness'
            )}
          </button>
          
          {cooldownInfo && (
            <div className="cooldown-message">
              ⏰ {cooldownInfo.message}
            </div>
          )}
        </div>
        
        {/* Calculation Results */}
        {calculationResult && (
          <div className="results-section">
            <div className="results-header">
              <h2>✅ Readiness Calculated Successfully!</h2>
              <span className="calculation-time">
                Calculated: {formatDate(calculationResult.calculated_at)}
              </span>
            </div>
            
            {/* Score Card */}
            <div className="score-card">
              <div className="score-main">
                <div className="score-circle">
                  <div className="score-value">{calculationResult.total_score}</div>
                  <div className="score-label">Total Score</div>
                </div>
                <div className="score-details">
                  <div className="score-percentage">
                    <span className="percentage-value">{calculationResult.percentage}%</span>
                    <span className="percentage-label">of max possible</span>
                  </div>
                  <div className="max-score">
                    Max Possible: {calculationResult.skill_stats?.total_benchmark_skills ? calculationResult.skill_stats.total_benchmark_skills * 10 : 0}
                  </div>
                </div>
              </div>
              
              {/* Skill Stats */}
              <div className="skill-stats">
                <div className="stat-item">
                  <div className="stat-value">{calculationResult.skill_stats?.total_benchmark_skills || 0}</div>
                  <div className="stat-label">Benchmark Skills</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value success">{calculationResult.skill_stats?.skills_met || 0}</div>
                  <div className="stat-label">Skills You Have</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">
                    {calculationResult.skill_stats?.self_skills_count || 0}
                  </div>
                  <div className="stat-label">Self-Added Skills</div>
                </div>
                <div className="stat-item">
                  <div className="stat-value">{calculationResult.readiness_id}</div>
                  <div className="stat-label">Calculation #</div>
                </div>
              </div>
            </div>
            
            {/* Skill Breakdown */}
            {isLoadingBreakdown ? (
              <div className="breakdown-loading">
                <div className="small-spinner"></div>
                Loading skill breakdown...
              </div>
            ) : skillBreakdown.length > 0 ? (
              <div className="breakdown-section">
                <h3>Skill Breakdown</h3>
                <div className="breakdown-table">
                  <table>
                    <thead>
                      <tr>
                        <th>Skill</th>
                        <th>Status</th>
                        <th>Weight</th>
                        <th>Achieved</th>
                      </tr>
                    </thead>
                    <tbody>
                      {skillBreakdown.map((skill, index) => (
                        <tr key={index} className={skill.status}>
                          <td className="skill-name">Skill ID: {skill.skill_id}</td>
                          <td>
                            <span className={`status-badge ${skill.status}`}>
                              {skill.status === 'met' ? '✅ Met' : '❌ Missing'}
                            </span>
                          </td>
                          <td>{skill.required_weight}</td>
                          <td>{skill.achieved_weight}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="no-breakdown">
                <p>No skill breakdown available. The breakdown endpoint might not be implemented yet.</p>
              </div>
            )}
            
            {/* Cooldown Information */}
            <div className="cooldown-info">
              <h4>⏰ Next Calculation Available</h4>
              <p>{formatDate(calculationResult.cooldown?.next_calculation)}</p>
              <small>You can recalculate your readiness after 24 hours.</small>
            </div>
            
            {/* Action Buttons */}
            <div className="action-buttons">
              <button 
                onClick={() => navigate('/vendor-dashboard/dashboard')}
                className="secondary-btn"
              >
                View Dashboard
              </button>
              <button 
                onClick={() => navigate('/readiness/history')}
                className="secondary-btn"
              >
                View History
              </button>
              <button 
                onClick={() => window.location.reload()}
                className="primary-btn"
              >
                Calculate Again
              </button>
            </div>
          </div>
        )}
        
        {/* First-time user guidance */}
        {!calculationTriggered && !calculationResult && (
          <div className="first-time-guidance">
            <h3>How it works:</h3>
            <ol>
              <li>Click "Calculate My Readiness" above</li>
              <li>System evaluates your skills against role benchmarks</li>
              <li>Get your readiness score and breakdown</li>
              <li>Recalculate every 24 hours to track progress</li>
            </ol>
          </div>
        )}
      </div>
      <Footer4 />
    </>
  );
};

export default ReadinessPage;
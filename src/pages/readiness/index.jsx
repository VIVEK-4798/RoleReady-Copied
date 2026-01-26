import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import DefaultHeader from '@/components/header/default-header';
import Footer4 from '@/components/footer/footer-4';

/* ============================================================================
   📋 READINESS PAGE - STEP 6: LOGIN-ONLY, PROFILE-DRIVEN
   ============================================================================
   
   This page has 3 logical sections (in order):
   - Section A: Context (what is being evaluated)
   - Section B: Current Readiness Score
   - Section C: Skill Breakdown
   
   STEP 6 REQUIREMENTS:
   ✅ Login required - redirects to /login if not authenticated
   ✅ Profile-driven - uses target_category_id from DB profile
   ✅ NO demo mode - demo is only on landing page
   ✅ All inputs from DB (locked contract from STEP 2)
   ============================================================================ */

const ReadinessPage = () => {
  const navigate = useNavigate();
  
  // ========== STATE ==========
  // Context state (Section A)
  const [context, setContext] = useState(null);
  const [isLoadingContext, setIsLoadingContext] = useState(true);
  const [contextError, setContextError] = useState(null);
  
  // Latest readiness state (Section B - loaded on mount)
  const [latestReadiness, setLatestReadiness] = useState(null);
  const [isLoadingLatest, setIsLoadingLatest] = useState(true);
  
  // Calculation state (Section B - after recalculate)
  const [isCalculating, setIsCalculating] = useState(false);
  const [calculationResult, setCalculationResult] = useState(null);
  
  // Breakdown state (Section C - future)
  const [skillBreakdown, setSkillBreakdown] = useState([]);
  const [isLoadingBreakdown, setIsLoadingBreakdown] = useState(false);
  
  // User info - STEP 6: Strict login check
  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;
  const API_BASE = "http://localhost:5000/api";
  
  /* ========================================================================
     STEP 6: Redirect to login if not authenticated
     ======================================================================== */
  useEffect(() => {
    if (!user_id) {
      // Store intended destination for post-login redirect
      sessionStorage.setItem("redirectAfterLogin", "/readiness");
      navigate("/login");
    }
  }, [user_id, navigate]);
  
  /* ========================================================================
     HELPER: Get readiness status label based on percentage
     ======================================================================== 
     
     WHY: Users need a clear, human-readable status, not just a number.
     
     Status thresholds:
     - 0-39%: Not Ready (red)
     - 40-69%: Partially Ready (yellow)  
     - 70-100%: Ready (green)
  */
  const getReadinessStatus = (percentage) => {
    if (percentage >= 70) {
      return { label: "Ready", color: "success", icon: "✅" };
    } else if (percentage >= 40) {
      return { label: "Partially Ready", color: "warning", icon: "⚠️" };
    } else {
      return { label: "Not Ready", color: "danger", icon: "❌" };
    }
  };
  
  /* ========================================================================
     STEP 3.3: Fetch Context Data on Mount
     ======================================================================== 
     
     WHY: Before showing any score, user must understand:
     - What role is being targeted
     - What inputs are being used
     - How fresh the result is
     
     This builds TRUST and avoids confusion.
  */
  useEffect(() => {
    const fetchContext = async () => {
      if (!user_id) {
        setIsLoadingContext(false);
        setContextError("Please log in to view your readiness.");
        return;
      }
      
      try {
        const response = await fetch(`${API_BASE}/readiness/context/${user_id}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || "Failed to fetch context");
        }
        
        setContext(data);
      } catch (error) {
        console.error("[ReadinessPage] Error fetching context:", error);
        setContextError(error.message);
      } finally {
        setIsLoadingContext(false);
      }
    };
    
    fetchContext();
  }, [user_id]);
  
  /* ========================================================================
     SECTION B: Fetch Latest Readiness on Mount
     ======================================================================== 
     
     WHY: Returning users should see their last score immediately without
     having to recalculate. This provides instant feedback.
     
     - Fetches latest readiness_scores record for user + category
     - Also fetches breakdown for that record
     - Only runs after context is loaded (need category_id)
  */
  useEffect(() => {
    const fetchLatestReadiness = async () => {
      if (!user_id || !context?.role?.category_id) {
        setIsLoadingLatest(false);
        return;
      }
      
      try {
        // Fetch latest readiness score
        const response = await fetch(
          `${API_BASE}/readiness/latest/${user_id}/${context.role.category_id}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setLatestReadiness(data);
          
          // Also fetch breakdown for the latest readiness
          if (data.readiness_id) {
            const breakdownResponse = await fetch(
              `${API_BASE}/readiness/breakdown/${data.readiness_id}`
            );
            if (breakdownResponse.ok) {
              const breakdownData = await breakdownResponse.json();
              setSkillBreakdown(breakdownData);
            }
          }
        } else if (response.status === 404) {
          // No readiness calculated yet - this is expected for new users
          setLatestReadiness(null);
        }
      } catch (error) {
        console.error("[ReadinessPage] Error fetching latest readiness:", error);
        // Don't set error - just means no previous calculation
      } finally {
        setIsLoadingLatest(false);
      }
    };
    
    // Only fetch after context is loaded
    if (context?.has_target_role) {
      fetchLatestReadiness();
    } else {
      setIsLoadingLatest(false);
    }
  }, [user_id, context]);
  
  /* ========================================================================
     SECTION B: Calculate Readiness Handler (uses locked endpoint)
     ======================================================================== 
     
     🛡️ STEP 4 RESPONSES HANDLED:
     - 429 COOLDOWN_ACTIVE: User must wait before recalculating
     - 200 NO_CHANGES_DETECTED: Skills haven't changed, no recalculation needed
     - 201 Success: New calculation performed
  */
  const handleCalculateReadiness = async (forceRecalculate = false) => {
    if (!user_id) {
      alert("Please log in first.");
      return;
    }
    
    setIsCalculating(true);
    setCalculationResult(null);
    
    try {
      // 🔒 LOCKED: Only send user_id, category comes from DB
      // force=true bypasses cooldown and change detection (use sparingly)
      const response = await fetch(`${API_BASE}/readiness/explicit-calculate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          user_id,
          force: forceRecalculate,
        }),
      });
      
      const result = await response.json();
      
      /* ======================================================
         🛡️ STEP 4: Handle cooldown response (429)
         ====================================================== */
      if (response.status === 429 && result.error === "COOLDOWN_ACTIVE") {
        setCalculationResult({
          ...result,
          _type: "cooldown",
        });
        return;
      }
      
      /* ======================================================
         🛡️ STEP 4: Handle no changes response (200)
         ====================================================== */
      if (result.recalculated === false && result.error === "NO_CHANGES_DETECTED") {
        setCalculationResult({
          ...result,
          _type: "no_changes",
        });
        return;
      }
      
      /* ======================================================
         🛡️ STEP 7: Handle edge case errors
         ====================================================== */
      if (result.error === "NO_USER_SKILLS") {
        setCalculationResult({
          ...result,
          _type: "edge_case",
          edge_case: "NO_USER_SKILLS",
        });
        // Refresh context to update edge case state
        const contextResponse = await fetch(`${API_BASE}/readiness/context/${user_id}`);
        const contextData = await contextResponse.json();
        if (contextResponse.ok) {
          setContext(contextData);
        }
        return;
      }
      
      if (result.error === "NO_BENCHMARK_SKILLS") {
        setCalculationResult({
          ...result,
          _type: "edge_case",
          edge_case: "NO_BENCHMARK_SKILLS",
        });
        return;
      }
      
      /* ======================================================
         Handle actual errors
         ====================================================== */
      if (!response.ok) {
        throw new Error(result.message || 'Calculation failed');
      }
      
      /* ======================================================
         ✅ Successful calculation
         ====================================================== */
      setCalculationResult({
        ...result,
        _type: "success",
      });
      
      // Refresh context to get updated last_calculated_at
      const contextResponse = await fetch(`${API_BASE}/readiness/context/${user_id}`);
      const contextData = await contextResponse.json();
      if (contextResponse.ok) {
        setContext(contextData);
      }
      
    } catch (error) {
      console.error('[ReadinessPage] Calculation failed:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setIsCalculating(false);
    }
  };
  
  /* ========================================================================
     SECTION C: Fetch Breakdown after Calculation
     ======================================================================== */
  useEffect(() => {
    const fetchBreakdown = async () => {
      if (!calculationResult?.readiness_id) return;
      
      setIsLoadingBreakdown(true);
      try {
        const response = await fetch(
          `${API_BASE}/readiness/breakdown/${calculationResult.readiness_id}`
        );
        
        if (response.ok) {
          const data = await response.json();
          setSkillBreakdown(data);
        }
      } catch (error) {
        console.error('[ReadinessPage] Error fetching breakdown:', error);
      } finally {
        setIsLoadingBreakdown(false);
      }
    };
    
    fetchBreakdown();
  }, [calculationResult]);
  
  /* ========================================================================
     HELPER: Format date for display
     ======================================================================== */
  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };
  
  /* ========================================================================
     RENDER: Loading State
     ======================================================================== */
  if (isLoadingContext) {
    return (
      <>
        <DefaultHeader />
        <div className="readiness-page">
          <div className="readiness-page__container">
            <div className="readiness-loading">
              <div className="readiness-loading__spinner"></div>
              <p className="readiness-loading__text">Loading your readiness information...</p>
            </div>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }
  
  /* ========================================================================
     RENDER: Error State
     ======================================================================== */
  if (contextError) {
    return (
      <>
        <DefaultHeader />
        <div className="readiness-page">
          <div className="readiness-page__container">
            <div className="readiness-error">
              <div className="readiness-error__icon">⚠️</div>
              <h2 className="readiness-error__title">Unable to Load Readiness</h2>
              <p className="readiness-error__message">{contextError}</p>
              <button 
                onClick={() => window.location.reload()}
                className="readiness-btn readiness-btn--primary"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }
  
  /* ========================================================================
     STEP 3.4: EDGE CASE 1 - No Target Role Selected
     ======================================================================== 
     
     WHY: User must select a target role before we can evaluate anything.
     This is a BLOCKING state - no calculation possible.
  */
  if (!context?.has_target_role || context?.edge_case === "NO_TARGET_ROLE") {
    return (
      <>
        <DefaultHeader />
        <div className="readiness-page">
          <div className="readiness-page__container">
            <div className="readiness-page__header">
              <h1 className="readiness-page__title">
                <span className="readiness-page__title-icon">🎯</span>
                Readiness Evaluation
              </h1>
            </div>
            
            <div className="readiness-no-role">
              <div className="readiness-no-role__icon">📋</div>
              <h2 className="readiness-no-role__title">No Target Role Selected</h2>
              <p className="readiness-no-role__description">
                {context?.edge_case_message || "Please select a target role in your profile before calculating readiness."}
                <br />
                Your readiness score is evaluated against the skills required for your target role.
              </p>
              <div className="readiness-no-role__actions">
                <button 
                  onClick={() => navigate(context?.action_url || '/vendor-dashboard/profile')}
                  className="readiness-btn readiness-btn--primary"
                >
                  Go to Profile Settings
                </button>
                <button 
                  onClick={() => navigate('/vendor-dashboard/dashboard')}
                  className="readiness-btn readiness-btn--secondary"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }

  /* ========================================================================
     🛡️ STEP 7: EDGE CASE 2 - No Benchmark Skills (Admin Error)
     ======================================================================== 
     
     WHY: If the target role has no benchmark skills configured, this is
     a system configuration issue that the user cannot fix themselves.
     Clear messaging prevents confusion.
  */
  if (context?.edge_case === "NO_BENCHMARK_SKILLS") {
    return (
      <>
        <DefaultHeader />
        <div className="readiness-page">
          <div className="readiness-page__container">
            <div className="readiness-page__header">
              <h1 className="readiness-page__title">
                <span className="readiness-page__title-icon">🎯</span>
                Readiness Evaluation
              </h1>
            </div>
            
            <div className="readiness-edge-case readiness-edge-case--admin-error">
              <div className="readiness-edge-case__icon">⚙️</div>
              <h2 className="readiness-edge-case__title">Role Configuration Incomplete</h2>
              <p className="readiness-edge-case__description">
                {context.edge_case_message}
              </p>
              <div className="readiness-edge-case__details">
                <p><strong>Target Role:</strong> {context.role?.name || "Unknown"}</p>
                <p><strong>Issue:</strong> No benchmark skills have been configured for this role.</p>
                <p><strong>Action Required:</strong> Please contact the administrator to set up the skill benchmarks for this role.</p>
              </div>
              <div className="readiness-edge-case__actions">
                <button 
                  onClick={() => navigate('/vendor-dashboard/dashboard')}
                  className="readiness-btn readiness-btn--primary"
                >
                  Back to Dashboard
                </button>
                <button 
                  onClick={() => navigate('/vendor-dashboard/profile')}
                  className="readiness-btn readiness-btn--secondary"
                >
                  Change Target Role
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }

  /* ========================================================================
     🛡️ STEP 7: EDGE CASE 3 - User Has No Skills
     ======================================================================== 
     
     WHY: User needs to add skills before any calculation is meaningful.
     Unlike "No Target Role", this is GUIDANCE not BLOCKING - user should
     see the context but know they need to add skills first.
  */
  if (context?.edge_case === "NO_USER_SKILLS") {
    return (
      <>
        <DefaultHeader />
        <div className="readiness-page">
          <div className="readiness-page__container">
            <div className="readiness-page__header">
              <h1 className="readiness-page__title">
                <span className="readiness-page__title-icon">🎯</span>
                Readiness Evaluation
              </h1>
              <p className="readiness-page__subtitle">
                Evaluate your skills against industry benchmarks for your target role
              </p>
            </div>
            
            {/* Context section - still show this so user understands what's needed */}
            <section className="readiness-section readiness-context">
              <div className="readiness-section__header">
                <h2 className="readiness-section__title">
                  <span className="readiness-section__icon">📋</span>
                  Evaluation Context
                </h2>
              </div>
              
              <div className="readiness-context__grid">
                <div className="readiness-context__card readiness-context__card--role">
                  <div className="readiness-context__card-icon">🎯</div>
                  <div className="readiness-context__card-content">
                    <span className="readiness-context__card-label">Target Role</span>
                    <span className="readiness-context__card-value">
                      {context.role?.name || "Unknown"}
                    </span>
                  </div>
                </div>
                
                <div className="readiness-context__card readiness-context__card--required">
                  <div className="readiness-context__card-icon">⭐</div>
                  <div className="readiness-context__card-content">
                    <span className="readiness-context__card-label">Required Skills</span>
                    <span className="readiness-context__card-value">
                      {context.required_skills_count}
                      <span className="readiness-context__card-subtext">
                        of {context.total_benchmark_skills_count} total
                      </span>
                    </span>
                  </div>
                </div>
              </div>
            </section>
            
            {/* No skills guidance section */}
            <section className="readiness-section">
              <div className="readiness-edge-case readiness-edge-case--no-skills">
                <div className="readiness-edge-case__icon">📝</div>
                <h2 className="readiness-edge-case__title">Add Your Skills to Get Started</h2>
                <p className="readiness-edge-case__description">
                  {context.edge_case_message}
                </p>
                <div className="readiness-edge-case__guidance">
                  <h3>How to add your skills:</h3>
                  <ol>
                    <li><strong>Self-Add:</strong> Manually select skills you possess from the skill library</li>
                    <li><strong>Resume Upload:</strong> Upload your resume and we'll extract skills automatically</li>
                    <li><strong>Get Validated:</strong> Complete assessments to validate your skills</li>
                  </ol>
                </div>
                <div className="readiness-edge-case__actions">
                  <button 
                    onClick={() => navigate(context?.action_url || '/vendor-dashboard/profile')}
                    className="readiness-btn readiness-btn--primary"
                  >
                    <span>📝</span> Add Your Skills
                  </button>
                  <button 
                    onClick={() => navigate('/vendor-dashboard/dashboard')}
                    className="readiness-btn readiness-btn--secondary"
                  >
                    Back to Dashboard
                  </button>
                </div>
              </div>
            </section>
          </div>
        </div>
        <Footer4 />
      </>
    );
  }
  
  /* ========================================================================
     MAIN RENDER: Full Page with Sections A, B, C
     ======================================================================== */
  return (
    <>
      <DefaultHeader />
      <div className="readiness-page">
        <div className="readiness-page__container">
          
          {/* ============================================================
              PAGE HEADER
              ============================================================ */}
          <div className="readiness-page__header">
            <h1 className="readiness-page__title">
              <span className="readiness-page__title-icon">🎯</span>
              Readiness Evaluation
            </h1>
            <p className="readiness-page__subtitle">
              Evaluate your skills against industry benchmarks for your target role
            </p>
          </div>
          
          {/* ============================================================
              SECTION A: CONTEXT (STEP 3 - What is being evaluated)
              ============================================================ 
              
              PURPOSE: Build trust before showing any score.
              - Shows what role is being targeted
              - Shows how many skills are being measured
              - Shows when last calculation was done
              
              NO SCORE HERE - just context information.
          */}
          <section className="readiness-section readiness-context">
            <div className="readiness-section__header">
              <h2 className="readiness-section__title">
                <span className="readiness-section__icon">📋</span>
                Evaluation Context
              </h2>
              <p className="readiness-section__description">
                What's being evaluated in your readiness calculation
              </p>
            </div>
            
            <div className="readiness-context__grid">
              {/* Target Role Card */}
              <div className="readiness-context__card readiness-context__card--role">
                <div className="readiness-context__card-icon">🎯</div>
                <div className="readiness-context__card-content">
                  <span className="readiness-context__card-label">Target Role</span>
                  <span className="readiness-context__card-value">
                    {context.role?.name || "Unknown"}
                  </span>
                </div>
              </div>
              
              {/* Required Skills Card */}
              <div className="readiness-context__card readiness-context__card--required">
                <div className="readiness-context__card-icon">⭐</div>
                <div className="readiness-context__card-content">
                  <span className="readiness-context__card-label">Required Skills</span>
                  <span className="readiness-context__card-value">
                    {context.required_skills_count}
                    <span className="readiness-context__card-subtext">
                      of {context.total_benchmark_skills_count} total
                    </span>
                  </span>
                </div>
              </div>
              
              {/* Your Skills Card */}
              <div className="readiness-context__card readiness-context__card--user">
                <div className="readiness-context__card-icon">✅</div>
                <div className="readiness-context__card-content">
                  <span className="readiness-context__card-label">Your Skills Considered</span>
                  <span className="readiness-context__card-value">
                    {context.user_skills_count}
                    {context.user_skills_count === 0 && (
                      <span className="readiness-context__card-warning">
                        No skills added yet
                      </span>
                    )}
                  </span>
                  {/* Skills by source breakdown */}
                  {context.user_skills_count > 0 && (
                    <div className="readiness-context__skills-sources">
                      {context.user_skills_by_source?.self > 0 && (
                        <span className="readiness-context__source-badge readiness-context__source-badge--self">
                          {context.user_skills_by_source.self} self-added
                        </span>
                      )}
                      {context.user_skills_by_source?.resume > 0 && (
                        <span className="readiness-context__source-badge readiness-context__source-badge--resume">
                          {context.user_skills_by_source.resume} from resume
                        </span>
                      )}
                      {context.user_skills_by_source?.validated > 0 && (
                        <span className="readiness-context__source-badge readiness-context__source-badge--validated">
                          {context.user_skills_by_source.validated} validated
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Last Calculated Card */}
              <div className="readiness-context__card readiness-context__card--date">
                <div className="readiness-context__card-icon">📅</div>
                <div className="readiness-context__card-content">
                  <span className="readiness-context__card-label">Last Calculated</span>
                  <span className="readiness-context__card-value">
                    {context.last_calculated_at 
                      ? formatDate(context.last_calculated_at)
                      : <span className="readiness-context__card-empty">Not calculated yet</span>
                    }
                  </span>
                </div>
              </div>
            </div>
            
            {/* First-time user message (STEP 3.4 - Edge Case 2) */}
            {!context.last_calculated_at && (
              <div className="readiness-context__first-time">
                <div className="readiness-context__first-time-icon">💡</div>
                <p className="readiness-context__first-time-text">
                  <strong>First time here?</strong> Click "Calculate Readiness" below to get your 
                  first readiness score. The calculation will evaluate your skills against 
                  the {context.total_benchmark_skills_count} benchmark skills for {context.role?.name}.
                </p>
              </div>
            )}
          </section>
          
          {/* ============================================================
              SECTION B: READINESS EVALUATION (CORE)
              ============================================================ 
              
              On page load:
              - Shows latest readiness if exists
              - Shows status label (Not Ready / Partially Ready / Ready)
              
              Primary action: Recalculate Readiness button
          */}
          <section className="readiness-section readiness-evaluate">
            <div className="readiness-section__header">
              <h2 className="readiness-section__title">
                <span className="readiness-section__icon">📊</span>
                Readiness Score
              </h2>
              <p className="readiness-section__description">
                Your current readiness evaluation for {context.role?.name}
              </p>
            </div>
            
            {/* Loading state for latest readiness */}
            {isLoadingLatest ? (
              <div className="readiness-evaluate__loading">
                <div className="readiness-loading__spinner readiness-loading__spinner--small"></div>
                <p>Loading your readiness score...</p>
              </div>
            ) : (
              <>
                {/* Current score display - from latest OR calculation result */}
                {(() => {
                  // Use calculation result if available, otherwise use latest from DB
                  const currentScore = calculationResult || latestReadiness;
                  const hasScore = currentScore && currentScore.percentage !== undefined;
                  
                  if (!hasScore) {
                    // No previous calculation - show first-time UI
                    return (
                      <div className="readiness-evaluate__first-time">
                        <div className="readiness-evaluate__no-score">
                          <div className="readiness-evaluate__no-score-icon">📊</div>
                          <h3 className="readiness-evaluate__no-score-title">No Readiness Score Yet</h3>
                          <p className="readiness-evaluate__no-score-text">
                            Calculate your readiness to see how prepared you are for 
                            <strong> {context.role?.name}</strong>.
                            {context.user_skills_count === 0 && (
                              <span className="readiness-evaluate__warning">
                                <br />⚠️ You haven't added any skills yet. Your score will be 0%.
                              </span>
                            )}
                          </p>
                        </div>
                        <button 
                          onClick={() => handleCalculateReadiness(false)}
                          disabled={isCalculating}
                          className={`readiness-btn readiness-btn--calculate ${isCalculating ? 'readiness-btn--loading' : ''}`}
                        >
                          {isCalculating ? (
                            <>
                              <span className="readiness-btn__spinner"></span>
                              Calculating...
                            </>
                          ) : (
                            <>Calculate My Readiness</>
                          )}
                        </button>
                      </div>
                    );
                  }
                  
                  // Has score - show it with status label
                  const percentage = currentScore.percentage ?? 
                    Math.round((currentScore.total_score / (currentScore.max_possible_score || 1)) * 100);
                  const status = getReadinessStatus(percentage);
                  
                  return (
                    <div className="readiness-score">
                      {/* Status Badge */}
                      <div className={`readiness-score__status readiness-score__status--${status.color}`}>
                        <span className="readiness-score__status-icon">{status.icon}</span>
                        <span className="readiness-score__status-label">{status.label}</span>
                      </div>
                      
                      {/* Main Score Display */}
                      <div className="readiness-score__main">
                        <div className={`readiness-score__circle readiness-score__circle--${status.color}`}>
                          <div className="readiness-score__percentage">{percentage}%</div>
                          <div className="readiness-score__label">Readiness</div>
                        </div>
                        <div className="readiness-score__details">
                          <div className="readiness-score__stat">
                            <span className="readiness-score__stat-value">{currentScore.total_score}</span>
                            <span className="readiness-score__stat-label">Score Points</span>
                          </div>
                          <div className="readiness-score__stat">
                            <span className="readiness-score__stat-value">{currentScore.max_possible_score || '-'}</span>
                            <span className="readiness-score__stat-label">Max Possible</span>
                          </div>
                          <div className="readiness-score__stat">
                            <span className="readiness-score__stat-value readiness-score__stat-value--success">
                              {currentScore.skill_stats?.skills_met || '-'}
                            </span>
                            <span className="readiness-score__stat-label">Skills Met</span>
                          </div>
                          <div className="readiness-score__stat">
                            <span className="readiness-score__stat-value readiness-score__stat-value--warning">
                              {currentScore.skill_stats?.skills_missing || '-'}
                            </span>
                            <span className="readiness-score__stat-label">Skills Missing</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* Last calculated info */}
                      {currentScore.calculated_at && (
                        <div className="readiness-score__timestamp">
                          Last calculated: {formatDate(currentScore.calculated_at)}
                        </div>
                      )}
                      
                      {/* Missing Required Skills Alert */}
                      {currentScore.missing_required_skills?.length > 0 && (
                        <div className="readiness-score__missing-alert">
                          <h4 className="readiness-score__missing-title">
                            ⚠️ Missing Required Skills ({currentScore.missing_required_skills.length})
                          </h4>
                          <ul className="readiness-score__missing-list">
                            {currentScore.missing_required_skills.map((skill, index) => (
                              <li key={index} className="readiness-score__missing-item">{skill}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* ======================================================
                          🛡️ STEP 4: Guard Feedback Messages
                          ====================================================== */}
                      {calculationResult?._type === "cooldown" && (
                        <div className="readiness-score__guard-message readiness-score__guard-message--cooldown">
                          <span className="readiness-score__guard-icon">⏱️</span>
                          <div className="readiness-score__guard-content">
                            <strong>Cooldown Active</strong>
                            <p>{calculationResult.message}</p>
                          </div>
                        </div>
                      )}
                      
                      {calculationResult?._type === "no_changes" && (
                        <div className="readiness-score__guard-message readiness-score__guard-message--no-changes">
                          <span className="readiness-score__guard-icon">✅</span>
                          <div className="readiness-score__guard-content">
                            <strong>Already Up to Date</strong>
                            <p>{calculationResult.message}</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Primary Action: Recalculate Button */}
                      <div className="readiness-score__actions">
                        <button 
                          onClick={() => handleCalculateReadiness(false)}
                          disabled={isCalculating}
                          className={`readiness-btn readiness-btn--primary ${isCalculating ? 'readiness-btn--loading' : ''}`}
                        >
                          {isCalculating ? (
                            <>
                              <span className="readiness-btn__spinner"></span>
                              Recalculating...
                            </>
                          ) : (
                            <>🔄 Recalculate Readiness</>
                          )}
                        </button>
                        
                        {/* STEP 5: Link to Dashboard for history/trends */}
                        <button 
                          onClick={() => navigate('/vendor-dashboard/dashboard')}
                          className="readiness-btn readiness-btn--secondary"
                        >
                          📊 View Dashboard
                        </button>
                      </div>
                      
                      {/* STEP 5: Success message after calculation */}
                      {calculationResult?._type === "success" && (
                        <div className="readiness-score__success-hint">
                          <p>✨ Score updated! View your <strong onClick={() => navigate('/vendor-dashboard/dashboard')} style={{cursor: 'pointer', textDecoration: 'underline'}}>Dashboard</strong> for history and trends.</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </>
            )}
          </section>
          
          {/* ============================================================
              SECTION C: SKILL BREAKDOWN PREVIEW
              ============================================================ 
              
              Shows:
              - Required skills: met vs missing
              - Optional skills: met vs missing
              - Weight impact summary
              
              This is for EVALUATION, not tracking/history.
              NO trends, NO charts, NO dashboard duplication.
          */}
          {(calculationResult || latestReadiness) && (
            <section className="readiness-section readiness-breakdown">
              <div className="readiness-section__header">
                <h2 className="readiness-section__title">
                  <span className="readiness-section__icon">📝</span>
                  Skill Breakdown
                </h2>
                <p className="readiness-section__description">
                  Your skills evaluated against {context.role?.name} requirements
                </p>
              </div>
              
              {isLoadingBreakdown ? (
                <div className="readiness-breakdown__loading">
                  <div className="readiness-loading__spinner readiness-loading__spinner--small"></div>
                  <p>Loading skill breakdown...</p>
                </div>
              ) : skillBreakdown?.breakdown?.length > 0 ? (
                <>
                  {/* ========== SUMMARY CARDS ========== */}
                  <div className="readiness-breakdown__summary">
                    {/* Required Skills Summary */}
                    <div className="readiness-breakdown__summary-card readiness-breakdown__summary-card--required">
                      <h3 className="readiness-breakdown__summary-title">
                        <span>⭐</span> Required Skills
                      </h3>
                      <div className="readiness-breakdown__summary-stats">
                        <div className="readiness-breakdown__summary-stat">
                          <span className="readiness-breakdown__summary-value readiness-breakdown__summary-value--success">
                            {skillBreakdown.required_skills?.met || 0}
                          </span>
                          <span className="readiness-breakdown__summary-label">Met</span>
                        </div>
                        <div className="readiness-breakdown__summary-divider">/</div>
                        <div className="readiness-breakdown__summary-stat">
                          <span className="readiness-breakdown__summary-value readiness-breakdown__summary-value--danger">
                            {skillBreakdown.required_skills?.missing || 0}
                          </span>
                          <span className="readiness-breakdown__summary-label">Missing</span>
                        </div>
                        <div className="readiness-breakdown__summary-total">
                          of {skillBreakdown.required_skills?.total || 0} total
                        </div>
                      </div>
                    </div>
                    
                    {/* Optional Skills Summary */}
                    <div className="readiness-breakdown__summary-card readiness-breakdown__summary-card--optional">
                      <h3 className="readiness-breakdown__summary-title">
                        <span>📚</span> Optional Skills
                      </h3>
                      <div className="readiness-breakdown__summary-stats">
                        <div className="readiness-breakdown__summary-stat">
                          <span className="readiness-breakdown__summary-value readiness-breakdown__summary-value--success">
                            {skillBreakdown.optional_skills?.met || 0}
                          </span>
                          <span className="readiness-breakdown__summary-label">Met</span>
                        </div>
                        <div className="readiness-breakdown__summary-divider">/</div>
                        <div className="readiness-breakdown__summary-stat">
                          <span className="readiness-breakdown__summary-value readiness-breakdown__summary-value--muted">
                            {skillBreakdown.optional_skills?.missing || 0}
                          </span>
                          <span className="readiness-breakdown__summary-label">Missing</span>
                        </div>
                        <div className="readiness-breakdown__summary-total">
                          of {skillBreakdown.optional_skills?.total || 0} total
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* ========== WEIGHT IMPACT SUMMARY ========== */}
                  {skillBreakdown.weight_impact && (
                    <div className="readiness-breakdown__weight-impact">
                      <h4 className="readiness-breakdown__weight-title">📊 Weight Impact</h4>
                      <p className="readiness-breakdown__weight-text">
                        You've achieved <strong>{skillBreakdown.weight_impact.achieved_weight}</strong> out of{' '}
                        <strong>{skillBreakdown.weight_impact.total_weight}</strong> total weight points.
                        {skillBreakdown.weight_impact.required_weight_total > 0 && (
                          <span className="readiness-breakdown__weight-detail">
                            {' '}Required skills: {skillBreakdown.weight_impact.required_weight_achieved}/{skillBreakdown.weight_impact.required_weight_total} points.
                          </span>
                        )}
                      </p>
                    </div>
                  )}
                  
                  {/* ========== REQUIRED SKILLS LIST ========== */}
                  {skillBreakdown.required_skills?.total > 0 && (
                    <div className="readiness-breakdown__category">
                      <h4 className="readiness-breakdown__category-title">
                        ⭐ Required Skills ({skillBreakdown.required_skills.met}/{skillBreakdown.required_skills.total} met)
                      </h4>
                      <div className="readiness-breakdown__skills-grid">
                        {/* Met Required Skills */}
                        {skillBreakdown.required_skills.met_skills?.map((skill, index) => (
                          <div key={`req-met-${index}`} className="readiness-breakdown__skill-chip readiness-breakdown__skill-chip--met">
                            <span className="readiness-breakdown__skill-icon">✅</span>
                            {skill}
                          </div>
                        ))}
                        {/* Missing Required Skills */}
                        {skillBreakdown.required_skills.missing_skills?.map((skill, index) => (
                          <div key={`req-miss-${index}`} className="readiness-breakdown__skill-chip readiness-breakdown__skill-chip--missing-required">
                            <span className="readiness-breakdown__skill-icon">❌</span>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* ========== OPTIONAL SKILLS LIST ========== */}
                  {skillBreakdown.optional_skills?.total > 0 && (
                    <div className="readiness-breakdown__category">
                      <h4 className="readiness-breakdown__category-title">
                        📚 Optional Skills ({skillBreakdown.optional_skills.met}/{skillBreakdown.optional_skills.total} met)
                      </h4>
                      <div className="readiness-breakdown__skills-grid">
                        {/* Met Optional Skills */}
                        {skillBreakdown.optional_skills.met_skills?.map((skill, index) => (
                          <div key={`opt-met-${index}`} className="readiness-breakdown__skill-chip readiness-breakdown__skill-chip--met">
                            <span className="readiness-breakdown__skill-icon">✅</span>
                            {skill}
                          </div>
                        ))}
                        {/* Missing Optional Skills */}
                        {skillBreakdown.optional_skills.missing_skills?.map((skill, index) => (
                          <div key={`opt-miss-${index}`} className="readiness-breakdown__skill-chip readiness-breakdown__skill-chip--missing">
                            <span className="readiness-breakdown__skill-icon">○</span>
                            {skill}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <p className="readiness-breakdown__empty">No breakdown data available.</p>
              )}
            </section>
          )}
          
          {/* ============================================================
              NAVIGATION
              ============================================================ */}
          <div className="readiness-page__navigation">
            <button 
              onClick={() => navigate('/vendor-dashboard/dashboard')}
              className="readiness-btn readiness-btn--secondary"
            >
              ← Back to Dashboard
            </button>
            <button 
              onClick={() => navigate('/vendor-dashboard/profile')}
              className="readiness-btn readiness-btn--secondary"
            >
              Update Profile →
            </button>
          </div>
          
        </div>
      </div>
      <Footer4 />
    </>
  );
};

export default ReadinessPage;
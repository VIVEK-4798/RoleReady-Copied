import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import DefaultHeader from '@/components/header/default-header';
import Footer4 from '@/components/footer/footer-4';
import { api } from '@/utils/apiProvider';



const RoadmapPage = () => {
  const navigate = useNavigate();
  
  // State
  const [roadmap, setRoadmap] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Get user from localStorage
  const user = JSON.parse(localStorage.getItem('user'));
  const user_id = user?.user_id;
  
  useEffect(() => {
    if (!user_id) {
      toast.warning('Please login to view your roadmap');
      navigate('/login');
      return;
    }
    
    fetchRoadmap();
  }, [user_id]);
  
  const fetchRoadmap = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Always generate fresh roadmap to get latest data
      const genRes = await axios.get(`${api}/api/roadmap/generate/${user_id}`);
      
      if (genRes.data.success) {
        setRoadmap(genRes.data.roadmap);
      }
    } catch (err) {
      if (err.response?.data?.error === 'NO_READINESS_FOUND') {
        setError({
          type: 'no_readiness',
          message: 'You need to calculate your readiness score first before viewing your roadmap.'
        });
      } else {
        setError({
          type: 'error',
          message: err.response?.data?.message || 'Failed to load roadmap'
        });
      }
    } finally {
      setIsLoading(false);
    }
  };
  
  const generateNewRoadmap = async () => {
    try {
      // Generate fresh roadmap
      const genRes = await axios.get(`${api}/api/roadmap/generate/${user_id}`);
      
      if (genRes.data.success) {
        setRoadmap(genRes.data.roadmap);
        
        // Save it for future reference
        await axios.post(`${api}/api/roadmap/save/${user_id}`);
      }
    } catch (err) {
      if (err.response?.data?.error === 'NO_READINESS_FOUND') {
        setError({
          type: 'no_readiness',
          message: 'You need to calculate your readiness score first before viewing your roadmap.'
        });
      } else {
        setError({
          type: 'error',
          message: err.response?.data?.message || 'Failed to generate roadmap'
        });
      }
    }
  };
  
  const refreshRoadmap = async () => {
    setIsLoading(true);
    try {
      // Generate and save a fresh roadmap
      const genRes = await axios.get(`${api}/api/roadmap/generate/${user_id}`);
      
      if (genRes.data.success) {
        setRoadmap(genRes.data.roadmap);
        await axios.post(`${api}/api/roadmap/save/${user_id}`);
        toast.success('Roadmap refreshed!');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to refresh roadmap');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Group items by priority
  const getItemsByPriority = (priority) => {
    if (!roadmap?.items) return [];
    return roadmap.items.filter(item => item.priority === priority);
  };
  
  const highPriorityItems = getItemsByPriority('HIGH');
  const mediumPriorityItems = getItemsByPriority('MEDIUM');
  const lowPriorityItems = getItemsByPriority('LOW');
  
  // 🛡️ STEP 7: Edge Case Banner Component
  const EdgeCaseBanner = ({ edgeCase }) => {
    if (!edgeCase?.message) return null;
    
    const getStyles = () => {
      switch (edgeCase.message_type) {
        case 'success':
          return { 
            bg: '#dcfce7', 
            border: '#86efac', 
            color: '#15803d',
            icon: '🎉'
          };
        case 'warning':
          return { 
            bg: '#fef3c7', 
            border: '#fcd34d', 
            color: '#92400e',
            icon: '⚠️'
          };
        case 'info':
        default:
          return { 
            bg: '#dbeafe', 
            border: '#93c5fd', 
            color: '#1e40af',
            icon: '💡'
          };
      }
    };
    
    const styles = getStyles();
    
    return (
      <div style={{
        backgroundColor: styles.bg,
        border: `1px solid ${styles.border}`,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '1.5rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem'
      }}>
        <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{styles.icon}</span>
        <div>
          <p style={{ 
            margin: 0, 
            color: styles.color, 
            fontWeight: 500,
            fontSize: '0.95rem',
            lineHeight: 1.5
          }}>
            {edgeCase.message}
          </p>
          
          {/* Additional context for validation pending */}
          {edgeCase.has_pending_validation && (
            <p style={{ 
              margin: '0.5rem 0 0 0', 
              color: styles.color, 
              fontSize: '0.85rem',
              opacity: 0.9
            }}>
              {edgeCase.pending_validation_count} skill(s) are awaiting mentor review.
            </p>
          )}
        </div>
      </div>
    );
  };

  // Render a single roadmap item
  const RoadmapItem = ({ item }) => {
    const getCategoryStyle = () => {
      switch (item.category) {
        case 'rejected':
          return { bg: '#fef2f2', border: '#fecaca', icon: '⚠️' };
        case 'required_gap':
          return { bg: '#fef3c7', border: '#fcd34d', icon: '🔴' };
        case 'strengthen':
          return { bg: '#dbeafe', border: '#93c5fd', icon: '🔵' };
        case 'optional_gap':
          return { bg: '#f3f4f6', border: '#d1d5db', icon: '🟡' };
        default:
          return { bg: '#f9fafb', border: '#e5e7eb', icon: '📋' };
      }
    };
    
    const getConfidenceBadge = () => {
      switch (item.confidence) {
        case 'validated':
          return { label: 'Verified ✓', bg: '#dcfce7', color: '#15803d' };
        case 'rejected':
          return { label: 'Rejected ⚠', bg: '#fee2e2', color: '#dc2626' };
        default:
          return { label: 'Self-reported', bg: '#f3f4f6', color: '#6b7280' };
      }
    };
    
    const style = getCategoryStyle();
    const badge = getConfidenceBadge();
    
    return (
      <div className="roadmap-item" style={{
        backgroundColor: style.bg,
        border: `1px solid ${style.border}`,
        borderRadius: '12px',
        padding: '1rem 1.25rem',
        marginBottom: '0.75rem',
        transition: 'transform 0.2s, box-shadow 0.2s'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
          {/* Category Icon */}
          <span style={{ fontSize: '1.25rem', flexShrink: 0 }}>{style.icon}</span>
          
          {/* Content */}
          <div style={{ flex: 1, minWidth: 0 }}>
            {/* Skill Name + Badge */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.5rem' }}>
              <span style={{ fontWeight: 600, fontSize: '1rem', color: '#1e293b' }}>
                {item.skill_name}
              </span>
              <span style={{
                padding: '0.125rem 0.5rem',
                borderRadius: '9999px',
                fontSize: '0.7rem',
                fontWeight: 500,
                backgroundColor: badge.bg,
                color: badge.color
              }}>
                {badge.label}
              </span>
            </div>
            
            {/* Reason */}
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#475569', 
              margin: 0,
              lineHeight: 1.5
            }}>
              {item.reason}
            </p>
            
            {/* Action Hint */}
            {item.action_hint && (
              <p style={{
                fontSize: '0.8rem',
                color: '#64748b',
                margin: '0.5rem 0 0 0',
                fontStyle: 'italic'
              }}>
                💡 {item.action_hint}
              </p>
            )}
          </div>
        </div>
      </div>
    );
  };
  
  // Render a priority section
  const PrioritySection = ({ title, emoji, description, items, emptyMessage, bgColor }) => {
    if (items.length === 0) {
      return (
        <div className="roadmap-section" style={{ marginBottom: '2rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            marginBottom: '1rem'
          }}>
            <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
            <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
              {title}
            </h2>
            <span style={{
              padding: '0.125rem 0.5rem',
              backgroundColor: '#e2e8f0',
              borderRadius: '9999px',
              fontSize: '0.75rem',
              fontWeight: 600,
              color: '#64748b'
            }}>
              0
            </span>
          </div>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8fafc',
            borderRadius: '12px',
            textAlign: 'center',
            color: '#94a3b8'
          }}>
            <p style={{ margin: 0 }}>{emptyMessage}</p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="roadmap-section" style={{ marginBottom: '2rem' }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1rem'
        }}>
          <span style={{ fontSize: '1.5rem' }}>{emoji}</span>
          <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#1e293b' }}>
            {title}
          </h2>
          <span style={{
            padding: '0.125rem 0.5rem',
            backgroundColor: bgColor || '#e2e8f0',
            borderRadius: '9999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: '#1e293b'
          }}>
            {items.length}
          </span>
        </div>
        <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '1rem' }}>
          {description}
        </p>
        <div>
          {items.map((item, idx) => (
            <RoadmapItem key={item.item_id || item.skill_id || idx} item={item} />
          ))}
        </div>
      </div>
    );
  };
  
  return (
    <>
      <DefaultHeader />
      
      <section className="pt-40 pb-40" style={{ backgroundColor: '#f8fafc', minHeight: '80vh' }}>
        <div className="container">
          {/* Page Header */}
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, color: '#1e293b', marginBottom: '0.5rem' }}>
              🧭 Your Skill Roadmap
            </h1>
            <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              A prioritized list of skills to focus on, based on your readiness analysis.
            </p>
          </div>
          
          {/* Loading State */}
          {isLoading && (
            <div style={{ textAlign: 'center', padding: '4rem 2rem' }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🔄</div>
              <p style={{ color: '#64748b' }}>Loading your roadmap...</p>
            </div>
          )}
          
          {/* Error State */}
          {error && !isLoading && (
            <div style={{
              maxWidth: '500px',
              margin: '0 auto',
              padding: '2rem',
              backgroundColor: error.type === 'no_readiness' ? '#fef3c7' : '#fee2e2',
              borderRadius: '12px',
              textAlign: 'center'
            }}>
              <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>
                {error.type === 'no_readiness' ? '📊' : '❌'}
              </div>
              <p style={{ color: error.type === 'no_readiness' ? '#92400e' : '#991b1b', marginBottom: '1rem' }}>
                {error.message}
              </p>
              {error.type === 'no_readiness' && (
                <button
                  onClick={() => navigate('/readiness')}
                  style={{
                    padding: '0.75rem 1.5rem',
                    backgroundColor: '#4f46e5',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    fontWeight: 500,
                    cursor: 'pointer'
                  }}
                >
                  Calculate Readiness First →
                </button>
              )}
            </div>
          )}
          
          {/* Roadmap Content */}
          {roadmap && !isLoading && !error && (
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
              {/* Summary Card */}
              <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '1.5rem 2rem',
                marginBottom: '2rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <p style={{ color: '#64748b', fontSize: '0.875rem', marginBottom: '0.25rem' }}>
                      Based on your latest readiness score
                    </p>
                    <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.5rem' }}>
                      <span style={{ fontSize: '2.5rem', fontWeight: 700, color: '#4f46e5' }}>
                        {roadmap.readiness_score || roadmap.current_score}%
                      </span>
                      <span style={{ color: '#64748b', fontSize: '0.875rem' }}>
                        for {roadmap.role_name}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                    {/* Stats */}
                    <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#dc2626' }}>
                        {roadmap.summary?.high_priority || roadmap.summary?.by_priority?.high || 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>High</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#d97706' }}>
                        {roadmap.summary?.medium_priority || roadmap.summary?.by_priority?.medium || 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Medium</div>
                    </div>
                    <div style={{ textAlign: 'center', padding: '0.5rem 1rem' }}>
                      <div style={{ fontSize: '1.25rem', fontWeight: 600, color: '#65a30d' }}>
                        {roadmap.summary?.low_priority || roadmap.summary?.by_priority?.low || 0}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase' }}>Low</div>
                    </div>
                  </div>
                </div>
                
                {/* Refresh Button */}
                <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={refreshRoadmap}
                    disabled={isLoading}
                    style={{
                      padding: '0.5rem 1rem',
                      backgroundColor: '#f1f5f9',
                      color: '#475569',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem'
                    }}
                  >
                    🔄 Refresh Roadmap
                  </button>
                  <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Last generated: {new Date(roadmap.generated_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              {/* 🛡️ STEP 7: Edge Case Banner */}
              <EdgeCaseBanner edgeCase={roadmap.edge_case} />
              
              {/* 🛡️ STEP 7: Fully Ready State - Enhanced Display */}
              {roadmap.edge_case?.is_fully_ready && (
                <div style={{
                  textAlign: 'center',
                  padding: '3rem',
                  backgroundColor: '#dcfce7',
                  borderRadius: '16px',
                  marginBottom: '2rem'
                }}>
                  <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎉</div>
                  <h2 style={{ color: '#15803d', marginBottom: '0.75rem', fontSize: '1.75rem' }}>
                    You're Ready!
                  </h2>
                  <p style={{ color: '#16a34a', fontSize: '1rem', maxWidth: '400px', margin: '0 auto 1.5rem' }}>
                    Congratulations! You've met all the skill requirements for <strong>{roadmap.role_name}</strong>.
                    Your readiness score reflects your preparation.
                  </p>
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    padding: '0.5rem 1rem',
                    backgroundColor: '#bbf7d0',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    color: '#166534'
                  }}>
                    ✓ All required skills met and validated
                  </div>
                </div>
              )}
              
              {/* 🛡️ STEP 7: Only Optional Gaps - Show priority sections but with context */}
              {!roadmap.edge_case?.is_fully_ready && (
                <>
                  {/* Priority Sections */}
                  <PrioritySection
                    title="High Priority"
                    emoji="🔥"
                    description="Focus on these first — they're blocking your readiness score."
                    items={highPriorityItems}
                    emptyMessage="✨ No high-priority items! Great job!"
                    bgColor="#fee2e2"
                  />
                  
                  <PrioritySection
                    title="Medium Priority"
                    emoji="📈"
                    description={roadmap.edge_case?.has_unvalidated_required 
                      ? "These skills meet requirements but aren't mentor-validated yet. Validation could boost your score."
                      : "Work on these next to strengthen your profile."
                    }
                    items={mediumPriorityItems}
                    emptyMessage="No medium-priority items right now."
                    bgColor="#fef3c7"
                  />
                  
                  <PrioritySection
                    title="Low Priority"
                    emoji="📋"
                    description={roadmap.edge_case?.only_optional_gaps
                      ? "These are optional enhancements — not required for your target role, but could differentiate you."
                      : "Optional improvements — nice to have but not critical."
                    }
                    items={lowPriorityItems}
                    emptyMessage="No low-priority items."
                    bgColor="#dcfce7"
                  />
                </>
              )}
              
              {/* Rules Applied (Debug/Transparency) */}
              {roadmap.rules_applied && (
                <div style={{
                  marginTop: '2rem',
                  padding: '1rem',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  fontSize: '0.75rem',
                  color: '#64748b'
                }}>
                  <strong>How this roadmap was generated:</strong>
                  <ul style={{ margin: '0.5rem 0 0 1.25rem', padding: 0 }}>
                    {roadmap.rules_applied.map((rule, idx) => (
                      <li key={idx}>
                        {rule.description}: <strong>{rule.count}</strong> items
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      </section>
      
      <Footer4 />
    </>
  );
};

export default RoadmapPage;

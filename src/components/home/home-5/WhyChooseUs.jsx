import React, { useState } from 'react';
import { FaSearch, FaBullseye, FaChartBar, FaRoad, FaUserCheck, FaCheckCircle, FaTimes } from 'react-icons/fa';
import DemoModal from './DemoModal';

const WhyChooseUs = () => {
  const themeColor = '#5693C1';
  const [showDemo, setShowDemo] = useState(false);

  const differences = [
    {
      id: 1,
      icon: <FaSearch size={24} />,
      title: "Not a Job Portal",
      text: "We don't just list jobs. We prepare you for them with precise readiness assessment before you even apply.",
    },
    {
      id: 2,
      icon: <FaBullseye size={24} />,
      title: "Focuses on Readiness, Not Applications",
      text: "Shift from quantity of applications to quality of preparation. Know exactly where you stand before applying.",
    },
    {
      id: 3,
      icon: <FaChartBar size={24} />,
      title: "Clear Explanations, Not Just Scores",
      text: "Get detailed breakdowns of why you scored what you did, with specific improvement areas and actionable insights.",
    },
    {
      id: 4,
      icon: <FaRoad size={24} />,
      title: "Structured Guidance, Not Guesswork",
      text: "Follow a personalized, step-by-step roadmap instead of random preparation. Every action has a purpose.",
    },
    {
      id: 5,
      icon: <FaUserCheck size={24} />,
      title: "Mentor-Backed Validation",
      text: "Optional expert validation ensures your preparation meets industry standards and expectations.",
    }
  ];

  const comparisonPoints = [
    {
      traditional: "Apply everywhere, hope something sticks",
      roleready: "Apply selectively, knowing you're ready"
    },
    {
      traditional: "Generic preparation advice",
      roleready: "Personalized, role-specific guidance"
    },
    {
      traditional: "No feedback on rejections",
      roleready: "Detailed gap analysis before applying"
    },
    {
      traditional: "Unstructured learning",
      roleready: "Step-by-step improvement roadmap"
    }
  ];

  return (
    <section className="why-choose-us-section">
      <div className="why-choose-us-container">
        {/* Header Section */}
        <div className="header-container">
          <div className="badge">
            <p className="badge-text">What Makes Us Different</p>
          </div>
          
          <h2 className="main-title">Why RoleReady?</h2>
          
          <p className="description">
            We're redefining placement preparation with a focus on readiness over resumes, and clarity over confusion.
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div className="content-grid">
          {/* Left Column - Key Differentiators */}
          <div className="card-container">
            <h3 className="card-title">Our Core Differentiators</h3>
            
            <div>
              {differences.map((item) => (
                <div key={item.id} className="difference-item">
                  <div className="icon-box">
                    {item.icon}
                  </div>
                  
                  <div>
                    <h4 className="difference-heading">{item.title}</h4>
                    <p className="difference-text">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Metric */}
            <div className="metric-box">
              <div className="metric-number">3x Higher</div>
              <p className="metric-text">
                interview conversion rate for students who use RoleReady vs traditional methods
              </p>
            </div>
          </div>

          {/* Right Column - Comparison */}
          <div className="card-container">
            <h3 className="card-title">Traditional vs RoleReady</h3>
            
            <div className="comparison-header">
              <div>
                <p className="comparison-label">Traditional Approach</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p className="comparison-label">RoleReady</p>
              </div>
            </div>
            
            <div>
              {comparisonPoints.map((item, index) => (
                <div key={index} className="comparison-item">
                  <div className="traditional-text">
                    <FaTimes size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                    <p className="traditional-label">{item.traditional}</p>
                  </div>
                  
                  <div className="roleready-text">
                    <p className="roleready-label">{item.roleready}</p>
                    <FaCheckCircle size={16} color={themeColor} style={{ flexShrink: 0 }} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stats Row */}
            <div className="stats-row">
              <div className="stat-item">
                <div className="stat-number">10K+</div>
                <div className="stat-label">Students</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">92%</div>
                <div className="stat-label">Satisfaction</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">Partners</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="cta-section">
          <div className="cta-card">
            <h3 className="cta-title">Experience the Difference Yourself</h3>
            
            <p className="cta-description">
              See how RoleReady transforms your placement preparation in minutes.
            </p>
            
            <div className="button-container">
              <button
                className="primary-button"
                style={{
                  padding: '14px 40px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: themeColor,
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 4px 12px rgba(86, 147, 193, 0.3)',
                  letterSpacing: '0.3px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(86, 147, 193, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(86, 147, 193, 0.3)';
                }}
              >
                Start Free Analysis
              </button>
              
              <button
                className="secondary-button"
                style={{
                  padding: '14px 40px',
                  fontSize: '16px',
                  fontWeight: '700',
                  background: 'white',
                  color: themeColor,
                  border: `2px solid ${themeColor}`,
                  borderRadius: '10px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  letterSpacing: '0.3px'
                }}
                onClick={() => setShowDemo(true)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(86, 147, 193, 0.1)';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Demo
              </button>
            </div>
            
            <p className="cta-subtext">
              No credit card required • Takes 5 minutes • Get instant results
            </p>
          </div>
        </div>

        {/* Demo Modal */}
        {showDemo && <DemoModal onClose={() => setShowDemo(false)} />}
      </div>
    </section>
  );
};

export default WhyChooseUs;
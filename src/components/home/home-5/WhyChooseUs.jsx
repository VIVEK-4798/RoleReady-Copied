import React, { useState } from 'react';
import { FaSearch, FaBullseye, FaChartBar, FaRoad, FaUserCheck, FaCheckCircle, FaTimes } from 'react-icons/fa';

const WhyChooseUs = () => {
  const themeColor = '#5693C1';
  const [hoveredCard, setHoveredCard] = useState(null);

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

  const sectionStyle = {
    padding: '120px 40px',
    background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fc 100%)',
    minHeight: '100vh',
  };

  const containerStyle = {
    maxWidth: '1300px',
    margin: '0 auto',
  };

  const headerContainerStyle = {
    textAlign: 'center',
    marginBottom: '80px',
  };

  const badgeStyle = {
    background: `rgba(86, 147, 193, 0.12)`,
    border: `2px solid rgba(86, 147, 193, 0.25)`,
    display: 'inline-block',
    borderRadius: '20px',
    padding: '10px 24px',
    marginBottom: '24px',
  };

  const badgeTextStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: themeColor,
    letterSpacing: '0.5px',
    margin: 0,
  };

  const mainTitleStyle = {
    fontSize: '56px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '24px',
    lineHeight: '1.2',
    letterSpacing: '-1px',
  };

  const descriptionStyle = {
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.8',
    fontWeight: '500',
  };

  const contentGridStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '40px',
    marginBottom: '60px',
  };

  const cardContainerStyle = {
    padding: '48px',
    borderRadius: '16px',
    background: 'white',
    border: '1px solid #e2e8f0',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.04)',
    transition: 'all 0.3s ease',
    height: '100%',
  };

  const cardContainerHoverStyle = {
    ...cardContainerStyle,
    boxShadow: '0 20px 40px rgba(86, 147, 193, 0.12)',
    borderColor: `rgba(86, 147, 193, 0.2)`,
    transform: 'translateY(-8px)',
  };

  const cardTitleStyle = {
    fontSize: '28px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '32px',
    letterSpacing: '-0.5px',
  };

  const differenceItemStyle = {
    display: 'flex',
    gap: '20px',
    marginBottom: '28px',
    alignItems: 'flex-start',
  };

  const iconBoxStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '12px',
    background: `rgba(86, 147, 193, 0.15)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: themeColor,
    flexShrink: 0,
    boxShadow: '0 4px 12px rgba(86, 147, 193, 0.1)',
  };

  const differenceHeadingStyle = {
    fontSize: '18px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '8px',
    lineHeight: '1.3',
  };

  const differenceTextStyle = {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.7',
    margin: 0,
  };

  const metricBoxStyle = {
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '2px solid #e2e8f0',
    textAlign: 'center',
  };

  const metricNumberStyle = {
    fontSize: '42px',
    fontWeight: '800',
    color: themeColor,
    marginBottom: '12px',
    letterSpacing: '-1px',
  };

  const metricTextStyle = {
    fontSize: '16px',
    color: '#64748b',
    lineHeight: '1.6',
    maxWidth: '300px',
    margin: '0 auto',
  };

  const comparisonHeaderStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    marginBottom: '28px',
    gap: '20px',
  };

  const comparisonLabelStyle = {
    fontSize: '14px',
    fontWeight: '700',
    color: '#0f172a',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  };

  const comparisonItemStyle = {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px',
    alignItems: 'center',
  };

  const traditionalTextStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
  };

  const traditionalLabelStyle = {
    fontSize: '15px',
    color: '#64748b',
    lineHeight: '1.6',
    margin: 0,
  };

  const rolereadyTextStyle = {
    display: 'flex',
    gap: '12px',
    alignItems: 'center',
    justifyContent: 'flex-end',
  };

  const rolereadyLabelStyle = {
    fontSize: '15px',
    color: '#0f172a',
    fontWeight: '600',
    lineHeight: '1.6',
    margin: 0,
  };

  const statsRowStyle = {
    marginTop: '40px',
    paddingTop: '32px',
    borderTop: '2px solid #e2e8f0',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr 1fr',
    gap: '24px',
    textAlign: 'center',
  };

  const statItemStyle = {
    padding: '16px',
  };

  const statNumberStyle = {
    fontSize: '36px',
    fontWeight: '800',
    color: themeColor,
    marginBottom: '8px',
    letterSpacing: '-0.5px',
  };

  const statLabelStyle = {
    fontSize: '14px',
    color: '#64748b',
    fontWeight: '600',
  };

  const ctaSectionStyle = {
    marginTop: '80px',
  };

  const ctaCardStyle = {
    background: `linear-gradient(135deg, rgba(86, 147, 193, 0.08) 0%, rgba(86, 147, 193, 0.04) 100%)`,
    border: `2px solid rgba(86, 147, 193, 0.2)`,
    borderRadius: '16px',
    padding: '64px 48px',
    textAlign: 'center',
    maxWidth: '900px',
    margin: '0 auto',
    boxShadow: '0 4px 12px rgba(86, 147, 193, 0.08)',
    transition: 'all 0.3s ease',
  };

  const ctaCardHoverStyle = {
    ...ctaCardStyle,
    boxShadow: '0 20px 40px rgba(86, 147, 193, 0.15)',
    transform: 'translateY(-4px)',
    borderColor: `rgba(86, 147, 193, 0.3)`,
  };

  const ctaTitleStyle = {
    fontSize: '32px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '20px',
    letterSpacing: '-0.5px',
  };

  const ctaDescriptionStyle = {
    fontSize: '17px',
    color: '#64748b',
    marginBottom: '32px',
    maxWidth: '550px',
    margin: '0 auto 32px',
    lineHeight: '1.7',
    fontWeight: '500',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '16px',
    justifyContent: 'center',
    marginBottom: '24px',
    flexWrap: 'wrap',
  };

  const primaryButtonStyle = {
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
    letterSpacing: '0.3px',
  };

  const secondaryButtonStyle = {
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: '700',
    background: 'white',
    color: themeColor,
    border: `2px solid ${themeColor}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
  };

  const ctaSubtextStyle = {
    fontSize: '14px',
    color: '#94a3b8',
    fontWeight: '500',
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerContainerStyle}>
          <div style={badgeStyle}>
            <p style={badgeTextStyle}>What Makes Us Different</p>
          </div>
          
          <h2 style={mainTitleStyle}>Why RoleReady?</h2>
          
          <p style={descriptionStyle}>
            We're redefining placement preparation with a focus on readiness over resumes, and clarity over confusion.
          </p>
        </div>

        {/* Main Content - Two Columns */}
        <div style={contentGridStyle}>
          {/* Left Column - Key Differentiators */}
          <div
            style={cardContainerStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardContainerHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, cardContainerStyle);
            }}
          >
            <h3 style={cardTitleStyle}>Our Core Differentiators</h3>
            
            <div>
              {differences.map((item) => (
                <div key={item.id} style={differenceItemStyle}>
                  <div style={iconBoxStyle}>
                    {item.icon}
                  </div>
                  
                  <div>
                    <h4 style={differenceHeadingStyle}>{item.title}</h4>
                    <p style={differenceTextStyle}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {/* Key Metric */}
            <div style={metricBoxStyle}>
              <div style={metricNumberStyle}>3x Higher</div>
              <p style={metricTextStyle}>
                interview conversion rate for students who use RoleReady vs traditional methods
              </p>
            </div>
          </div>

          {/* Right Column - Comparison */}
          <div
            style={cardContainerStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, cardContainerHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, cardContainerStyle);
            }}
          >
            <h3 style={cardTitleStyle}>Traditional vs RoleReady</h3>
            
            <div style={comparisonHeaderStyle}>
              <div>
                <p style={comparisonLabelStyle}>Traditional Approach</p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={comparisonLabelStyle}>RoleReady</p>
              </div>
            </div>
            
            <div>
              {comparisonPoints.map((item, index) => (
                <div key={index} style={comparisonItemStyle}>
                  <div style={traditionalTextStyle}>
                    <FaTimes size={16} color="#ef4444" style={{ flexShrink: 0 }} />
                    <p style={traditionalLabelStyle}>{item.traditional}</p>
                  </div>
                  
                  <div style={rolereadyTextStyle}>
                    <p style={rolereadyLabelStyle}>{item.roleready}</p>
                    <FaCheckCircle size={16} color={themeColor} style={{ flexShrink: 0 }} />
                  </div>
                </div>
              ))}
            </div>
            
            {/* Stats Row */}
            <div style={statsRowStyle}>
              <div style={statItemStyle}>
                <div style={statNumberStyle}>10K+</div>
                <div style={statLabelStyle}>Students</div>
              </div>
              <div style={statItemStyle}>
                <div style={statNumberStyle}>92%</div>
                <div style={statLabelStyle}>Satisfaction</div>
              </div>
              <div style={statItemStyle}>
                <div style={statNumberStyle}>50+</div>
                <div style={statLabelStyle}>Partners</div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div style={ctaSectionStyle}>
          <div
            style={ctaCardStyle}
            onMouseEnter={(e) => {
              Object.assign(e.currentTarget.style, ctaCardHoverStyle);
            }}
            onMouseLeave={(e) => {
              Object.assign(e.currentTarget.style, ctaCardStyle);
            }}
          >
            <h3 style={ctaTitleStyle}>Experience the Difference Yourself</h3>
            
            <p style={ctaDescriptionStyle}>
              See how RoleReady transforms your placement preparation in minutes.
            </p>
            
            <div style={buttonContainerStyle}>
              <button
                style={primaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#427aa1';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 8px 16px rgba(86, 147, 193, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = themeColor;
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(86, 147, 193, 0.3)';
                }}
              >
                Start Free Analysis
              </button>
              
              <button
                style={secondaryButtonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = `rgba(86, 147, 193, 0.08)`;
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'white';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                View Demo
              </button>
            </div>
            
            <p style={ctaSubtextStyle}>
              No credit card required • Takes 5 minutes • Get instant results
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;

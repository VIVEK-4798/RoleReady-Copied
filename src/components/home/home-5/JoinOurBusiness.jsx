import React, { useState } from 'react';
import { FaUpload, FaChartLine, FaClipboardCheck, FaRoad, FaUserCheck, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: <FaUpload size={28} color="#ffffff" />,
    title: 'Upload Resume & Select Target Role',
    desc: 'Upload your resume and choose the specific role you want to target. Our AI analyzes your current profile against role requirements.',
    features: ['Resume parsing', 'Role matching', 'Company alignment'],
    color: '#5693C1',
  },
  {
    number: '02',
    icon: <FaChartLine size={28} color="#ffffff" />,
    title: 'Skill Gap Analysis Based on Role Benchmarks',
    desc: 'Get a detailed breakdown of your strengths and weaknesses compared to industry benchmarks for your target role.',
    features: ['Technical skills gap', 'Soft skills assessment', 'Industry benchmark comparison'],
    color: '#5693C1',
  },
  {
    number: '03',
    icon: <FaClipboardCheck size={28} color="#ffffff" />,
    title: 'Get a Readiness Score with Clear Explanation',
    desc: 'Receive a comprehensive readiness score with detailed explanations of what it means and how to improve.',
    features: ['Overall readiness score', 'Area-wise breakdown', 'Improvement priorities'],
    color: '#5693C1',
  },
  {
    number: '04',
    icon: <FaRoad size={28} color="#ffffff" />,
    title: 'Follow a Personalized Improvement Roadmap',
    desc: 'Get a step-by-step roadmap with resources, timelines, and milestones to bridge your skill gaps effectively.',
    features: ['Weekly learning plan', 'Resource recommendations', 'Progress tracking'],
    color: '#5693C1',
  },
  {
    number: '05',
    icon: <FaUserCheck size={28} color="#ffffff" />,
    title: 'Mentor Review & Validation',
    desc: 'Optional expert review from industry mentors to validate your progress and provide personalized guidance.',
    features: ['Expert feedback', 'Mock interviews', 'Career guidance'],
    color: '#5693C1',
  }
];

const JoinOurBusiness = () => {
  const [hoveredCard, setHoveredCard] = useState(null);

  const sectionStyle = {
    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
    padding: '100px 20px',
    position: 'relative',
    overflow: 'hidden',
  };

  const backgroundOrbStyle = {
    position: 'absolute',
    borderRadius: '50%',
    opacity: 0.08,
    pointerEvents: 'none',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const headerSectionStyle = {
    textAlign: 'center',
    marginBottom: '80px',
    position: 'relative',
    zIndex: 2,
  };

  const titleStyle = {
    fontSize: '52px',
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: '24px',
    lineHeight: '1.2',
    letterSpacing: '-0.5px',
  };

  const subtitleStyle = {
    fontSize: '18px',
    color: '#64748b',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.8',
    fontWeight: '400',
  };

  const dividerStyle = {
    width: '80px',
    height: '4px',
    background: 'linear-gradient(90deg, #5693C1, #427aa1)',
    margin: '32px auto 0',
    borderRadius: '2px',
  };

  const stepsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
    gap: '28px',
    marginBottom: '60px',
    position: 'relative',
    zIndex: 2,
  };

  const cardStyle = (isHovered) => ({
    height: '100%',
    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.98) 0%, rgba(248, 250, 252, 0.95) 100%)',
    border: isHovered ? '1px solid #5693C1' : '1px solid rgba(86, 147, 193, 0.15)',
    borderRadius: '16px',
    padding: '40px 32px',
    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: isHovered 
      ? '0 24px 48px rgba(86, 147, 193, 0.16)' 
      : '0 4px 16px rgba(0, 0, 0, 0.04)',
    transform: isHovered ? 'translateY(-12px)' : 'translateY(0)',
  });

  const cardNumberStyle = {
    position: 'absolute',
    top: '24px',
    right: '28px',
    fontSize: '13px',
    fontWeight: '700',
    color: '#5693C1',
    background: 'rgba(86, 147, 193, 0.08)',
    padding: '6px 14px',
    borderRadius: '20px',
    border: '1px solid rgba(86, 147, 193, 0.15)',
    letterSpacing: '0.5px',
  };

  const iconContainerStyle = {
    width: '80px',
    height: '80px',
    background: 'linear-gradient(135deg, #5693C1 0%, #3d7fa8 100%)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    boxShadow: '0 8px 16px rgba(86, 147, 193, 0.2)',
    transition: 'all 0.3s ease',
  };

  const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: '700',
    color: '#0f172a',
    marginBottom: '16px',
    lineHeight: '1.35',
    letterSpacing: '-0.2px',
  };

  const cardDescStyle = {
    fontSize: '15px',
    color: '#475569',
    marginBottom: '28px',
    lineHeight: '1.7',
    fontWeight: '400',
  };

  const featureListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 14px',
    background: 'rgba(86, 147, 193, 0.04)',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    cursor: 'pointer',
  };

  const featureTextStyle = {
    fontSize: '14px',
    color: '#334155',
    marginLeft: '10px',
    fontWeight: '500',
  };

  const bottomLineStyle = {
    position: 'absolute',
    bottom: '0',
    left: '0',
    right: '0',
    height: '3px',
    background: 'linear-gradient(90deg, rgba(86, 147, 193, 0.1) 0%, #5693C1 50%, rgba(86, 147, 193, 0.1) 100%)',
    borderRadius: '0 0 16px 16px',
  };

  const ctaCardStyle = {
    background: 'linear-gradient(135deg, #5693C1 0%, #3d7fa8 100%)',
    borderRadius: '16px',
    padding: '48px 40px',
    color: 'white',
    position: 'relative',
    overflow: 'hidden',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    boxShadow: '0 16px 40px rgba(86, 147, 193, 0.2)',
    transition: 'all 0.3s ease',
  };

  const ctaBackgroundOrbStyle = {
    position: 'absolute',
    top: '-60px',
    right: '-60px',
    width: '300px',
    height: '300px',
    background: 'radial-gradient(circle, rgba(255, 255, 255, 0.15) 0%, transparent 70%)',
    borderRadius: '50%',
    pointerEvents: 'none',
  };

  const ctaContentStyle = {
    position: 'relative',
    zIndex: 1,
  };

  const ctaIconContainerStyle = {
    width: '100px',
    height: '100px',
    background: 'rgba(255, 255, 255, 0.15)',
    borderRadius: '14px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '28px',
    marginLeft: 'auto',
    marginRight: 'auto',
    backdropFilter: 'blur(10px)',
  };

  const ctaTitleStyle = {
    fontSize: '28px',
    fontWeight: '800',
    marginBottom: '16px',
    lineHeight: '1.2',
    letterSpacing: '-0.3px',
    textAlign: 'center',
  };

  const ctaDescStyle = {
    fontSize: '16px',
    marginBottom: '32px',
    opacity: 0.95,
    lineHeight: '1.7',
    textAlign: 'center',
    fontWeight: '400',
  };

  const ctaFeatureListStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
    marginBottom: '32px',
  };

  const ctaFeatureItemStyle = {
    display: 'flex',
    alignItems: 'center',
    padding: '10px 0',
  };

  const ctaCheckIconStyle = {
    width: '36px',
    height: '36px',
    background: 'white',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: '12px',
    flexShrink: 0,
  };

  const ctaFeatureTextStyle = {
    fontSize: '15px',
    fontWeight: '500',
  };

  const buttonStyle = {
    width: '100%',
    height: '56px',
    background: 'white',
    color: '#5693C1',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    letterSpacing: '0.3px',
    boxShadow: '0 8px 20px rgba(0, 0, 0, 0.12)',
  };

  const processVisualizationStyle = {
    marginTop: '80px',
    background: 'linear-gradient(135deg, rgba(86, 147, 193, 0.06) 0%, rgba(86, 147, 193, 0.02) 100%)',
    border: '1px solid rgba(86, 147, 193, 0.12)',
    borderRadius: '16px',
    padding: '40px 32px',
    position: 'relative',
    zIndex: 2,
  };

  const processItemsContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '24px',
  };

  const processItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: '24px',
  };

  const processNumberStyle = {
    width: '56px',
    height: '56px',
    borderRadius: '50%',
    background: 'white',
    border: '2px solid #5693C1',
    color: '#5693C1',
    fontWeight: '700',
    fontSize: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 4px 12px rgba(86, 147, 193, 0.1)',
  };

  const processLabelStyle = {
    fontSize: '13px',
    fontWeight: '600',
    color: '#334155',
    maxWidth: '100px',
    textAlign: 'center',
    letterSpacing: '0.3px',
  };

  const arrowStyle = {
    width: '32px',
    height: '2px',
    background: 'linear-gradient(90deg, rgba(86, 147, 193, 0.3), #5693C1, rgba(86, 147, 193, 0.3))',
    position: 'relative',
  };

  const arrowHeadStyle = {
    position: 'absolute',
    right: '-6px',
    top: '-4px',
    width: '8px',
    height: '8px',
    borderRight: '2px solid #5693C1',
    borderTop: '2px solid #5693C1',
    transform: 'rotate(45deg)',
  };

  return (
    <section style={sectionStyle}>
      {/* Background decorative orbs */}
      <div 
        style={{
          ...backgroundOrbStyle,
          top: '-150px',
          right: '-150px',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #5693C1, transparent)',
        }}
      />
      <div 
        style={{
          ...backgroundOrbStyle,
          bottom: '-100px',
          left: '-100px',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, #5693C1, transparent)',
        }}
      />

      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerSectionStyle}>
          <h2 style={titleStyle}>
            How RoleReady Works
          </h2>
          <p style={subtitleStyle}>
            From resume upload to placement readiness, follow a clear 5-step process that transforms uncertainty into actionable clarity and confidence.
          </p>
          <div style={dividerStyle} />
        </div>

        {/* Steps Grid */}
        <div style={stepsGridStyle}>
          {steps.map((step, index) => (
            <div
              key={index}
              style={cardStyle(hoveredCard === index)}
              onMouseEnter={() => setHoveredCard(index)}
              onMouseLeave={() => setHoveredCard(null)}
              onMouseMove={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
              }}
            >
              <div style={cardNumberStyle}>{step.number}</div>

              <div style={iconContainerStyle}>
                {step.icon}
              </div>

              <h3 style={cardTitleStyle}>
                {step.title}
              </h3>

              <p style={cardDescStyle}>
                {step.desc}
              </p>

              <div style={featureListStyle}>
                {step.features.map((feature, featureIndex) => (
                  <div
                    key={featureIndex}
                    style={featureItemStyle}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(86, 147, 193, 0.1)';
                      e.currentTarget.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(86, 147, 193, 0.04)';
                      e.currentTarget.style.transform = 'translateX(0)';
                    }}
                  >
                    <FaCheckCircle 
                      size={16} 
                      color="#5693C1" 
                      style={{ flexShrink: 0 }}
                    />
                    <span style={featureTextStyle}>{feature}</span>
                  </div>
                ))}
              </div>

              <div style={bottomLineStyle} />
            </div>
          ))}

          {/* Final CTA Card */}
          <div
            style={ctaCardStyle}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-8px)';
              e.currentTarget.style.boxShadow = '0 24px 48px rgba(86, 147, 193, 0.25)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 16px 40px rgba(86, 147, 193, 0.2)';
            }}
          >
            <div style={ctaBackgroundOrbStyle} />

            <div style={ctaContentStyle}>
              <div style={ctaIconContainerStyle}>
                <FaCheckCircle size={50} color="white" />
              </div>

              <h3 style={ctaTitleStyle}>
                Ready to Transform Your Career?
              </h3>

              <p style={ctaDescStyle}>
                Join thousands of students accelerating their placement readiness with RoleReady.
              </p>

              <div style={ctaFeatureListStyle}>
                <div style={ctaFeatureItemStyle}>
                  <div style={ctaCheckIconStyle}>
                    <FaCheckCircle size={16} color="#5693C1" />
                  </div>
                  <span style={ctaFeatureTextStyle}>No credit card required</span>
                </div>
                <div style={ctaFeatureItemStyle}>
                  <div style={ctaCheckIconStyle}>
                    <FaCheckCircle size={16} color="#5693C1" />
                  </div>
                  <span style={ctaFeatureTextStyle}>Get results in 5 minutes</span>
                </div>
                <div style={ctaFeatureItemStyle}>
                  <div style={ctaCheckIconStyle}>
                    <FaCheckCircle size={16} color="#5693C1" />
                  </div>
                  <span style={ctaFeatureTextStyle}>100% personalized guidance</span>
                </div>
              </div>

              <button
                style={buttonStyle}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 12px 28px rgba(0, 0, 0, 0.18)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.12)';
                }}
              >
                Get Your Free Analysis
              </button>
            </div>
          </div>
        </div>

        {/* Process Visualization */}
        <div style={processVisualizationStyle}>
          <div style={processItemsContainerStyle}>
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div style={processItemStyle}>
                  <div style={processNumberStyle}>
                    {step.number}
                  </div>
                  <div style={processLabelStyle}>
                    {step.title.split(' ').slice(0, 2).join(' ')}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div style={arrowStyle}>
                    <div style={arrowHeadStyle} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinOurBusiness;

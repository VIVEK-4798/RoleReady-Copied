'use client';

import React from 'react';
import { FaGraduationCap, FaUserGraduate, FaSyncAlt, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';

const WhoIsItFor = () => {
  const themeColor = '#5693C1';
  const accentColors = ['#5693C1', '#4299E1', '#48BB78', '#ED8936'];

  const audienceCards = [
    {
      id: 1,
      icon: <FaGraduationCap size={32} />,
      title: "Final Year Students",
      description: "Maximize placement opportunities with precise readiness assessment and targeted preparation.",
      features: [
        "Campus placement optimization",
        "Role-specific gap analysis",
        "Interview readiness tracking"
      ],
      color: accentColors[0]
    },
    {
      id: 2,
      icon: <FaUserGraduate size={32} />,
      title: "Pre-Final Year Students",
      description: "Get ahead of the competition with early preparation and strategic skill development.",
      features: [
        "Early skill gap identification",
        "Long-term preparation roadmap",
        "Summer internship optimization"
      ],
      color: accentColors[1]
    },
    {
      id: 3,
      icon: <FaSyncAlt size={32} />,
      title: "Career Switchers",
      description: "Smooth transition to new roles with clear skill mapping and structured learning paths.",
      features: [
        "Cross-domain skill mapping",
        "Transition strategy planning",
        "Industry validation"
      ],
      color: accentColors[2]
    },
    {
      id: 4,
      icon: <FaChalkboardTeacher size={32} />,
      title: "Mentors & Educators",
      description: "Track student progress, provide targeted guidance, and improve placement outcomes.",
      features: [
        "Student progress monitoring",
        "Data-driven interventions",
        "Curriculum alignment insights"
      ],
      color: accentColors[3]
    }
  ];

  const stats = [
    { number: '85%', label: 'Final Year Students', color: themeColor },
    { number: '65%', label: 'Pre-Final Year Students', color: '#4299E1' },
    { number: '40%', label: 'Career Switchers', color: '#48BB78' },
    { number: '200+', label: 'Mentors & Educators', color: '#ED8936' }
  ];

  const sectionStyle = {
    padding: '120px 32px',
    background: 'linear-gradient(135deg, #f8fafb 0%, #ffffff 100%)',
    position: 'relative'
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '80px'
  };

  const titleStyle = {
    fontSize: '56px',
    fontWeight: '700',
    color: '#1a1a1a',
    marginBottom: '24px',
    lineHeight: '1.2',
    letterSpacing: '-0.5px'
  };

  const descriptionStyle = {
    fontSize: '18px',
    color: '#4b5563',
    maxWidth: '700px',
    margin: '0 auto',
    lineHeight: '1.7',
    fontWeight: '400'
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '32px',
    marginBottom: '80px',
    width: '100%'
  };

  const cardStyle = {
    padding: '40px 32px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden',
    background: '#ffffff',
    height: '100%',
    display: 'flex',
    flexDirection: 'column'
  };

  const iconBoxStyle = (color) => ({
    width: '80px',
    height: '80px',
    borderRadius: '50%',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    marginBottom: '32px',
    boxShadow: `0 8px 16px ${color}12`,
    transition: 'all 0.3s ease'
  });

  const cardTitleStyle = {
    fontSize: '24px',
    fontWeight: '600',
    color: '#1a1a1a',
    marginBottom: '16px',
    lineHeight: '1.3'
  };

  const cardDescriptionStyle = {
    fontSize: '15px',
    color: '#4b5563',
    marginBottom: '24px',
    lineHeight: '1.6'
  };

  const featureListStyle = {
    marginTop: '24px',
    flexGrow: 1
  };

  const featureItemStyle = {
    display: 'flex',
    alignItems: 'flex-start',
    marginBottom: '12px'
  };

  const featureDotStyle = (color) => ({
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: `${color}15`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    color: color,
    marginRight: '12px',
    flexShrink: 0,
    marginTop: '2px'
  });

  const featureTextStyle = {
    fontSize: '14px',
    color: '#4b5563',
    lineHeight: '1.5'
  };

  const buttonStyle = (color) => ({
    width: '100%',
    padding: '12px 16px',
    marginTop: 'auto',
    paddingTop: '24px',
    borderTop: '1px solid #f0f0f0',
    background: 'transparent',
    border: `2px solid ${color}`,
    color: color,
    fontSize: '15px',
    fontWeight: '600',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.3s ease'
  });

  const statsContainerStyle = {
    margin: '0 auto 80px',
    padding: '48px 40px',
    borderRadius: '20px',
    background: `linear-gradient(135deg, ${themeColor}08 0%, ${themeColor}04 100%)`,
    border: `1px solid ${themeColor}20`,
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    textAlign: 'center'
  };

  const statNumberStyle = (color) => ({
    fontSize: '48px',
    fontWeight: '700',
    color: color,
    marginBottom: '12px',
    lineHeight: '1'
  });

  const statLabelStyle = {
    fontSize: '15px',
    color: '#4b5563',
    fontWeight: '500',
    lineHeight: '1.5'
  };

  const ctaContainerStyle = {
    maxWidth: '800px',
    margin: '0 auto',
    textAlign: 'center'
  };

  const ctaDescriptionStyle = {
    fontSize: '16px',
    color: '#4b5563',
    marginBottom: '32px',
    lineHeight: '1.6'
  };

  const ctaButtonsStyle = {
    display: 'flex',
    gap: '20px',
    justifyContent: 'center',
    flexWrap: 'wrap'
  };

  const primaryButtonStyle = {
    padding: '16px 48px',
    height: '52px',
    fontSize: '16px',
    fontWeight: '600',
    background: themeColor,
    color: 'white',
    border: 'none',
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: `0 8px 24px ${themeColor}30`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  const secondaryButtonStyle = {
    padding: '16px 48px',
    height: '52px',
    fontSize: '16px',
    fontWeight: '600',
    background: 'transparent',
    color: themeColor,
    border: `2px solid ${themeColor}`,
    borderRadius: '10px',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  return (
    <section style={sectionStyle}>
      <div style={containerStyle}>
        {/* Header Section */}
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            Who Is It For?
          </h2>
          
          <p style={descriptionStyle}>
            RoleReady is designed for anyone serious about career advancement and placement success. From final-year students to career switchers, we have the tools you need.
          </p>
        </div>

        {/* Audience Cards - All in one line */}
        <div style={cardsGridStyle}>
          {audienceCards.map((card) => (
            <div
              key={card.id}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.boxShadow = `0 24px 48px rgba(0, 0, 0, 0.12)`;
                e.currentTarget.style.borderColor = card.color;
                const iconBox = e.currentTarget.querySelector('[data-icon-box]');
                if (iconBox) {
                  iconBox.style.transform = 'scale(1.1) rotateY(10deg)';
                  iconBox.style.boxShadow = `0 12px 32px ${card.color}25`;
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.borderColor = '#e5e7eb';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]');
                if (iconBox) {
                  iconBox.style.transform = 'scale(1)';
                  iconBox.style.boxShadow = `0 8px 16px ${card.color}12`;
                }
              }}
            >
              {/* Top accent line */}
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '3px',
                  background: `linear-gradient(90deg, ${card.color} 0%, ${card.color}40 100%)`
                }}
              />

              {/* Icon */}
              <div
                data-icon-box="true"
                style={iconBoxStyle(card.color)}
              >
                {card.icon}
              </div>

              {/* Title */}
              <h3 style={cardTitleStyle}>
                {card.title}
              </h3>

              {/* Description */}
              <p style={cardDescriptionStyle}>
                {card.description}
              </p>

              {/* Features List */}
              <div style={featureListStyle}>
                {card.features.map((feature, featureIndex) => (
                  <div key={featureIndex} style={featureItemStyle}>
                    <div style={featureDotStyle(card.color)}>
                      <FaArrowRight size={10} />
                    </div>
                    <span style={featureTextStyle}>{feature}</span>
                  </div>
                ))}
              </div>

              {/* Bottom CTA Button */}
              <button
                style={buttonStyle(card.color)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = card.color;
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.boxShadow = `0 8px 16px ${card.color}30`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = card.color;
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                Get Started
              </button>
            </div>
          ))}
        </div>

        {/* Stats Section - Arranged in specified order */}
        <div style={statsContainerStyle}>
          {stats.map((stat, index) => (
            <div key={index}>
              <div style={statNumberStyle(stat.color)}>{stat.number}</div>
              <div style={statLabelStyle}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Unified CTA */}
        <div style={ctaContainerStyle}>
          <p style={ctaDescriptionStyle}>
            No matter where you are in your career journey, RoleReady provides the clarity and structure you need to succeed.
          </p>
          
          <div style={ctaButtonsStyle}>
            <button
              style={primaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#427aa1';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 12px 32px ${themeColor}40`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = themeColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${themeColor}30`;
              }}
            >
              Start Your Free Assessment
            </button>
            
            <button
              style={secondaryButtonStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = themeColor;
                e.currentTarget.style.color = 'white';
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = `0 8px 24px ${themeColor}30`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = themeColor;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1400px) {
          .tw-scope > div {
            max-width: 1200px;
          }
          
          div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr);
          }
          
          div[style*="background: linear-gradient(135deg"] {
            grid-template-columns: repeat(2, 1fr);
          }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 60px 16px !important;
          }
          
          h2[style*="font-size: 56px"] {
            font-size: 36px !important;
          }
          
          p[style*="font-size: 18px"] {
            font-size: 16px !important;
          }
          
          div[style*="gridTemplateColumns: repeat(4, 1fr)"],
          div[style*="background: linear-gradient(135deg"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
          
          div[style*="padding: 40px 32px"] {
            padding: 32px 24px !important;
          }
          
          div[style*="width: 80px; height: 80px"] {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 24px !important;
          }
          
          h3[style*="font-size: 24px"] {
            font-size: 20px !important;
          }
          
          div[style*="font-size: 48px"] {
            font-size: 36px !important;
          }
          
          div[style*="display: flex; gap: 20px"] {
            flex-direction: column;
            align-items: center;
          }
          
          button[style*="padding: 16px 48px"] {
            width: 100% !important;
            max-width: 300px;
          }
        }
      `}</style>
    </section>
  );
};

export default WhoIsItFor;
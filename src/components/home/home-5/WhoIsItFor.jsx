import React from 'react';
import { FaGraduationCap, FaUserGraduate, FaSyncAlt, FaChalkboardTeacher, FaArrowRight } from 'react-icons/fa';

const WhoIsItFor = () => {
  const audienceCards = [
    {
      id: 1,
      icon: <FaGraduationCap size={28} />,
      title: "Final Year Students",
      description: "Maximize placement opportunities with precise readiness assessment and targeted preparation.",
      features: [
        "Campus placement optimization",
        "Role-specific gap analysis",
        "Interview readiness tracking"
      ],
      color: "#5693C1"
    },
    {
      id: 2,
      icon: <FaUserGraduate size={28} />,
      title: "Pre-Final Year Students",
      description: "Get ahead of the competition with early preparation and strategic skill development.",
      features: [
        "Early skill gap identification",
        "Long-term preparation roadmap",
        "Summer internship optimization"
      ],
      color: "#4299E1"
    },
    {
      id: 3,
      icon: <FaSyncAlt size={28} />,
      title: "Career Switchers",
      description: "Smooth transition to new roles with clear skill mapping and structured learning paths.",
      features: [
        "Cross-domain skill mapping",
        "Transition strategy planning",
        "Industry validation"
      ],
      color: "#48BB78"
    },
    {
      id: 4,
      icon: <FaChalkboardTeacher size={28} />,
      title: "Mentors & Educators",
      description: "Track student progress, provide targeted guidance, and improve placement outcomes.",
      features: [
        "Student progress monitoring",
        "Data-driven interventions",
        "Curriculum alignment insights"
      ],
      color: "#ED8936"
    }
  ];

  return (
    <section className="section pt-90 pb-90">
      <div className="container">
        {/* Header Section */}
        <div className="row justify-center text-center mb-60">
          <div className="col-xl-7 col-lg-9">
            <h2 
              className="text-40 lg:text-30 md:text-26 fw-700 text-dark-1 mb-20"
              data-aos="fade-up"
            >
              Who Is It For?
            </h2>
            
            <p 
              className="text-18 lg:text-16 text-dark-2"
              data-aos="fade-up"
              data-aos-delay="100"
              style={{
                maxWidth: '700px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}
            >
              RoleReady is designed for anyone serious about career advancement and placement success.
            </p>
          </div>
        </div>

        {/* Audience Cards */}
        <div className="row y-gap-30">
          {audienceCards.map((card, index) => (
            <div 
              key={card.id}
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-delay={200 + (index * 100)}
            >
              <div 
                className="h-100 p-30 rounded-12 border-1"
                style={{
                  borderColor: 'rgba(0, 0, 0, 0.08)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.borderColor = card.color;
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.08)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.08)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                {/* Top accent line */}
                <div 
                  className="absolute top-0 left-0 right-0 h-1"
                  style={{
                    background: `linear-gradient(90deg, ${card.color} 0%, ${card.color}80 100%)`,
                    opacity: 0.3
                  }}
                />

                {/* Icon */}
                <div 
                  className="d-flex justify-center items-center rounded-full mb-25"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: `${card.color}10`,
                    color: card.color,
                    marginTop: '10px'
                  }}
                >
                  {card.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-20 fw-600 text-dark-1 mb-15"
                  style={{ lineHeight: '1.3' }}
                >
                  {card.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-15 text-dark-2 mb-20"
                  style={{ lineHeight: '1.6' }}
                >
                  {card.description}
                </p>

                {/* Features List */}
                <div className="mt-25">
                  {card.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="d-flex items-center mb-10"
                    >
                      <div 
                        className="flex-shrink-0 mr-10 d-flex justify-center items-center rounded-full"
                        style={{
                          width: '20px',
                          height: '20px',
                          background: `${card.color}15`,
                          color: card.color
                        }}
                      >
                        <FaArrowRight size={10} />
                      </div>
                      <span className="text-14 text-dark-2">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Bottom CTA */}
                <div 
                  className="mt-25 pt-20 border-top"
                  style={{ borderColor: 'rgba(0, 0, 0, 0.05)' }}
                >
                  <button
                    className="button -sm -outline-dark-1 text-dark-1 fw-500 w-100"
                    style={{
                      borderColor: card.color,
                      color: card.color,
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = card.color;
                      e.target.style.color = 'white';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.color = card.color;
                    }}
                  >
                    Get Started
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats Section */}
        <div 
          className="row justify-center mt-60"
          data-aos="fade-up"
        >
          <div className="col-lg-10">
            <div 
              className="rounded-12 p-40"
              style={{
                background: 'linear-gradient(135deg, rgba(86, 147, 193, 0.02) 0%, rgba(86, 147, 193, 0.01) 100%)',
                border: '1px solid rgba(86, 147, 193, 0.1)'
              }}
            >
              <div className="row y-gap-20">
                <div className="col-md-3 col-sm-6 text-center">
                  <div className="text-36 fw-700 text-dark-1 mb-5">85%</div>
                  <div className="text-15 text-dark-2">Final Year Students</div>
                </div>
                <div className="col-md-3 col-sm-6 text-center">
                  <div className="text-36 fw-700 text-dark-1 mb-5">65%</div>
                  <div className="text-15 text-dark-2">Pre-Final Year Students</div>
                </div>
                <div className="col-md-3 col-sm-6 text-center">
                  <div className="text-36 fw-700 text-dark-1 mb-5">40%</div>
                  <div className="text-15 text-dark-2">Career Switchers</div>
                </div>
                <div className="col-md-3 col-sm-6 text-center">
                  <div className="text-36 fw-700 text-dark-1 mb-5">200+</div>
                  <div className="text-15 text-dark-2">Mentors & Educators</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Unified CTA */}
        <div 
          className="row justify-center mt-50"
          data-aos="fade-up"
          data-aos-delay="100"
        >
          <div className="col-lg-8 text-center">
            <p className="text-16 text-dark-2 mb-30" style={{ maxWidth: '500px', margin: '0 auto' }}>
              No matter where you are in your career journey, RoleReady provides the clarity and structure you need to succeed.
            </p>
            
            <div className="d-flex justify-center x-gap-15">
              <button
                className="button -md -blue-1 text-white fw-500 px-40"
                style={{
                  height: '48px',
                  fontSize: '15px',
                  background: '#5693C1',
                  border: 'none',
                  borderRadius: '8px'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#427aa1';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#5693C1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Start Your Free Assessment
              </button>
              
              <button
                className="button -md -outline-blue-1 text-blue-1 fw-500 px-40"
                style={{
                  height: '48px',
                  fontSize: '15px',
                  border: '2px solid #5693C1',
                  borderRadius: '8px',
                  background: 'transparent'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#5693C1';
                  e.currentTarget.style.color = 'white';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#5693C1';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
              >
                Schedule a Demo
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhoIsItFor;
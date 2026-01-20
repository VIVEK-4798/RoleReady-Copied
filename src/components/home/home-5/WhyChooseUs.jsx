import React from 'react';
import { FaSearch, FaBullseye, FaChartBar, FaRoad, FaUserCheck, FaCheckCircle, FaTimes } from 'react-icons/fa';

const WhyChooseUs = () => {
  const differences = [
    {
      id: 1,
      icon: <FaSearch size={22} />,
      title: "Not a Job Portal",
      text: "We don't just list jobs. We prepare you for them with precise readiness assessment before you even apply.",
    },
    {
      id: 2,
      icon: <FaBullseye size={22} />,
      title: "Focuses on Readiness, Not Applications",
      text: "Shift from quantity of applications to quality of preparation. Know exactly where you stand before applying.",
    },
    {
      id: 3,
      icon: <FaChartBar size={22} />,
      title: "Clear Explanations, Not Just Scores",
      text: "Get detailed breakdowns of why you scored what you did, with specific improvement areas and actionable insights.",
    },
    {
      id: 4,
      icon: <FaRoad size={22} />,
      title: "Structured Guidance, Not Guesswork",
      text: "Follow a personalized, step-by-step roadmap instead of random preparation. Every action has a purpose.",
    },
    {
      id: 5,
      icon: <FaUserCheck size={22} />,
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
    <section className="section pt-90 pb-90">
      <div className="container">
        {/* Header Section */}
        <div className="row justify-center text-center mb-60">
          <div className="col-xl-7 col-lg-9">
            <div className="d-flex justify-center mb-20">
              <div 
                className="rounded-8 px-20 py-8"
                style={{
                  background: 'rgba(86, 147, 193, 0.08)',
                  border: '1px solid rgba(86, 147, 193, 0.15)',
                  display: 'inline-block'
                }}
              >
                <span className="text-14 fw-600 text-blue-1">What Makes Us Different</span>
              </div>
            </div>
            
            <h2 
              className="text-40 lg:text-30 md:text-26 fw-700 text-dark-1 mb-20"
              data-aos="fade-up"
            >
              Why RoleReady?
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
              We're redefining placement preparation with a focus on readiness over resumes, 
              and clarity over confusion.
            </p>
          </div>
        </div>

        {/* Main Content - Two Columns */}
        <div className="row y-gap-50">
          {/* Left Column - Key Differentiators */}
          <div className="col-lg-6">
            <div 
              className="p-40 rounded-12"
              data-aos="fade-right"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                background: 'white',
                height: '100%'
              }}
            >
              <h3 className="text-24 fw-600 text-dark-1 mb-30">
                Our Core Differentiators
              </h3>
              
              <div className="y-gap-25">
                {differences.map((item, index) => (
                  <div 
                    key={item.id}
                    className="d-flex items-start"
                    data-aos="fade-right"
                    data-aos-delay={200 + (index * 50)}
                  >
                    <div 
                      className="flex-shrink-0 mr-20 d-flex justify-center items-center rounded-8"
                      style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(86, 147, 193, 0.08)',
                        color: '#5693C1'
                      }}
                    >
                      {item.icon}
                    </div>
                    
                    <div>
                      <h4 className="text-18 fw-600 text-dark-1 mb-5">
                        {item.title}
                      </h4>
                      <p className="text-15 text-dark-2" style={{ lineHeight: '1.6' }}>
                        {item.text}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Key Metric */}
              <div 
                className="mt-40 pt-30 border-top"
                style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
              >
                <div className="text-center">
                  <div className="text-32 fw-700 text-dark-1 mb-5">3x Higher</div>
                  <p className="text-15 text-dark-2">
                    interview conversion rate for students who use RoleReady vs traditional methods
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Comparison */}
          <div className="col-lg-6">
            <div 
              className="p-40 rounded-12"
              data-aos="fade-left"
              style={{
                border: '1px solid rgba(0, 0, 0, 0.08)',
                background: 'white',
                height: '100%'
              }}
            >
              <h3 className="text-24 fw-600 text-dark-1 mb-30">
                Traditional vs RoleReady
              </h3>
              
              <div className="mb-30">
                <div className="d-flex mb-15">
                  <div className="w-50">
                    <div className="text-14 fw-600 text-dark-1 mb-10">
                      Traditional Approach
                    </div>
                  </div>
                  <div className="w-50">
                    <div className="text-14 fw-600 text-dark-1 mb-10 text-right">
                      RoleReady
                    </div>
                  </div>
                </div>
                
                <div className="y-gap-20">
                  {comparisonPoints.map((item, index) => (
                    <div 
                      key={index}
                      className="d-flex items-center"
                      data-aos="fade-left"
                      data-aos-delay={200 + (index * 50)}
                    >
                      <div className="w-50 pr-15">
                        <div className="d-flex items-center">
                          <div className="mr-10">
                            <FaTimes size={14} color="#e53e3e" />
                          </div>
                          <p className="text-14 text-dark-2" style={{ lineHeight: '1.5' }}>
                            {item.traditional}
                          </p>
                        </div>
                      </div>
                      
                      <div className="w-50 pl-15">
                        <div className="d-flex items-center justify-end">
                          <p className="text-14 text-dark-1 fw-500 mr-10" style={{ lineHeight: '1.5' }}>
                            {item.roleready}
                          </p>
                          <div>
                            <FaCheckCircle size={14} color="#5693C1" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Stats Row */}
              <div 
                className="mt-40 pt-30 border-top"
                style={{ borderColor: 'rgba(0, 0, 0, 0.08)' }}
              >
                <div className="row y-gap-20">
                  <div className="col-4 text-center">
                    <div className="text-28 fw-700 text-dark-1 mb-5">10K+</div>
                    <div className="text-13 text-dark-2">Students</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-28 fw-700 text-dark-1 mb-5">92%</div>
                    <div className="text-13 text-dark-2">Satisfaction</div>
                  </div>
                  <div className="col-4 text-center">
                    <div className="text-28 fw-700 text-dark-1 mb-5">50+</div>
                    <div className="text-13 text-dark-2">Partners</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div 
          className="row justify-center mt-60"
          data-aos="fade-up"
        >
          <div className="col-lg-8">
            <div 
              className="text-center p-40 rounded-12"
              style={{
                background: 'linear-gradient(135deg, rgba(86, 147, 193, 0.03) 0%, rgba(86, 147, 193, 0.01) 100%)',
                border: '1px solid rgba(86, 147, 193, 0.1)'
              }}
            >
              <h3 className="text-24 fw-600 text-dark-1 mb-20">
                Experience the Difference Yourself
              </h3>
              
              <p className="text-16 text-dark-2 mb-30" style={{ maxWidth: '500px', margin: '0 auto' }}>
                See how RoleReady transforms your placement preparation in minutes.
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
                  Start Free Analysis
                </button>
                
                <button
                  className="button -md -outline-dark-1 text-dark-1 fw-500 px-40"
                  style={{
                    height: '48px',
                    fontSize: '15px',
                    border: '2px solid rgba(0, 0, 0, 0.2)',
                    borderRadius: '8px',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#5693C1';
                    e.currentTarget.style.color = '#5693C1';
                    e.currentTarget.style.transform = 'translateY(-2px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = 'rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.color = '#1a202c';
                    e.currentTarget.style.transform = 'translateY(0)';
                  }}
                >
                  View Demo
                </button>
              </div>
              
              <div className="mt-20">
                <p className="text-13 text-dark-3">
                  No credit card required • Takes 5 minutes • Get instant results
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;
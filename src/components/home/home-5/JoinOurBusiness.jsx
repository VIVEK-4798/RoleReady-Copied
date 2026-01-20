import React from 'react';
import { FaUpload, FaChartLine, FaClipboardCheck, FaRoad, FaUserCheck, FaCheckCircle } from 'react-icons/fa';

const steps = [
  {
    number: '01',
    icon: <FaUpload size={28} color="#5693C1" />,
    title: 'Upload Resume & Select Target Role',
    desc: 'Upload your resume and choose the specific role you want to target. Our AI analyzes your current profile against role requirements.',
    features: ['Resume parsing', 'Role matching', 'Company alignment'],
    color: '#5693C1',
    bgColor: 'rgba(86, 147, 193, 0.08)'
  },
  {
    number: '02',
    icon: <FaChartLine size={28} color="#5693C1" />,
    title: 'Skill Gap Analysis Based on Role Benchmarks',
    desc: 'Get a detailed breakdown of your strengths and weaknesses compared to industry benchmarks for your target role.',
    features: ['Technical skills gap', 'Soft skills assessment', 'Industry benchmark comparison'],
    color: '#5693C1',
    bgColor: 'rgba(86, 147, 193, 0.08)'
  },
  {
    number: '03',
    icon: <FaClipboardCheck size={28} color="#5693C1" />,
    title: 'Get a Readiness Score with Clear Explanation',
    desc: 'Receive a comprehensive readiness score with detailed explanations of what it means and how to improve.',
    features: ['Overall readiness score', 'Area-wise breakdown', 'Improvement priorities'],
    color: '#5693C1',
    bgColor: 'rgba(86, 147, 193, 0.08)'
  },
  {
    number: '04',
    icon: <FaRoad size={28} color="#5693C1" />,
    title: 'Follow a Personalized Improvement Roadmap',
    desc: 'Get a step-by-step roadmap with resources, timelines, and milestones to bridge your skill gaps effectively.',
    features: ['Weekly learning plan', 'Resource recommendations', 'Progress tracking'],
    color: '#5693C1',
    bgColor: 'rgba(86, 147, 193, 0.08)'
  },
  {
    number: '05',
    icon: <FaUserCheck size={28} color="#5693C1" />,
    title: 'Mentor Review & Validation',
    desc: 'Optional expert review from industry mentors to validate your progress and provide personalized guidance.',
    features: ['Expert feedback', 'Mock interviews', 'Career guidance'],
    color: '#5693C1',
    bgColor: 'rgba(86, 147, 193, 0.08)'
  }
];

const JoinOurBusiness = () => {
  return (
    <section className="section pt-90 pb-90">
      <div className="container">
        {/* Header Section */}
        <div className="row justify-center text-center mb-60">
          <div className="col-xl-8 col-lg-10">
            <h2 
              className="text-40 lg:text-30 md:text-26 fw-700 text-dark-1 mb-20"
              data-aos="fade-up"
              data-aos-delay="200"
            >
              How RoleReady Works
            </h2>
            <p 
              className="text-18 lg:text-16 text-dark-2"
              data-aos="fade-up"
              data-aos-delay="300"
              style={{
                maxWidth: '800px',
                margin: '0 auto',
                lineHeight: '1.7'
              }}
            >
              From resume upload to placement readiness, follow a clear 5-step process 
              that transforms uncertainty into actionable clarity.
            </p>
          </div>
        </div>

        {/* Steps Grid */}
        <div className="row y-gap-30">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-delay={400 + (index * 100)}
            >
              <div 
                className="cardImage -type-1 rounded-12 p-30"
                style={{
                  height: '100%',
                  border: '1px solid rgba(86, 147, 193, 0.15)',
                  background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(249, 250, 251, 0.9) 100%)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-8px)';
                  e.currentTarget.style.boxShadow = '0 20px 40px rgba(86, 147, 193, 0.12)';
                  e.currentTarget.style.borderColor = 'rgba(86, 147, 193, 0.3)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.05)';
                  e.currentTarget.style.borderColor = 'rgba(86, 147, 193, 0.15)';
                }}
              >
                {/* Step Number Badge */}
                <div 
                  className="absolute top-20 right-20"
                  style={{
                    fontSize: '14px',
                    fontWeight: '700',
                    color: step.color,
                    background: step.bgColor,
                    padding: '4px 12px',
                    borderRadius: '20px',
                    border: `1px solid ${step.color}20`
                  }}
                >
                  {step.number}
                </div>

                {/* Icon */}
                <div 
                  className="d-flex justify-center items-center rounded-full mb-25"
                  style={{
                    width: '70px',
                    height: '70px',
                    background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                    color: 'white',
                    marginTop: '10px'
                  }}
                >
                  {step.icon}
                </div>

                {/* Title */}
                <h3 
                  className="text-22 fw-600 text-dark-1 mb-15"
                  style={{ lineHeight: '1.3' }}
                >
                  {step.title}
                </h3>

                {/* Description */}
                <p 
                  className="text-16 text-dark-2 mb-20"
                  style={{ lineHeight: '1.6' }}
                >
                  {step.desc}
                </p>

                {/* Features List */}
                <div className="mt-20">
                  {step.features.map((feature, featureIndex) => (
                    <div 
                      key={featureIndex}
                      className="d-flex items-center mb-10"
                      style={{
                        padding: '8px 12px',
                        background: 'rgba(86, 147, 193, 0.04)',
                        borderRadius: '6px',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(86, 147, 193, 0.08)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'rgba(86, 147, 193, 0.04)';
                      }}
                    >
                      <FaCheckCircle 
                        size={14} 
                        color="#5693C1" 
                        className="mr-10" 
                        style={{ flexShrink: 0 }}
                      />
                      <span className="text-14 text-dark-2">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Decorative Bottom Line */}
                <div 
                  className="absolute bottom-0 left-0 right-0 h-3"
                  style={{
                    background: 'linear-gradient(90deg, rgba(86, 147, 193, 0.2) 0%, rgba(86, 147, 193, 0.8) 50%, rgba(86, 147, 193, 0.2) 100%)',
                    borderRadius: '0 0 12px 12px',
                    opacity: 0,
                    transition: 'opacity 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.opacity = '1';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.opacity = '0';
                  }}
                />
              </div>
            </div>
          ))}

          {/* Final CTA Card */}
          <div 
            className="col-lg-4 col-md-6"
            data-aos="fade-up"
            data-aos-delay="900"
          >
            <div 
              className="ctaCard -type-1 rounded-12 p-40"
              style={{
                height: '100%',
                background: 'linear-gradient(135deg, #5693C1 0%, #427aa1 100%)',
                color: 'white',
                position: 'relative',
                overflow: 'hidden'
              }}
            >
              <div 
                className="absolute top-0 right-0 opacity-10"
                style={{
                  width: '200px',
                  height: '200px',
                  background: 'radial-gradient(circle, white 0%, transparent 70%)'
                }}
              />
              
              <div className="relative z-1">
                <div className="d-flex justify-center items-center rounded-full mb-25 bg-white-20 p-20">
                  <FaCheckCircle size={40} color="white" />
                </div>
                
                <h3 className="text-22 fw-600 mb-15">
                  Start Your Journey Today
                </h3>
                
                <p className="text-16 mb-30" style={{ opacity: 0.9, lineHeight: '1.6' }}>
                  Join thousands of students who have transformed their placement journey with RoleReady.
                </p>

                <div className="d-flex flex-column y-gap-15 mb-30">
                  <div className="d-flex items-center">
                    <div className="bg-white rounded-full p-2 mr-10">
                      <FaCheckCircle size={12} color="#5693C1" />
                    </div>
                    <span className="text-14">No credit card required</span>
                  </div>
                  <div className="d-flex items-center">
                    <div className="bg-white rounded-full p-2 mr-10">
                      <FaCheckCircle size={12} color="#5693C1" />
                    </div>
                    <span className="text-14">Get results in minutes</span>
                  </div>
                  <div className="d-flex items-center">
                    <div className="bg-white rounded-full p-2 mr-10">
                      <FaCheckCircle size={12} color="#5693C1" />
                    </div>
                    <span className="text-14">Personalized guidance</span>
                  </div>
                </div>

                <button
                  className="button -md -blue-1 bg-white text-dark-1 fw-500 w-100"
                  style={{
                    height: '48px',
                    fontSize: '16px',
                    fontWeight: '600',
                    border: 'none',
                    borderRadius: '8px',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  Get Your Free Analysis
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Process Visualization (Optional) */}
        <div 
          className="row justify-center mt-60"
          data-aos="fade-up"
          data-aos-delay="1000"
        >
          <div className="col-lg-10">
            <div 
              className="rounded-12 p-30"
              style={{
                background: 'linear-gradient(135deg, rgba(86, 147, 193, 0.05) 0%, rgba(86, 147, 193, 0.02) 100%)',
                border: '1px solid rgba(86, 147, 193, 0.1)'
              }}
            >
              <div className="d-flex flex-wrap justify-center x-gap-30 y-gap-20">
                {steps.map((step, index) => (
                  <div key={index} className="d-flex items-center">
                    <div className="text-center">
                      <div 
                        className="rounded-full d-flex justify-center items-center mx-auto mb-10"
                        style={{
                          width: '50px',
                          height: '50px',
                          background: 'white',
                          border: `2px solid ${step.color}`,
                          color: step.color,
                          fontWeight: '600',
                          fontSize: '18px'
                        }}
                      >
                        {step.number}
                      </div>
                      <div 
                        className="text-14 fw-500 text-dark-1"
                        style={{ maxWidth: '120px', lineHeight: '1.3' }}
                      >
                        {step.title.split(' ')[0]} {step.title.split(' ')[1]}
                      </div>
                    </div>
                    {index < steps.length - 1 && (
                      <div 
                        className="ml-20"
                        style={{
                          width: '40px',
                          height: '2px',
                          background: 'rgba(86, 147, 193, 0.3)',
                          position: 'relative'
                        }}
                      >
                        <div 
                          className="absolute"
                          style={{
                            top: '-4px',
                            right: '-4px',
                            width: '10px',
                            height: '10px',
                            borderRight: '2px solid #5693C1',
                            borderTop: '2px solid #5693C1',
                            transform: 'rotate(45deg)'
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default JoinOurBusiness;
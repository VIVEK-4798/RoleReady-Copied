import React from 'react';
import { FaChartBar, FaCogs, FaBullhorn, FaUsers, FaBoxOpen, FaLightbulb } from 'react-icons/fa';

const features = [
  {
    icon: <FaChartBar size={36} color="#3b82f6" />,
    bgColor: '#e0f2fe',
    title: 'Discover New Startups',
    desc: 'Join and get access to a thriving community of business and investors.',
    btnText: 'Join Now',
    btnColor: '#3b82f6'
  },
  {
    icon: <FaCogs size={36} color="#22c55e" />,
    bgColor: '#d1fae5',
    title: 'Grow with Services',
    desc: 'Get professional services for your startup, from our network verified vendors.',
    btnText: 'Know More',
    btnColor: '#22c55e'
  },
  {
    icon: <FaBullhorn size={36} color="#facc15" />,
    bgColor: '#fef9c3',
    title: 'Promote Your Startup',
    desc: 'Post Jobs, Offers, Events, Blogs, Marketplace',
    btnText: 'Join Now',
    btnColor: '#facc15'
  },
  {
    icon: <FaUsers size={36} color="#60a5fa" />,
    bgColor: '#dbeafe',
    title: 'Expand your network',
    desc: 'Connect with other startups, investors, and advisors. Share ideas and collaborate.',
    btnText: 'Join Now',
    btnColor: '#3b82f6'
  },
  {
    icon: <FaBoxOpen size={36} color="#34d399" />,
    bgColor: '#d1fae5',
    title: 'Promote your products and services',
    desc: 'Promote to a niche audience of startups, investors, and advisors.',
    btnText: 'Know More',
    btnColor: '#22c55e'
  },
  {
    icon: <FaLightbulb size={36} color="#fde68a" />,
    bgColor: '#fef3c7',
    title: 'Access valuable resources and expertise',
    desc: 'Learn from experts to accelerate your startup’s growth.',
    btnText: 'Join Now',
    btnColor: '#facc15'
  }
];

const JoinOurBusiness = () => {
  return (
    <div style={{ padding: ' 16px', backgroundColor: 'white' }}>
      <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 'bold', marginBottom: '64px' }}>
        Join our Business Network & Win New Clients
      </h2>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '36px',
          maxWidth: '1200px',
          margin: '0 auto'
        }}
      >
        {features.map((feature, index) => (
          <div
            key={index}
            style={{
              backgroundColor: 'white',
              borderRadius: '12px',
              padding: '36px 32px', 
              minHeight: '360px',
              textAlign: 'center',
              transition: 'all 0.3s ease',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.15)';
              e.currentTarget.style.transform = 'scale(1.02)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
              e.currentTarget.style.transform = 'scale(1)';
            }}
          >
            <div
              style={{
                backgroundColor: feature.bgColor,
                borderRadius: '999px',
                width: '70px',
                height: '70px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                margin: '0 auto 16px auto'
              }}
            >
              {feature.icon}
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '10px' }}>{feature.title}</h3>
            <p style={{ fontSize: '18px', color: '#4b5563', marginBottom: '18px' }}>{feature.desc}</p>
            <button
              style={{
                fontSize: '18px',
                fontWeight: 'bold',
                color: 'white',
                backgroundColor: feature.btnColor,
                padding: '10px 18px',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer'
              }}
            >
              {feature.btnText}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JoinOurBusiness;

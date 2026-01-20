import { useEffect, useState } from 'react';

const AnimatedCounter = ({ target, duration = 2000, suffix = '' }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime;
    
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = (timestamp - startTime) / duration;
      
      if (progress < 1) {
        setCount(Math.floor(progress * target));
        requestAnimationFrame(animate);
      } else {
        setCount(target);
      }
    };

    requestAnimationFrame(animate);
  }, [target, duration]);

  return (
    <span>
      {count}
      {suffix}
    </span>
  );
};

const Counter2 = () => {
  const [inView, setInView] = useState(false);
  const themeColor = '#5693C1';

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
        }
      },
      { threshold: 0.1 }
    );

    const element = document.getElementById('counter-section');
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const problems = [
    {
      icon: '?',
      title: 'Blind Applications',
      description: 'Students apply without knowing if they\'re truly ready for the role or company requirements.',
    },
    {
      icon: '✖',
      title: 'Silent Rejections',
      description: 'Rejections come without meaningful feedback, leaving students clueless about what went wrong.',
    },
    {
      icon: '⚡',
      title: 'Hidden Skill Gaps',
      description: 'Critical skill gaps remain invisible, making improvement feel like a guessing game.',
    },
    {
      icon: '📊',
      title: 'Unstructured Efforts',
      description: 'Preparation becomes random and inefficient without a clear, personalized roadmap.',
    },
  ];

  const stats = [
    { value: 85, label: 'Students apply blindly', suffix: '%' },
    { value: 9, label: 'Get no feedback on rejections', suffix: '/10' },
    { value: 70, label: "Don't know their skill gaps", suffix: '%' },
  ];

  const sectionStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #f9fafb, #ffffff)',
    padding: '80px 32px',
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 16px',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '80px',
  };

  const titleStyle = {
    fontSize: '48px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '24px',
    lineHeight: '1.2',
  };

  const highlightStyle = {
    color: themeColor,
  };

  const descriptionStyle = {
    fontSize: '20px',
    color: '#374151',
    maxWidth: '768px',
    margin: '0 auto 32px',
    lineHeight: '1.6',
  };

  const dividerStyle = {
    height: '4px',
    width: '96px',
    margin: '0 auto',
    background: themeColor,
    borderRadius: '999px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '32px',
    marginBottom: '80px',
  };

  const cardStyle = {
    background: 'rgba(86, 147, 193, 0.08)',
    borderRadius: '12px',
    padding: '32px',
    border: '1px solid #e5e7eb',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textAlign: 'center',
  };

  const cardHoverStyle = {
    ...cardStyle,
    boxShadow: '0 20px 25px -5px rgba(86, 147, 193, 0.15)',
    transform: 'translateY(-8px)',
  };

  const iconBoxStyle = {
    width: '64px',
    height: '64px',
    borderRadius: '50%',
    background: themeColor,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 24px',
    fontSize: '32px',
    color: '#ffffff',
    boxShadow: '0 4px 6px -1px rgba(86, 147, 193, 0.2)',
    transition: 'transform 0.3s ease',
  };

  const cardTitleStyle = {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: '16px',
  };

  const accentLineStyle = {
    height: '3px',
    width: '48px',
    margin: '0 auto 16px',
    background: themeColor,
    borderRadius: '999px',
  };

  const cardDescriptionStyle = {
    fontSize: '16px',
    color: '#4b5563',
    lineHeight: '1.6',
  };

  const statsContainerStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    paddingTop: '64px',
    borderTop: '1px solid #d1d5db',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '48px',
  };

  const statItemStyle = {
    textAlign: 'center',
  };

  const statValueStyle = {
    fontSize: '56px',
    fontWeight: 'bold',
    color: themeColor,
    marginBottom: '12px',
    lineHeight: '1',
  };

  const statLabelStyle = {
    fontSize: '18px',
    color: '#4b5563',
    fontWeight: '500',
  };

  return (
    <section id="counter-section" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            The Problem <span style={highlightStyle}>Students</span> Face
          </h2>

          <p style={descriptionStyle}>
            Traditional placement preparation leaves students guessing about their readiness, leading to wasted applications and missed opportunities.
          </p>

          <div style={dividerStyle} />
        </div>

        <div style={gridStyle}>
          {problems.map((problem, index) => (
            <div
              key={index}
              style={cardStyle}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = '0 20px 25px -5px rgba(86, 147, 193, 0.15)';
                e.currentTarget.style.transform = 'translateY(-8px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              <div style={iconBoxStyle}>
                {problem.icon}
              </div>

              <h3 style={cardTitleStyle}>{problem.title}</h3>

              <div style={accentLineStyle} />

              <p style={cardDescriptionStyle}>{problem.description}</p>
            </div>
          ))}
        </div>

        <div style={statsContainerStyle}>
          <div style={statsGridStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statItemStyle}>
                <div style={statValueStyle}>
                  {inView ? <AnimatedCounter target={stat.value} duration={2500} suffix={stat.suffix} /> : `0${stat.suffix}`}
                </div>
                <div style={statLabelStyle}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Counter2;

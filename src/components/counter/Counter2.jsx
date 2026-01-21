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
  const accentColors = ['#4F46E5', '#0EA5E9', '#10B981', '#F59E0B'];

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
      color: accentColors[0]
    },
    {
      icon: '✖',
      title: 'Silent Rejections',
      description: 'Rejections come without meaningful feedback, leaving students clueless about what went wrong.',
      color: accentColors[1]
    },
    {
      icon: '⚡',
      title: 'Hidden Skill Gaps',
      description: 'Critical skill gaps remain invisible, making improvement feel like a guessing game.',
      color: accentColors[2]
    },
    {
      icon: '📊',
      title: 'Unstructured Efforts',
      description: 'Preparation becomes random and inefficient without a clear, personalized roadmap.',
      color: accentColors[3]
    },
  ];

  const stats = [
    { value: 85, label: 'Students apply blindly', suffix: '%', color: accentColors[0] },
    { value: 9, label: 'Get no feedback on rejections', suffix: '/10', color: accentColors[1] },
    { value: 70, label: "Don't know their skill gaps", suffix: '%', color: accentColors[2] },
  ];

  const sectionStyle = {
    position: 'relative',
    overflow: 'hidden',
    background: 'linear-gradient(to bottom, #F9FAFB, #FFFFFF)',
    padding: '96px 32px',
  };

  const containerStyle = {
    maxWidth: '1400px',
    margin: '0 auto',
    width: '100%',
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '96px',
  };

  const titleStyle = {
    fontSize: '64px',
    fontWeight: '800',
    color: '#111827',
    marginBottom: '24px',
    lineHeight: '1.1',
    letterSpacing: '-0.5px',
  };

  const highlightStyle = {
    color: themeColor,
  };

  const descriptionStyle = {
    fontSize: '22px',
    color: '#4B5563',
    maxWidth: '900px',
    margin: '0 auto 40px',
    lineHeight: '1.7',
    fontWeight: '400',
  };

  const dividerStyle = {
    height: '4px',
    width: '120px',
    margin: '0 auto',
    background: `linear-gradient(90deg, ${themeColor}, #A5B4FC)`,
    borderRadius: '999px',
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '40px',
    marginBottom: '96px',
  };

  const cardStyle = {
    background: '#FFFFFF',
    borderRadius: '20px',
    padding: '48px 32px',
    border: '1px solid #E5E7EB',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    textAlign: 'center',
    height: '100%',
  };

  const iconBoxStyle = (color) => ({
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    background: `linear-gradient(135deg, ${color}15, ${color}05)`,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '0 auto 32px',
    fontSize: '28px',
    color: color,
    border: `1px solid ${color}20`,
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
    transition: 'all 0.3s ease',
  });

  const cardTitleStyle = {
    fontSize: '24px',
    fontWeight: '700',
    color: '#111827',
    marginBottom: '20px',
    lineHeight: '1.3',
  };

  const accentLineStyle = (color) => ({
    height: '3px',
    width: '64px',
    margin: '0 auto 20px',
    background: color,
    borderRadius: '999px',
  });

  const cardDescriptionStyle = {
    fontSize: '17px',
    color: '#6B7280',
    lineHeight: '1.7',
  };

  const statsContainerStyle = {
    maxWidth: '1100px',
    margin: '0 auto',
    paddingTop: '80px',
    borderTop: '1px solid #E5E7EB',
  };

  const statsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '64px',
  };

  const statItemStyle = {
    textAlign: 'center',
  };

  const statValueStyle = (color) => ({
    fontSize: '72px',
    fontWeight: '800',
    color: color,
    marginBottom: '16px',
    lineHeight: '1',
    letterSpacing: '-1px',
  });

  const statLabelStyle = {
    fontSize: '20px',
    color: '#4B5563',
    fontWeight: '500',
    lineHeight: '1.5',
  };

  return (
    <section id="counter-section" style={sectionStyle}>
      <div style={containerStyle}>
        <div style={headerStyle}>
          <h2 style={titleStyle}>
            The Problem <span style={highlightStyle}>Students</span> Face Today
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
                e.currentTarget.style.boxShadow = '0 32px 48px -12px rgba(0, 0, 0, 0.12)';
                e.currentTarget.style.transform = 'translateY(-12px)';
                e.currentTarget.style.borderColor = problem.color + '40';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]');
                if (iconBox) {
                  iconBox.style.transform = 'scale(1.1)';
                  iconBox.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
                }
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.borderColor = '#E5E7EB';
                const iconBox = e.currentTarget.querySelector('[data-icon-box]');
                if (iconBox) {
                  iconBox.style.transform = 'scale(1)';
                  iconBox.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.05)';
                }
              }}
            >
              <div 
                data-icon-box="true"
                style={iconBoxStyle(problem.color)}
              >
                {problem.icon}
              </div>

              <h3 style={cardTitleStyle}>{problem.title}</h3>

              <div style={accentLineStyle(problem.color)} />

              <p style={cardDescriptionStyle}>{problem.description}</p>
            </div>
          ))}
        </div>

        <div style={statsContainerStyle}>
          <div style={statsGridStyle}>
            {stats.map((stat, index) => (
              <div key={index} style={statItemStyle}>
                <div style={statValueStyle(stat.color)}>
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

      <style jsx>{`
        @media (max-width: 1200px) {
          div[style*="gridTemplateColumns: repeat(4, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 32px !important;
          }
          
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(3, 1fr) !important;
            gap: 48px !important;
          }
          
          h2[style*="font-size: 64px"] {
            font-size: 48px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 20px !important;
          }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 64px 24px !important;
          }
          
          h2[style*="font-size: 64px"] {
            font-size: 36px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 18px !important;
            margin-bottom: 32px !important;
          }
          
          div[style*="gridTemplateColumns: repeat(4, 1fr)"],
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            gap: 32px !important;
          }
          
          div[style*="padding: 48px 32px"] {
            padding: 40px 24px !important;
          }
          
          div[style*="font-size: 72px"] {
            font-size: 56px !important;
          }
          
          div[style*="font-size: 20px"] {
            font-size: 18px !important;
          }
          
          div[style*="margin-bottom: 96px"] {
            margin-bottom: 64px !important;
          }
          
          div[style*="padding-top: 80px"] {
            padding-top: 64px !important;
          }
        }
        
        @media (max-width: 480px) {
          section {
            padding: 48px 16px !important;
          }
          
          h2[style*="font-size: 64px"] {
            font-size: 32px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 16px !important;
          }
          
          div[style*="width: 72px; height: 72px"] {
            width: 60px !important;
            height: 60px !important;
            margin-bottom: 24px !important;
          }
          
          h3[style*="font-size: 24px"] {
            font-size: 20px !important;
          }
          
          div[style*="font-size: 72px"] {
            font-size: 48px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Counter2;
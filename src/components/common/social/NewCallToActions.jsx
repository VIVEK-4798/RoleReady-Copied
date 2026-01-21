const NewCallToActions = () => {
  const primaryColor = '#5693C1';
  const primaryColorDark = '#427aa1';
  
  const scrollToExplanation = () => {
    // You can replace this with actual scroll logic
    const explanationSection = document.getElementById('explanation-section');
    if (explanationSection) {
      explanationSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section style={{
      padding: '120px 32px',
      background: 'linear-gradient(135deg, #f8fafb 0%, #ffffff 100%)',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Decorative elements */}
      <div style={{
        position: 'absolute',
        top: '-100px',
        right: '-100px',
        width: '400px',
        height: '400px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}15 0%, transparent 70%)`,
        zIndex: 1
      }}></div>
      
      <div style={{
        position: 'absolute',
        bottom: '-150px',
        left: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: `radial-gradient(circle, ${primaryColor}10 0%, transparent 70%)`,
        zIndex: 1
      }}></div>
      
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        position: 'relative',
        zIndex: 2,
        textAlign: 'center'
      }}>
        {/* Headline */}
        <h1 style={{
          fontSize: '64px',
          fontWeight: '800',
          color: '#111827',
          marginBottom: '24px',
          lineHeight: '1.1',
          letterSpacing: '-0.5px'
        }}>
          Start Preparing{' '}
          <span style={{
            color: primaryColor,
            position: 'relative',
            display: 'inline-block'
          }}>
            Smarter
            <span style={{
              position: 'absolute',
              bottom: '8px',
              left: '0',
              width: '100%',
              height: '12px',
              background: `${primaryColor}25`,
              borderRadius: '4px',
              zIndex: -1
            }}></span>
          </span>
          , Not Harder
        </h1>
        
        {/* Subtext */}
        <p style={{
          fontSize: '22px',
          color: '#4b5563',
          maxWidth: '700px',
          margin: '0 auto 60px auto',
          lineHeight: '1.7',
          fontWeight: '400'
        }}>
          Check your readiness, identify skill gaps, and get a clear improvement path before applying.
        </p>
        
        {/* Primary Actions */}
        <div style={{
          display: 'flex',
          gap: '24px',
          justifyContent: 'center',
          flexWrap: 'wrap',
          marginBottom: '80px'
        }}>
          {/* Primary Button */}
          <button
            style={{
              padding: '20px 48px',
              fontSize: '18px',
              fontWeight: '600',
              color: '#ffffff',
              background: primaryColor,
              border: 'none',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              boxShadow: `0 8px 24px ${primaryColor}40`,
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '260px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = primaryColorDark;
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 16px 32px ${primaryColor}40`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = primaryColor;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = `0 8px 24px ${primaryColor}40`;
            }}
            onClick={() => {
              // Add your navigation logic here
              window.location.href = '/signup';
            }}
          >
            Create Free Account
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M5 12h14M12 5l7 7-7 7"/>
            </svg>
          </button>
          
          {/* Secondary Button */}
          <button
            style={{
              padding: '20px 48px',
              fontSize: '18px',
              fontWeight: '600',
              color: primaryColor,
              background: 'transparent',
              border: `2px solid ${primaryColor}`,
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
              display: 'flex',
              alignItems: 'center',
              gap: '12px',
              minWidth: '260px'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = primaryColor;
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.transform = 'translateY(-4px)';
              e.currentTarget.style.boxShadow = `0 16px 32px ${primaryColor}20`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = primaryColor;
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = 'none';
            }}
            onClick={scrollToExplanation}
          >
            Explore How Readiness Works
            <svg 
              width="20" 
              height="20" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2"
              style={{
                transition: 'transform 0.3s ease'
              }}
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
          </button>
        </div>
        
        {/* Features Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '32px',
          maxWidth: '1000px',
          margin: '0 auto'
        }}>
          {/* Feature 1 */}
          <div style={{
            background: '#ffffff',
            padding: '32px 24px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = `0 12px 24px ${primaryColor}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
          }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: `${primaryColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: primaryColor
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px'
            }}>
              Check Readiness
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Instantly assess your current level for target roles
            </p>
          </div>
          
          {/* Feature 2 */}
          <div style={{
            background: '#ffffff',
            padding: '32px 24px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = `0 12px 24px ${primaryColor}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
          }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: `${primaryColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: primaryColor
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v10z"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px'
            }}>
              Identify Gaps
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Discover exact skills you need to improve
            </p>
          </div>
          
          {/* Feature 3 */}
          <div style={{
            background: '#ffffff',
            padding: '32px 24px',
            borderRadius: '16px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.04)',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-8px)';
            e.currentTarget.style.boxShadow = `0 12px 24px ${primaryColor}15`;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.04)';
          }}
          >
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '12px',
              background: `${primaryColor}15`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 24px auto',
              color: primaryColor
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                <polyline points="17 6 23 6 23 12"/>
              </svg>
            </div>
            <h3 style={{
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '12px'
            }}>
              Clear Path
            </h3>
            <p style={{
              fontSize: '15px',
              color: '#6b7280',
              lineHeight: '1.6'
            }}>
              Get personalized steps to reach your goals
            </p>
          </div>
        </div>
      </div>

      {/* Responsive Styles */}
      <style jsx>{`
        @media (max-width: 1024px) {
          h1[style*="font-size: 64px"] {
            font-size: 48px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 20px !important;
          }
          
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: repeat(2, 1fr) !important;
            gap: 24px !important;
          }
        }
        
        @media (max-width: 768px) {
          section {
            padding: 80px 24px !important;
          }
          
          h1[style*="font-size: 64px"] {
            font-size: 36px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 18px !important;
            margin-bottom: 48px !important;
          }
          
          div[style*="display: flex; gap: 24px"] {
            flex-direction: column;
            align-items: center;
          }
          
          div[style*="gridTemplateColumns: repeat(3, 1fr)"] {
            grid-template-columns: 1fr !important;
            max-width: 400px !important;
          }
          
          button[style*="min-width: 260px"] {
            width: 100%;
            max-width: 300px;
          }
        }
        
        @media (max-width: 480px) {
          section {
            padding: 64px 16px !important;
          }
          
          h1[style*="font-size: 64px"] {
            font-size: 32px !important;
          }
          
          p[style*="font-size: 22px"] {
            font-size: 16px !important;
          }
          
          div[style*="padding: 32px 24px"] {
            padding: 24px 20px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default NewCallToActions;
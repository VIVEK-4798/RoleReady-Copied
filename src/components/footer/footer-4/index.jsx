import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AppButton from "./AppButton";
import ContactInfo from "./ContactInfo";
import Copyright from "./Copyright";
import FooterContent from "./FooterContent";
import Social from "../../common/social/Social";
import Subscribe from "./Subscribe";
import InternshipJobTable from "./InternshipJobTable";

const index = () => {
  const [activeHighlight, setActiveHighlight] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveHighlight(prev => (prev + 1) % 4);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <footer style={{
      background: 'linear-gradient(135deg, #0d2444 0%, #1a3a6e 100%)',
      color: 'white',
      position: 'relative',
      overflow: 'hidden'
    }}>
      {/* Animated background elements */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: 'radial-gradient(circle at 20% 30%, rgba(86, 147, 193, 0.15) 0%, transparent 50%)',
        animation: 'pulse 15s infinite alternate'
      }} />

      <div style={{
        position: 'absolute',
        bottom: '-100px',
        right: '-100px',
        width: '300px',
        height: '300px',
        borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(86,147,193,0.1) 0%, rgba(86,147,193,0) 70%)',
        animation: 'float 8s infinite alternate'
      }} />

      <div style={{
        position: 'relative',
        zIndex: 2,
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '80px 20px 0'
      }}>
        {/* <InternshipJobTable /> */}

        <div style={{
          padding: '60px 0',
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '60px'
        }}>
          {/* Left Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            transition: 'all 0.5s ease',
            transform: activeHighlight === 0 ? 'translateY(-5px)' : 'none'
          }}>
            <div style={{ transition: 'transform 0.5s ease'}}>
              <img 
                src="/img/logo/logo_resized1.png" 
                alt="Startups 24×7 Logo" 
                style={{ height: '60px' }} 
              />
            </div>

            <ContactInfo />

            <div style={{ marginTop: '20px' }}>
              <h5 style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: '15px' }}>
                Your all-in-one startup platform
              </h5>
              <AppButton />
            </div>

            <div>
              <h5 style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: '15px' }}>
                Follow us on social media
              </h5>
              <Social />
            </div>
          </div>

          {/* Right Column */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '40px',
            transition: 'all 0.5s ease',
            transform: activeHighlight === 1 ? 'translateY(-5px)' : 'none'
          }}>
            <div>
              <h5 style={{ fontSize: '16px', fontWeight: '500', color: 'rgba(255,255,255,0.9)', marginBottom: '20px' }}>
                Get Updates & More
              </h5>
              <Subscribe />
            </div>

            <FooterContent />
          </div>
        </div>

        <Copyright />
      </div>

      {/* Animation styles */}
      <style jsx>{`
        @keyframes pulse {
          0% { opacity: 0.3; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.05); }
          100% { opacity: 0.3; transform: scale(1); }
        }
        @keyframes float {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
          100% { transform: translateY(0px); }
        }
      `}</style>
    </footer>
  );
};

export default index;

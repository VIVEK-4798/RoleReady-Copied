import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const ContactInfo = () => {
  const contactContent = [
    {
      id: 1,
      title: "Toll Free Customer Care",
      action: "tel:+(1) 9709009230",
      text: "+91 9709009230",
      icon: "icon-phone"
    },
    {
      id: 2,
      title: "Need live support?",
      action: "mailto:roleready@gmail.com",
      text: "roleready@gmail.com",
      icon: "icon-email"
    },
  ];

  return (
    <div style={{ display: 'grid', gap: '25px' }}>
      {contactContent.map((item) => (
        <div key={item.id} style={{ transition: 'all 0.3s ease' }}>
          <div style={{ 
            fontSize: '14px', 
            color: 'rgba(255,255,255,0.8)',
            marginBottom: '5px'
          }}>
            {item.title}
          </div>
          <a 
            href={item.action} 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              fontSize: '18px',
              fontWeight: '500',
              color: 'white',
              textDecoration: 'none',
              transition: 'all 0.3s ease',
              ':hover': {
                color: '#7ab3d7',
                transform: 'translateX(5px)'
              }
            }}
          >
            <i className={item.icon} style={{ fontSize: '20px' }} />
            {item.text}
          </a>
        </div>
      ))}
    </div>
  );
};

export default ContactInfo;
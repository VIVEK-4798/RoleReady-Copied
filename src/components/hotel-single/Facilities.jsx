import React from 'react';

const Facilities = ({ internship, job }) => {
  // Use either internship or job as the source of data
  const source = internship || job;

  const defaultResponsibilities = [
    { 
      id: 1, 
      icon: "bi-lightbulb", 
      title: "Creative thinking and problem-solving ability",
      color: "#6366f1" // Indigo
    },
    { 
      id: 2, 
      icon: "bi-chat", 
      title: "Excellent communication skills",
      color: "#10b981" // Emerald
    },
  ];

  const responsibilitiesFromDb = source?.responsibilities
    ? source.responsibilities.split(",").map((item, index) => ({
        id: index + 3,
        icon: "bi-check-circle", 
        title: item.trim(),
        color: "#ec4899" // Pink
      }))
    : [];

  const allResponsibilities = [...responsibilitiesFromDb, ...defaultResponsibilities];

  return (
    <section className="facilities-section" id="facilities">
      <div className="section-header">
        <h2 className="section-title">Key Skills & Responsibilities</h2>
        <p className="section-subtitle">Expectations for this role</p>
      </div>
      
      <div className="facilities-grid">
        {allResponsibilities.map((responsibility) => (
          <div className="facility-card" key={responsibility.id}>
            <div 
              className="facility-icon"
              style={{ 
                backgroundColor: `${responsibility.color}20`,
                color: responsibility.color
              }}
            >
              <i className={`bi ${responsibility.icon}`} />
            </div>
            <h3 className="facility-title">{responsibility.title}</h3>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Facilities;

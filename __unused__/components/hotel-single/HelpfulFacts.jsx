const HelpfulFacts = ({ internship, job }) => {
  // Determine the source data (job or internship)
  const source = internship || job;

  // Convert comma-separated perks to array with custom styling
  const dbPerks = source?.perks
    ? source.perks.split(',').map((perk, index) => ({
        id: `db-${index}`,
        icon: "bi-award", // Using award icon for database perks
        title: perk.trim(),
        color: "#6366f1", // Indigo
        highlight: true
      }))
    : [];

  // Default perks with different styling
  const defaultPerks = [
    {
      id: "default-1",
      icon: "bi-lightbulb",
      title: "Learning Opportunities",
      color: "#10b981", // Emerald
      highlight: false
    },
    {
      id: "default-2",
      icon: "bi-people",
      title: "Professional Networking",
      color: "#ec4899", // Pink
      highlight: false
    },
  ];

  const allPerks = [...dbPerks, ...defaultPerks];

  return (
    <div className="perks-section">
      <div className="section-header">
        <h2 className="section-title">Perks & Benefits</h2>
        <p className="section-subtitle">What you'll gain from this experience</p>
      </div>

      <div className="perks-grid">
        {allPerks.map((perk) => (
          <div 
            className={`perk-card ${perk.highlight ? 'highlight' : ''}`} 
            key={perk.id}
          >
            <div 
              className="perk-icon-container"
              style={{ 
                backgroundColor: `${perk.color}20`,
                color: perk.color
              }}
            >
              <i className={`bi ${perk.icon}`} />
            </div>
            <h3 className="perk-title">{perk.title}</h3>
            <div className="perk-hover-content">
              <p>Click to learn more about this benefit</p>
              <div className="perk-arrow">
                <i className="bi-arrow-right" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default HelpfulFacts;

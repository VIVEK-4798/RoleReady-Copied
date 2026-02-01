
const ImportantInfo = ({ jobs }) => {
  const defaultResponsibilities = [
    {
      text: "Collaborate effectively with team members",
      icon: "bi-people",
      color: "#3b82f6"
    },
    {
      text: "Demonstrate strong time management skills",
      icon: "bi-clock",
      color: "#10b981"
    },
    {
      text: "Maintain professionalism in all tasks",
      icon: "bi-briefcase",
      color: "#f59e0b"
    },
    {
      text: "Adapt quickly to project requirements",
      icon: "bi-arrow-repeat",
      color: "#8b5cf6"
    }
  ];

  const customResponsibilities = jobs?.responsibilities
    ? jobs.responsibilities.split(',').map((item) => ({
        text: item.trim(),
        icon: "bi-check-circle",
        color: "#ec4899"
      }))
    : [];

  return (
    <div className="responsibilities-container">
      <h3 className="section-title">Key Responsibilities</h3>
      <div className="responsibilities-grid">
        {[...customResponsibilities, ...defaultResponsibilities].map((item, index) => (
          <div className="responsibility-card" key={index}>
            <div 
              className="responsibility-icon"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}
            >
              <i className={`bi ${item.icon}`} />
            </div>
            <div className="responsibility-text">{item.text}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImportantInfo;

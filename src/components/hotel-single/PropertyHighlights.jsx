import "../../../public/sass/components/internshipsingle.scss";

const PropertyHighlights2 = ({ internship }) => {  
  const {
    city_name,
    region_name,
    duration_months,
    internship_type,
    work_detail,
    stipend,
    perks,
  } = internship;

  const highlightCards = [
    {
      title: "Internship Location",
      value: `${city_name || "Not specified"}${region_name ? `, ${region_name}` : ""}`,
      icon: "bi bi-geo-alt",
      color: "#3b82f6"
    },
    {
      title: "Duration",
      value: `${duration_months || "N/A"} month${duration_months !== 1 ? "s" : ""}`,
      icon: "bi bi-calendar",
      color: "#10b981"
    },
    {
      title: "Compensation",
      value: stipend === "0" ? "Unpaid" : `₹${stipend}/month`,
      icon: "bi bi-wallet2",
      color: "#f59e0b"
    },
    {
      title: "Work Details",
      value: work_detail || "Flexible working days",
      icon: "bi bi-clipboard",
      color: "#8b5cf6"
    },
    {
      title: "Schedule",
      value: internship_type || "Full-time",
      icon: "bi bi-clock",
      color: "#ec4899"
    },
    {
      title: "Perks & Benefits",
      value: perks?.split(",").join(", ") || "Certificate, Letter of recommendation",
      icon: "bi bi-gift",
      color: "#ef4444"
    },
  ];

  return (
    <div className="property-highlights-container">
      <h3 className="section-title">Internship Details</h3>
      <div className="highlight-cards-grid">
        {highlightCards.map((item, index) => (
          <div className="highlight-card" key={index}>
            <div className="card-icon" style={{ backgroundColor: `${item.color}20`, color: item.color }}>
              <i className={item.icon} />
            </div>
            <div className="card-content">
              <h4 className="card-title">{item.title}</h4>
              <p className="card-value">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PropertyHighlights2;
import "../../../public/sass/components/internshipsingle.scss";

const TourSnapShot = ({ job }) => {
  const {
    city_name,
    region_name,
    job_salary,
    job_type,
    work_detail,
    perks,
    work_experience,
  } = job;

  const highlightCards = [
    {
      title: "Job Location",
      value: `${city_name || "Not specified"}${region_name ? `, ${region_name}` : ""}`,
      icon: "bi bi-geo-alt",
      color: "#3b82f6"
    },
    {
      title: "Experience Required",
      value: `${work_experience || "0"} year${work_experience !== "1" ? "s" : ""}`,
      icon: "bi bi-person-workspace",
      color: "#10b981"
    },
    {
      title: "Salary",
      value: job_salary === "0" ? "Unpaid" : `₹${job_salary}/month`,
      icon: "bi bi-wallet2",
      color: "#f59e0b"
    },
    {
      title: "Work Details",
      value: work_detail || "Flexible schedule",
      icon: "bi bi-clipboard",
      color: "#8b5cf6"
    },
    {
      title: "Schedule",
      value: job_type || "Full-time",
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
      <h3 className="section-title">Job Highlights</h3>
      <div className="highlight-cards-grid">
        {highlightCards.map((item, index) => (
          <div className="highlight-card" key={index}>
            <div
              className="card-icon"
              style={{ backgroundColor: `${item.color}20`, color: item.color }}
            >
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

export default TourSnapShot;

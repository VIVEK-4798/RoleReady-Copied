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
      title: "Internship Location(s)",
      value: `${region_name || ""}, ${city_name || ""}`,
      icon: "bi bi-geo-alt",
    },
    {
      title: "Internship Duration",
      value: `${duration_months} months`,
      icon: "bi bi-calendar",
    },
    {
      title: "Internship Type",
      value: stipend === "0" ? "Unpaid" : "Paid",
      icon: "bi bi-wallet2",
    },
    {
      title: "Work Detail",
      value: work_detail || "Working Days: 5 Days",
      icon: "bi bi-clipboard",
    },
    {
      title: "Internship Type/Timing",
      value: `Type: Hybrid\nTiming: ${internship_type}`,
      icon: "bi bi-clock",
    },
    {
      title: "Perks",
      value: perks?.split(",").join("\n") || "None",
      icon: "bi bi-gift",
    },
  ];
  

  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px", paddingTop: "30px" }}>
      {highlightCards.map((item, index) => (
        <div key={index} style={{ width: "100%", maxWidth: "33.33%", boxSizing: "border-box", padding: "10px" }}>
          <div
            style={{
              backgroundColor: "#f8f9fa",
              borderRadius: "8px",
              padding: "20px",
              height: "100%",
              display: "flex",
              alignItems: "flex-start",
              gap: "15px",
            }}
          >
            <i className={item.icon} style={{ fontSize: "24px", color: "#007bff", marginTop: "5px" }} />
            <div>
              <div style={{ fontWeight: "bold", fontSize: "16px" }}>{item.title}</div>
              <div style={{ fontSize: "14px", marginTop: "5px", whiteSpace: "pre-line" }}>{item.value}</div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PropertyHighlights2;

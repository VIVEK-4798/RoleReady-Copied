const HelpfulFacts = ({ internship }) => {
  // Convert comma-separated perks to array (if needed)
  const dbPerks = internship?.perks
    ? internship.perks.split(',').map((perk, index) => ({
        id: index + 1,
        icon: "bi-gift", // Professional gift icon
        title: perk.trim(),
      }))
    : [];

  // Default perks (shown for all internships)
  const defaultPerks = [
    {
      id: dbPerks.length + 1,
      icon: "bi-lightbulb",
      title: "Learning Opportunities",
    },
    {
      id: dbPerks.length + 2,
      icon: "bi-people",
      title: "Professional Networking",
    },
  ];

  // Combine both
  const allPerks = [...dbPerks, ...defaultPerks];

  return (
    <>
      {allPerks.map((perk) => (
        <div className="col-lg-4 col-md-6" key={perk.id}>
          <div className="d-flex items-center mb-30">
            <i className={`${perk.icon} text-20 mr-10`}></i>
            <div className="text-16 fw-500">{perk.title}</div>
          </div>
        </div>
      ))}
    </>
  );
};

export default HelpfulFacts;

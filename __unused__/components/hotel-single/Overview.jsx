const Overview = ({ internship }) => {
  return (
    <div className="overview-container">
      <div className="section-header">
        <h3 className="section-title">Overview</h3>
      </div>

      <div className="overview-content">
        {/* Render venue_overview from the database if available */}
        {internship?.venue_overview && (
          <div
            className="custom-html-content"
            dangerouslySetInnerHTML={{ __html: internship.venue_overview }}
          />
        )}

        {/* Default overview content (always shown) */}
        <div className="overview-text">
          <p>
            Discover exciting internship opportunities designed to help you gain real-world experience and 
            develop industry-relevant skills. Whether you're a student or a recent graduate, our internships 
            offer hands-on learning, mentorship, and exposure to dynamic work environments across various domains.
          </p>
          
          <div className="feature-highlight">
            <div className="feature-icon">💼</div>
            <div className="feature-text">
              Work closely with experienced professionals and contribute to live projects
            </div>
          </div>
          
          <div className="feature-highlight">
            <div className="feature-icon">👨‍🏫</div>
            <div className="feature-text">
              Gain valuable mentorship and insights into workplace culture
            </div>
          </div>
          
          <div className="feature-highlight">
            <div className="feature-icon">✅</div>
            <div className="feature-text">
              All positions are verified with clear roles, duration, and stipend details
            </div>
          </div>
        </div>

        <button className="show-more-button">
          Show More Details
          <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M9 5L16 12L9 19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default Overview;
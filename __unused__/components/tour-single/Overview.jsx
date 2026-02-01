const Overview = ({ job }) => {
  return (
    <div className="overview-container">
      <div className="section-header">
        <h3 className="section-title">Overview</h3>
      </div>

      <div className="overview-content">
        {/* Render vendor_overview from database if available */}
        {job?.vendor_overview && (
          <div
            className="custom-html-content"
            dangerouslySetInnerHTML={{ __html: job.vendor_overview }}
          />
        )}

        {/* Default overview content (always shown) */}
        <div className="overview-text">
          <p>
            Explore career-defining job opportunities with top employers across
            industries. Our listed jobs are designed to match your expertise,
            interest, and ambitions. Whether you're a fresher or an experienced
            candidate, these roles provide structured growth and impactful work.
          </p>

          <div className="feature-highlight">
            <div className="feature-icon">💼</div>
            <div className="feature-text">
              Work on challenging projects and drive real business outcomes
            </div>
          </div>

          <div className="feature-highlight">
            <div className="feature-icon">👥</div>
            <div className="feature-text">
              Be part of collaborative teams and modern workplace cultures
            </div>
          </div>

          <div className="feature-highlight">
            <div className="feature-icon">📈</div>
            <div className="feature-text">
              Gain measurable growth with performance-driven reviews
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

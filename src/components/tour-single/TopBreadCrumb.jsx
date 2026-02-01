const TopBreadCrumb = ({ job }) => {
  return (
    <section className="breadcrumb-section">
      <div className="container">
        <div className="breadcrumb-content">
          <nav className="breadcrumb-nav" aria-label="breadcrumb">
            <ol className="breadcrumb-list">
              <li className="breadcrumb-item">
                <a href="/" className="breadcrumb-link">
                  <i className="bi bi-house-door"></i> Home
                </a>
              </li>
              <li className="breadcrumb-divider">
                <i className="bi bi-chevron-right"></i>
              </li>
              <li className="breadcrumb-item">
                <a href="/jobs" className="breadcrumb-link">Jobs</a>
              </li>
              <li className="breadcrumb-divider">
                <i className="bi bi-chevron-right"></i>
              </li>
              <li className="breadcrumb-item active" aria-current="page">
                {job.vendor_name}
              </li>
            </ol>
          </nav>

          <a href="/tour-list-v2" className="view-all-link">
            <i className="bi bi-grid"></i> View All Jobs
          </a>
        </div>
      </div>
    </section>
  );
};

export default TopBreadCrumb;
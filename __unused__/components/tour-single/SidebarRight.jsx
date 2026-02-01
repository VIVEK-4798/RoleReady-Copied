import FilterBox from "../../components/tour-single/filter-box";

const SidebarRight = ({ job }) => {
  return (
    <aside className="sidebar-right">
      <div className="sidebar-card">
        <div className="internship-details">
          {/* Salary */}
          <div className="detail-section stipend-section">
            <div className="detail-icon">
              <i className="bi bi-cash-stack"></i>
            </div>
            <div className="detail-content">
              <span className="detail-value">₹{job?.job_salary || 'Negotiable'}</span>
              <span className="detail-label">Monthly Salary</span>
            </div>
          </div>

          {/* Job Type */}
          <div className="detail-section">
            <div className="detail-icon">
              <i className="bi bi-briefcase"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Job Type</span>
              <span className="detail-value">{job?.job_type || 'Not specified'}</span>
            </div>
          </div>

          {/* Experience */}
          <div className="detail-section">
            <div className="detail-icon">
              <i className="bi bi-calendar-check"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Experience</span>
              <span className="detail-value">
                {job?.work_experience || '0'} year{job?.work_experience !== "1" ? "s" : ""}
              </span>
            </div>
          </div>

          {/* Work Details */}
          <div className="detail-section">
            <div className="detail-icon">
              <i className="bi bi-clipboard-check"></i>
            </div>
            <div className="detail-content">
              <span className="detail-label">Work Detail</span>
              <span className="detail-value">{job?.work_detail || 'Flexible schedule'}</span>
            </div>
          </div>
        </div>

          {/* FilterBox */}
          <div className="filter-box-container">
            <FilterBox />
          </div>
      </div>
    </aside>
  );
};

export default SidebarRight;

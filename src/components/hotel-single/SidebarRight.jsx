import { useState } from "react";
import ApplyNowModal from "./ApplyNowModal";

const SidebarRight = ({ internship }) => {
  const [showModal, setShowModal] = useState(false);

  return (
    <>
      <aside className="sidebar-right">
        <div className="sidebar-card">
          <div className="internship-details">
            {/* Stipend Section */}
            <div className="detail-section stipend-section">
              <div className="detail-icon">
                <i className="bi bi-cash-stack"></i>
              </div>
              <div className="detail-content">
                <span className="detail-value">₹{internship?.stipend || 'Negotiable'}</span>
                <span className="detail-label">Monthly Stipend</span>
              </div>
            </div>

            {/* Internship Type */}
            <div className="detail-section">
              <div className="detail-icon">
                <i className="bi bi-briefcase"></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">Internship Type</span>
                <span className="detail-value">{internship?.internship_type || 'Not specified'}</span>
              </div>
            </div>

            {/* Duration */}
            <div className="detail-section">
              <div className="detail-icon">
                <i className="bi bi-calendar"></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">Duration</span>
                <span className="detail-value">
                  {internship?.duration_months || 'N/A'} month
                  {internship?.duration_months !== 1 ? 's' : ''}
                </span>
              </div>
            </div>

            {/* Work Detail */}
            <div className="detail-section">
              <div className="detail-icon">
                <i className="bi bi-clipboard-check"></i>
              </div>
              <div className="detail-content">
                <span className="detail-label">Work Detail</span>
                <span className="detail-value">{internship?.work_detail || 'Flexible'}</span>
              </div>
            </div>
          </div>

          <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" onClick={() => setShowModal(true)}>
            Apply Now <i className="icon-arrow-right"></i>
          </button>
        </div>
      </aside>

      {/* Apply Now Modal */}
            <ApplyNowModal
        internship={internship}
        show={showModal}
        onClose={() => setShowModal(false)}
        type="venue"
        venueId={internship.venue_id}
      />
    </>
  );
};

export default SidebarRight;

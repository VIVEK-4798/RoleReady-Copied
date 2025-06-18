import React from "react";
import "../../../public/sass/components/internshipsingle.scss";

export default function GalleryOne({ internship }) {
  console.log("Internship Data:", internship);
  
  return (
    <section className="internship-header">
      <div className="container">
        <div className="header-container">
          <div className="header-content">
            <div className="badge-group">
              <span className="badge remote-badge">{internship.internship_type || "In Office"}</span>
              <span className="badge hiring-badge">
                <span className="lightning-icon">⚡</span> Actively Hiring
              </span>
            </div>

            <h1 className="internship-title">{internship.venue_name || "Internship"}</h1>

           <div className="company-info">
            <div className="company-logo">
              <img
                src={
                  internship.venue_images
                    ? JSON.parse(internship.venue_images)[0] 
                    : "https://via.placeholder.com/48" 
                }
                alt={internship.venue_name || "Company Logo"}
              />
            </div>
            <span className="company-name">{internship.venue_address || "In Office"}</span>
          </div>

            <div className="internship-meta">
              <div className="meta-item">
                <i className="icon-location"></i>
                <span>{internship.region_name}, {internship.state}</span>
              </div>
              <div className="meta-item">
                <i className="icon-calendar"></i>
                <span>Updated: Jun 18, 2025</span>
              </div>
              <div className="meta-item">
                <i className="icon-clock"></i>
                <span>13 Days Left to Apply</span>
              </div>
            </div>
          </div>

          <div className="header-stats">
            <div className="stat-item">
              <span className="stat-value">2.3K</span>
              <span className="stat-label">Applied</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">₹{internship.stipend || "In Office"}</span>
              <span className="stat-label">/Month</span>
            </div>
            <button className="apply-button">
              Apply Now <i className="icon-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

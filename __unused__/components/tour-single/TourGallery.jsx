import React, { useState } from "react";
import TourSnapShot from "./TourSnapShot";
import Overview from "./Overview";
import SidebarRight from "./SidebarRight";
import "../../../public/sass/components/jobtourSingleProp.scss";
import RatingTag from "../hotel-single/RatingTag";
import ApplyNowModal from "../hotel-single/ApplyNowModal";

const JobTourGallery = ({ job }) => {
  const [showModal, setShowModal] = useState(false);

  if (!job || Object.keys(job).length === 0) return null;
console.log("job.vendor_id for modal:", job);

  return (
    <>
      <section className="internship-header">
        <div className="container">
          <div className="header-container">
            <div className="header-content">
              <div className="badge-group">
                <span className="badge remote-badge">{job.job_type || "Full Time"}</span>
                <span className="badge hiring-badge">
                  <span className="lightning-icon">⚡</span> Actively Hiring
                </span>
              </div>

              <h1 className="internship-title">{job.vendor_name || "Job Title"}</h1>

              <div className="company-info">
                <div className="company-logo">
                  <img
                    src={job.portfolio ? JSON.parse(job.portfolio)[0] : "https://via.placeholder.com/48"}
                    alt={job.vendor_name || "Company Logo"}
                  />
                </div>
                <span className="company-name">{job.city_name || "City"}</span>
              </div>

              <div className="internship-meta">
                <div className="meta-item">
                  <i className="icon-location"></i>
                  <span>{job.region_name}, {job.country}</span>
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
                <span className="stat-value">1.2K</span>
                <span className="stat-label">Applied</span>
              </div>
              <div className="stat-item">
                <span className="stat-value">₹{job.job_salary || "N/A"}</span>
                <span className="stat-label">/Month</span>
              </div>
              <button className="apply-button" onClick={() => setShowModal(true)}>
                Apply Now <i className="icon-arrow-right"></i>
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <TourSnapShot job={job} />
              <Overview job={job} />
              <div className="col-12">
                <RatingTag />
              </div>
            </div>
            <div className="col-xl-4">
              <SidebarRight job={job} />
            </div>
          </div>
        </div>
      </section>

      <ApplyNowModal
  show={showModal}
  onClose={() => setShowModal(false)}
  type="vendor"
  venueId={null}
  service_reg_id={job.service_reg_id}
/>
    </>
  );
};

export default JobTourGallery;

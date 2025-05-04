import React, { useState, useRef, useEffect } from 'react';
import { Link } from "react-router-dom";
import NicheSection from './NicheSection ';
import StreaksSection from './StreaksSection';
import AboutPopupPage from './content/AboutPopupPage';
import ResumePopupPage from './content/ResumePopupPage';
import SkillsPopupPage from './content/SkillsPopupPage';
import ExperiencePopupPage from './content/ExperiencePopupPage';
import EducationPopupPage from './content/EducationPopupPage';
import CertificatePopupPage from './content/CertificatePopupPage';
import ProjectsPopupPage from './content/ProjectsPopupPage';
import { FaCoins } from 'react-icons/fa';

const ComingSoonPopup = ({ show, onClose }) => {
  const popupRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    if (show) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [show]);

  if (!show) return null;

  return (
    <div className="popup-main">
      <div
        ref={popupRef}
        className="popup-second"
      >
        <h2 className="text-xl font-semibold mb-4">Coming Soon</h2>
        <p className="text-gray-700 mb-6">This feature is coming soon!</p>
        <button
          onClick={onClose}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </div>
  );
};

// ProfileAbout Component
const ProfileAbout = () => {
  const [showPopup, setShowPopup] = useState(false);

  const handleHowItWorksClick = (e) => {
    e.preventDefault();
    setShowPopup(true);
  };

  return (
    <div className="row">
      <div className="col-lg-8 bg-white shadow">
        <AboutPopupPage />
        <hr className="border-t border-gray-100 mb-8" />

        <ResumePopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <SkillsPopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <ExperiencePopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <EducationPopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <CertificatePopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <ProjectsPopupPage />
        <hr className="border-t border-gray-300 mb-12" />

        <StreaksSection />
      </div>

      {/* Right Sidebar Cards */}
      <div className="col-lg-4">
        <NicheSection />

        <div className="bg-white shadow rounded p-3 mb-30">
          <h5 className="text-20 fw-600 mb-15">
            Rankings{" "}
            <Link to="#" onClick={handleHowItWorksClick} className="text-blue-1 text-12">
              How it works?
            </Link>
          </h5>
          <p>Total Points: 0</p>
          <p>Total Badges: 2</p>
        </div>

        <div className="bg-white shadow rounded p-3">
          <h5 className="text-20 fw-600 mb-15">
            Startups Coins{" "}
            <Link to="#" onClick={handleHowItWorksClick} className="text-blue-1 text-12">
              How it works?
            </Link>
          </h5>
          <div className="d-flex align-items-center gap-10">
            <FaCoins size={30} style={{ color: "#f5ae3d", marginRight: "10px" }} />
            <span className="fw-500 text-16">700 Coins</span>
          </div>
        </div>
      </div>

      {/* Coming Soon Popup */}
      <ComingSoonPopup show={showPopup} onClose={() => setShowPopup(false)} />
    </div>
  );
};

export default ProfileAbout;

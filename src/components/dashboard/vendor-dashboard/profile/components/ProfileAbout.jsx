import React from 'react';
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

const ProfileAbout = () => {
  
  return (
         <div className="row">
            <div className="col-lg-8 bg-white shadow">
                <AboutPopupPage/>
                <hr className="border-t border-gray-100 mb-8"/>

                <ResumePopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                <SkillsPopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                <ExperiencePopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                <EducationPopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                <CertificatePopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                <ProjectsPopupPage/>
                <hr className="border-t border-gray-300 mb-12"/>

                    <StreaksSection/>
                </div>
              {/* Right Sidebar Cards */}
              <div className="col-lg-4">
                <NicheSection/>

                <div className="bg-white shadow rounded p-3 mb-30">
                  <h5 className="text-20 fw-600 mb-15">Rankings <Link to="#" className="text-blue-1 text-12">How it works?</Link></h5>
                  <p>Total Points: 0</p>
                  <p>Total Badges: 2</p>
                </div>

                <div className="bg-white shadow rounded p-3">
                  <h5 className="text-20 fw-600 mb-15">Startups Coins <Link to="#" className="text-blue-1 text-12">How it works?</Link></h5>
                  <div className="d-flex align-items-center gap-10">
                    <img src="/img/dashboard/coin.svg" alt="coin" style={{ width: 30 }} />
                    <span className="fw-500 text-16">700 Coins</span>
                  </div>
                </div>
              </div>
            </div>
  )
}

export default ProfileAbout
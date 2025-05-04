import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import ProfileAbout from "./components/ProfileAbout";
import { Link } from "react-router-dom";
import Footer from "../common/Footer";
import ProfileHeader from "./components/ProfileHeader";

const index = () => {
  return (
    <>
      <div className="header-margin"></div>
      <Header />

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
          <div className="row y-gap-20 justify-between items-end pb-30 lg:pb-40 md:pb-32">
              <div className="col-12">
                {/* <h1 className="text-30 lh-14 fw-600">{dashboardTitle}</h1> */}
                <h1 className="text-30 lh-14 fw-600">User Profile</h1>
                <div className="text-15 text-light-1">
                  View and update your personal details, skills, resume, and more.
                </div>
              </div>
              {/* End .col-12 */}
            </div>
            {/* Top Profile Section */}
            <ProfileHeader/>

            {/* Editable Sections */}
            <ProfileAbout/>

            <Footer />
          </div>
        </div>
      </div>
    </>
  );
};

export default index;

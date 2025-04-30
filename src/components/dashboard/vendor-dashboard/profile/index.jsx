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

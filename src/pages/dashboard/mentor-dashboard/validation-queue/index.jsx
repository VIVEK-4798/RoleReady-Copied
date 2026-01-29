import React from "react";
import ValidationQueue from "@/components/dashboard/mentor-dashboard/validation-queue";
import Sidebar from "@/components/dashboard/mentor-dashboard/common/Sidebar";
import Header from "@/components/header/dashboard-header";
import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Skill Validation Queue || RoleReady - Mentor Dashboard",
  description: "Review and validate user skills as a mentor.",
};

export default function ValidationQueuePage() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>
      <Header />
      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
        </div>
        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            <div className="row y-gap-20 justify-between items-end pb-30">
              <div className="col-12">
                <ValidationQueue />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

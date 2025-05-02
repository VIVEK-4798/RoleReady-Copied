import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/instagram";
import LandingPage from "../../../../components/dashboard/mentor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Instagram",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function MentorInstagram() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

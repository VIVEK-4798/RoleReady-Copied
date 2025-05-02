import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/marketing-facebook";
import LandingPage from "../../../../components/dashboard/mentor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Startups24x7 | Discover & Grow Your Startup",
  description: "Startups24x7 - A complete platform to showcase, discover, and connect with innovative startups and services.",
};

export default function MentorMarketingFacebook() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

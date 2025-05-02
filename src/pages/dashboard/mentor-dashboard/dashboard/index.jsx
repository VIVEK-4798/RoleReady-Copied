import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/dashboard";
import LandingPage from "../../../../components/dashboard/mentor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Vendor Dashboard || Startups24x7 - Startup Discovery & Services Platform",
  description: "Startups24x7 - Manage your listings, bookings, and startup services all in one place.",
};

export default function MentorDashboard() {
  // const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const landingSteps = sessionStorage.getItem("landingSteps");

  // useEffect(() => {
  //   const user = sessionStorage.getItem("user");
  //   if (mentor) navigate("/mentor-dashboard/dashboard");
  // }, []);
  
  return (
    <>
      <MetaComponent meta={metadata} />
      {!landingSteps && <LandingPage />}
      {landingSteps && <DashboardPage />}
    </>
  );
}

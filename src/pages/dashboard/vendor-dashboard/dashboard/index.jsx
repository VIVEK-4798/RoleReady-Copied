import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/dashboard";
import LandingPage from "../../../../components/dashboard/vendor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Vendor Dashboard || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function VendorDashboard() {
  // const navigate = useNavigate();
  const user = sessionStorage.getItem("user");
  const landingSteps = sessionStorage.getItem("landingSteps");
  // useEffect(() => {
  //   const user = sessionStorage.getItem("user");
  //   // if (user) navigate("/vendor-dashboard/dashboard");
  // }, []);
  return (
    <>
      <MetaComponent meta={metadata} />
      {!landingSteps && <LandingPage />}
      {landingSteps && <DashboardPage />}
    </>
  );
}

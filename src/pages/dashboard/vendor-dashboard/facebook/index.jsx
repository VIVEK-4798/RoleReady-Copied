import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/facebook";
import LandingPage from "../../../../components/dashboard/vendor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Facebook",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function VendorFacebook() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

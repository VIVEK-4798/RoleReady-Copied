import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/marketing-facebook";
import LandingPage from "../../../../components/dashboard/vendor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Facebook Marketing",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function VendorMarketingFacebook() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

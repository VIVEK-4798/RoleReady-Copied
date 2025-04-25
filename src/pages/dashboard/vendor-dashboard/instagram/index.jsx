import React from "react";
import DashboardPage from "../../../../components/dashboard/vendor-dashboard/instagram";
import LandingPage from "../../../../components/dashboard/vendor-dashboard/landing-page";

import MetaComponent from "@/components/common/MetaComponent";
import { useNavigate } from "react-router-dom";

const metadata = {
  title: "Instagram",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function VendorInstagram() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

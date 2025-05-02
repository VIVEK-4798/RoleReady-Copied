import React from "react";
import DashboardPage from "../../../../components/dashboard/mentor-dashboard/marketing-google";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Google Marketing",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function MentorMarketingGoogle() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <DashboardPage />
    </>
  );
}

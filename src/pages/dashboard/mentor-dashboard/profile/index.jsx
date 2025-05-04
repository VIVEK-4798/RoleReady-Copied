import React from "react";
import Profile from "../../../../components/dashboard/mentor-dashboard/profile";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Mentor Dashboard || Startup24x7 - Travel & Tour ReactJs Template",
  description: "Startup24x7 - Travel & Tour ReactJs Template",
};

export default function MentorMarketingOverview() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Profile />
    </>
  );
}

import React from "react";
import Profile from "../../../../components/dashboard/vendor-dashboard/profile";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "RoleReady | Placement Readiness",
  description: "Check your placement readiness and skill gaps."
};

export default function VendorMarketingOverview() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <Profile />
    </>
  );
}

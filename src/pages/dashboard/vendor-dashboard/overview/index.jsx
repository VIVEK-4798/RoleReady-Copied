import React from "react";
import MarketingOverview from "../../../../components/dashboard/vendor-dashboard/marketing-overview";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Vendor Dashboard || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

export default function VendorMarketingOverview() {
  return (
    <>
      <MetaComponent meta={metadata} />
      <MarketingOverview />
    </>
  );
}

import React from "react";
import CallToActions from "@/components/common/CallToActions";
import DefaultHeader from "@/components/header/default-header";
// import LocationTopBar from "@/components/common/LocationTopBar";
import DefaultFooter from "@/components/footer/default";

import MetaComponent from "@/components/common/MetaComponent";
import PricingComponent from "@/components/pricing/Pricing";

const metadata = {
  title: "Pricing || GoTrip - Travel & Tour ReactJs Template",
  description: "Webeazzy - Travel & Tour ReactJs Template",
};

const Pricing = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      <div className="header-margin"></div>
      {/* header top margin */}

      <DefaultHeader />
      {/* End Header 1 */}

      {/* <LocationTopBar /> */}
      {/* End location top bar section */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h1 className="sectionTitle__title text-60">
                  Start website for free. Upgrade whenever
                </h1>
                {/* <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Lorem ipsum is placeholder text commonly used in site.
                </p> */}
              </div>
            </div>
          </div>
          <PricingComponent />
        </div>
      </section>

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
      {/* End Call To Actions Section */}
    </>
  );
};

export default Pricing;

import CallToActions from "@/components/common/CallToActions";
import Header11 from "@/components/header/header-11";
import DefaultFooter from "@/components/footer/default";
import MainFilterSearchBox from "@/components/hotel-list/hotel-list-v4/MainFilterSearchBox";
import TopHeaderFilter from "@/components/hotel-list/hotel-list-v4/TopHeaderFilter";
import Pagination from "@/components/hotel-list/common/Pagination";
import Sidebar from "@/components/hotel-list/hotel-list-v4/Sidebar";
import HotelProperties from "@/components/hotel-list/hotel-list-v4/HotelProperties";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Hotel List v5 || GoTrip - Travel & Tour ReactJs Template",
  description: "GoTrip - Travel & Tour ReactJs Template",
};

const HotelListPage4 = () => {

  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      <div className="header-margin"></div>
      {/* header top margin */}

      <Header11 />
      {/* End Header 1 */}

      <section className="pt-40 pb-40 bg-blue-2">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="text-center">
              <h1 className="text-30 fw-600">Explore Top Internship Opportunities</h1>
              </div>
              {/* End text-center */}
              <MainFilterSearchBox />
            </div>
            {/* End col-12 */}
          </div>
        </div>
      </section>
      {/* Top SearchBanner */}

      <section className="layout-pt-md layout-pb-lg">
  <div className="container">
    <div className="row y-gap-30">
      {/* Sidebar removed — no col-xl-3 */}

      <div className="col-12">
        <TopHeaderFilter />
        <div className="mt-30"></div>
        {/* End mt--30 */}
        <div className="row y-gap-30">
          <HotelProperties />
        </div>
        {/* End .row */}
        <Pagination />
      </div>
      {/* End full-width content */}
    </div>
    {/* End .row */}
  </div>
  {/* End .container */}
</section>

      {/* End layout for listing sidebar and content */}

      <CallToActions />
      {/* End Call To Actions Section */}

      <DefaultFooter />
    </>
  );
};

export default HotelListPage4;

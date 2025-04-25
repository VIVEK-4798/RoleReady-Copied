import DashboardCard from "./components/DashboardCard";
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import ChartSelect from "./components/ChartSelect";
import ChartMain from "./components/ChartMain";
import { Link } from "react-router-dom";
import RercentBooking from "./components/RercentBooking";
import Footer from "../common/Footer";
import Steps from "./components/Steps";

const index = () => {
  return (
    <>
      {/*  */}
      {/* End Page Title */}

      <div className="header-margin"></div>

      <Header />
      {/* End dashboard-header */}

      <div className="dashboard">
        <div className="dashboard__sidebar bg-white scroll-bar-1">
          <Sidebar />
          {/* End sidebar */}
        </div>
        {/* End dashboard__sidebar */}

        <div className="dashboard__main">
          <div className="dashboard__content bg-light-2">
            {/* <DashboardCard /> */}

            <div className="row y-gap-30 pt-10 chart_responsive">
              <div className="col-xl-7 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <div className="col-12">
                      <h1 className="text-30 lh-14 fw-normal">
                        Complete your website setup
                      </h1>
                      <div className="text-15 text-light-1">
                        Use high quality images and product descriptions to have
                        a great looking product page. Let's get started.
                      </div>
                    </div>
                    {/* <ChartSelect /> */}
                  </div>

                  <div className="pt-30">
                    <Steps />
                    {/* <ChartMain /> */}
                  </div>
                </div>
              </div>


              {/* <div className="col-xl-5 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">Recent Bookings</h2>
                    <div>
                      <Link
                        to="#"
                        className="text-14 text-blue-1 fw-500 underline"
                      >
                        View All
                      </Link>
                    </div>
                  </div>

                  <RercentBooking />
                </div>
              </div> */}
              {/* End .col */}
            </div>
            {/* End .row */}

            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
    </>
  );
};

export default index;

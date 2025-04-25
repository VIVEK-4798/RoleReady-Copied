import DashboardCard from "./components/DashboardCard";
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import ChartSelect from "./components/ChartSelect";
import ChartMain from "./components/ChartMain";
import { Link } from "react-router-dom";
import RercentBooking from "./components/RercentBooking";
import Footer from "../common/Footer";
import AnalyzeCards from "./components/AnalyzeCards";

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
            <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
              <div className="col-12">
                <h1 className="text-30 lh-14 fw-600">Advertise on Google</h1>
                {/* <div className="text-15 text-light-1">
                  Every product needs a customer.Use the best marketing
                  practices to acquire new customers, raise the average order
                  value, and keep buyers coming back for more again and again.
                </div> */}
              </div>
              {/* End .col-12 */}
            </div>
            {/* End .row */}

            <div className="row mb-60">
              <div className="col-3">
                <h1 className="text-18 lh-14 fw-600">Get more users</h1>
                <p className="text-14 text-light-1">
                  Start an advertising campaign to reach your target audience
                  and get more traffic into your store.
                </p>
              </div>
              <div className="col-9">
                <DashboardCard />
              </div>
            </div>

            <div className="row ">
              <div className="col-3">
                <h1 className="text-18 lh-14 fw-600">Reach more people</h1>
                <p className="text-14 text-light-1">
                  Globally reach more people with your brand advertising.
                </p>
              </div>
              <div className="col-9">
                <AnalyzeCards />
              </div>
            </div>

            <div style={{ height: "50vh" }}></div>

            {/* <div className="row y-gap-30 pt-20 chart_responsive">
              <div className="col-xl-7 col-md-6">
                <div className="py-30 px-30 rounded-4 bg-white shadow-3">
                  <div className="d-flex justify-between items-center">
                    <h2 className="text-18 lh-1 fw-500">Earning Statistics</h2>
                    <ChartSelect />
                  </div>

                  <div className="pt-30">
                    <ChartMain />
                  </div>
                </div>
              </div>

              <div className="col-xl-5 col-md-6">
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
              </div>
            </div> */}

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

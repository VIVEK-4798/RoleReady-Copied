import Aos from "aos";
import { useEffect, useState } from "react";
import SrollTop from "./components/common/ScrollTop";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css/scrollbar";
import "swiper/css/effect-cards";
import "aos/dist/aos.css";
import "./styles/index.scss";
import { Provider } from "react-redux";
import { store } from "./store/store";

if (typeof window !== "undefined") {
  import("bootstrap");
}
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import ScrollTopBehaviour from "./components/common/ScrollTopBehaviour";
import Home from "./pages";
import Home_1 from "./pages/homes/home_1";
import Home_2 from "./pages/homes/home_2";
import Home_3 from "./pages/homes/home_3";
import Home_4 from "./pages/homes/home_4";
import Home_5 from "./pages/homes/home_5";
import Home_6 from "./pages/homes/home_6";
import Home_7 from "./pages/homes/home_7";
import Home_8 from "./pages/homes/home_8";
import Home_9 from "./pages/homes/home_9";
import Home_10 from "./pages/homes/home_10";
import BlogListV1 from "./pages/blogs/blog-list-v1";
import BlogListV2 from "./pages/blogs/blog-list-v2";
import BlogSingleDynamic from "./pages/blogs/blog-details";
import NotFoundPage from "./pages/not-found";
import About from "./pages/others/about";
import BecomeExpert from "./pages/others/become-expert";
import HelpCenter from "./pages/others/help-center";
import LogIn from "./pages/others/login";
import SignUp from "./pages/others/signup";
import Terms from "./pages/others/terms";
import Invoice from "./pages/others/invoice";
import AdminDashboard from "./pages/dashboard/admin-dashboard/dashboard";
import AdminBooking from "./pages/dashboard/admin-dashboard/booking";
import ClaimedBusiness from "./pages/dashboard/admin-dashboard/claim-business";
import City from "./pages/dashboard/admin-dashboard/city";
import Service from "./pages/dashboard/admin-dashboard/services";
import Regions from "./pages/dashboard/admin-dashboard/region";
import Category from "./pages/dashboard/admin-dashboard/category";
import Users from "./pages/dashboard/admin-dashboard/users";
import AdminAddUser from "./pages/dashboard/admin-dashboard/add-user";
import Venue from "./pages/dashboard/admin-dashboard/venue";
import AdminAddVenue from "./pages/dashboard/admin-dashboard/add-venue";
import AdminAddVendor from "./pages/dashboard/admin-dashboard/add-vendor";
import Vendors from "./pages/dashboard/admin-dashboard/vendors";
import Packages from "./pages/dashboard/admin-dashboard/packages";
import Email from "./pages/dashboard/admin-dashboard/email";
import DBDashboard from "./pages/dashboard/dashboard/db-dashboard";
import DBBooking from "./pages/dashboard/dashboard/db-booking";
import DBWishlist from "./pages/dashboard/dashboard/db-wishlist";
import DBSettings from "./pages/dashboard/dashboard/db-settings";
import VendorAddHotel from "./pages/dashboard/vendor-dashboard/add-hotel";
import VendorBooking from "./pages/dashboard/vendor-dashboard/booking";
import MentorBooking from "./pages/dashboard/mentor-dashboard/booking";
import BVVendorHotel from "./pages/dashboard/vendor-dashboard/hotels";
import BDVendorRecovery from "./pages/dashboard/vendor-dashboard/recovery";
import VendorDashboard from "./pages/dashboard/vendor-dashboard/dashboard";
import MentorDashboard from "./pages/dashboard/mentor-dashboard/dashboard";
import MentorProfile from "./pages/dashboard/mentor-dashboard/profile";
import VendorProfile from "./pages/dashboard/vendor-dashboard/profile";
import HotelListPage1 from "./pages/hotel/hotel-list-v1";
import HotelListPage2 from "./pages/hotel/hotel-list-v2";
import HotelListPage3 from "./pages/hotel/hotel-list-v3";
import HotelListPage4 from "./pages/hotel/hotel-list-v4";
import HotelListPage5 from "./pages/hotel/hotel-list-v5";
import HotelSingleV1Dynamic from "./pages/hotel/hotel-single-v1";
import HotelSingleV2Dynamic from "./pages/hotel/hotel-single-v2";
import BookingPage from "./pages/hotel/booking-page";
import TourListPage1 from "./pages/tour/tour-list-v1";
import TourListPage2 from "./pages/tour/tour-list-v2";
import TourListPage3 from "./pages/tour/tour-list-v3";
import TourSingleV1Dynamic from "./pages/tour/tour-single";
import ActivityListPage1 from "./pages/activity/activity-list-v1";
import ActivityListPage2 from "./pages/activity/activity-list-v2";
import ActivityListPage3 from "./pages/activity/activity-list-v3";
import ActivitySingleV1Dynamic from "./pages/activity/activity-single";
import RentalListPage1 from "./pages/rental/rental-list-v1";
import RentalListPage2 from "./pages/rental/rental-list-v2";
import RentalListPage3 from "./pages/rental/rental-list-v3";
import RentalSingleV1Dynamic from "./pages/rental/rental-single";
import CarListPage1 from "./pages/car/car-list-v1";
import CarListPage2 from "./pages/car/car-list-v2";
import CarListPage3 from "./pages/car/car-list-v3";
import CarSingleV1Dynamic from "./pages/car/car-single";
import CruiseListPage1 from "./pages/cruise/cruise-list-v1";
import CruiseListPage2 from "./pages/cruise/cruise-list-v2";
import CruiseListPage3 from "./pages/cruise/cruise-list-v3";
import CruiseSingleV1Dynamic from "./pages/cruise/cruise-single";
import FlightListPage1 from "./pages/flight/flight-list-v1";
import Contact from "./pages/others/contact";
import Destinations from "./pages/others/destinations";
import Pricing from "./pages/pricing";
import CollegeTPO from "./pages/collegeTPO";
import VendorMarketingOverview from "./pages/dashboard/vendor-dashboard/overview";
import MentorMarketingOverview from "./pages/dashboard/mentor-dashboard/overview";
import VendorMarketingGoogle from "./pages/dashboard/vendor-dashboard/marketing-google";
import MentorMarketingGoogle from "./pages/dashboard/mentor-dashboard/marketing-google";
import VendorMarketingFacebook from "./pages/dashboard/vendor-dashboard/marketing-facebook";
import MentorMarketingFacebook from "./pages/dashboard/mentor-dashboard/marketing-facebook";
import VendorFacebook from "./pages/dashboard/vendor-dashboard/facebook";
import MentorFacebook from "./pages/dashboard/mentor-dashboard/facebook";
import VendorInstagram from "./pages/dashboard/vendor-dashboard/instagram";
import MentorInstagram from "./pages/dashboard/mentor-dashboard/instagram";
import VendorWebpage from "./pages/dashboard/vendor-dashboard/webpage";
import MentorWebpage from "./pages/dashboard/mentor-dashboard/webpage";
import MentorAddVenue from "./pages/dashboard/mentor-dashboard/add-venue";
import MentorAddVendor from "./pages/dashboard/mentor-dashboard/add-vendor";
import MentorVendors from "./pages/dashboard/mentor-dashboard/vendors";
import MentorVenue from "./pages/dashboard/mentor-dashboard/venue";
import ReadinessPage from "./pages/readiness";


function App() {
  useEffect(() => {
    Aos.init({
      duration: 1200,
      once: true,
    });
  }, []);

  let user = null;
  useEffect(() => {
    user = sessionStorage.getItem("user");
  }, []);

  return (
    <main>
      <Provider store={store}>
        <BrowserRouter>
          <Routes>
            <Route path="/">
              <Route index element={<Home_5 />} />
              <Route path="home_1" element={<Home_1 />} />
              <Route path="home_2" element={<Home_2 />} />
              <Route path="home_3" element={<Home_3 />} />
              <Route path="home_4" element={<Home_4 />} />
              <Route path="home_5" element={<Home_5 />} />
              <Route path="home_6" element={<Home_6 />} />
              <Route path="home_7" element={<Home_7 />} />
              <Route path="home_8" element={<Home_8 />} />
              <Route path="home_9" element={<Home_9 />} />
              <Route path="home_10" element={<Home_10 />} />

              <Route path="pricing" element={<Pricing />} />
              <Route path="collegeTPO" element={<CollegeTPO />} />
              <Route path="readiness" element={<ReadinessPage />} />

              <Route path="store">
                <Route path=":project" element={<Home />} />
              </Route>

              <Route path="blog-list-v1" element={<BlogListV1 />} />
              <Route path="blog-list-v2" element={<BlogListV2 />} />
              <Route path="blog-details/:id" element={<BlogSingleDynamic />} />

              <Route path="404" element={<NotFoundPage />} />
              <Route path="*" element={<NotFoundPage />} />

              <Route path="about" element={<About />} />
              <Route path="become-expert" element={<BecomeExpert />} />
              <Route path="help-center" element={<HelpCenter />} />
              <Route path="signup" element={<SignUp />} />
              <Route path="login" element={<LogIn />} />
              <Route path="terms" element={<Terms />} />
              <Route path="invoice" element={<Invoice />} />
              <Route path="contact" element={<Contact />} />
              <Route path="destinations" element={<Destinations />} />

              <Route path="dashboard">
                <Route path="db-dashboard" element={<DBDashboard />} />
                <Route path="db-booking" element={<DBBooking />} />
                <Route path="db-wishlist" element={<DBWishlist />} />
                <Route path="db-settings" element={<DBSettings />} />
              </Route>

              <Route path="admin-dashboard">
                  <Route path="dashboard" element={<AdminDashboard />} />
                  <Route path="booking" element={<AdminBooking />} />
                  <Route path="claim-business" element={<ClaimedBusiness />} />
                  <Route path="packages" element={<Packages />} />
                  <Route path="mail" element={<Email />} />
                  <Route path="city" element={<City />} />
                  <Route path="regions" element={<Regions />} />
                  <Route path="categories" element={<Category />} />
                  <Route path="services" element={<Service />} />
                  <Route path="settings" element={<DBSettings />} />
                  <Route path="venues" element={<Venue />} />
                  <Route path="venue/:mode" element={<AdminAddVenue />} />
                  <Route path="vendors" element={<Vendors />} />
                  <Route path="vendor/:mode" element={<AdminAddVendor />} />
                  <Route path="users" element={<Users />} />
                  <Route path="user/:mode" element={<AdminAddUser />} />
                  {/* 
                  <Route path="booking" element={<AdminBooking />} />
                  <Route path="hotels" element={<BVAdminHotel />} />
                  <Route path="recovery" element={<BDAdminRecovery />} />
                  */}
              </Route>

              <Route path="vendor-dashboard">
                <Route path="dashboard" element={<VendorDashboard />} />
                <Route path="profile" element={<VendorProfile />} />

                {/* marketing sub section starts*/}
                <Route path="overview" element={<VendorMarketingOverview />} />
                <Route path="google_ads" element={<VendorMarketingGoogle />} />
                <Route
                  path="facebook_ads"
                  element={<VendorMarketingFacebook />}
                />
                {/* marketing sub section ends*/}

                {/* single tabs */}
                <Route path="webpage" element={<VendorWebpage />} />
                <Route path="instagram" element={<VendorInstagram />} />
                <Route path="facebook" element={<VendorFacebook />} />
                {/* single tabs */}

                <Route path="add-hotel" element={<VendorAddHotel />} />
                <Route path="booking" element={<VendorBooking />} />
                <Route path="hotels" element={<BVVendorHotel />} />
                <Route path="recovery" element={<BDVendorRecovery />} />
              </Route>

              <Route path="mentor-dashboard">
                <Route path="dashboard" element={<MentorDashboard />} />
                <Route path="profile" element={<MentorProfile />} />
                <Route path="venues" element={<MentorVenue />} />
                <Route path="venue/:mode" element={<MentorAddVenue />} />
                <Route path="vendor/:mode" element={<MentorAddVendor />} />
                <Route path="vendors" element={<MentorVendors />} />
                {/* marketing sub section starts*/}
                <Route path="overview" element={<MentorMarketingOverview />} />
                <Route path="google_ads" element={<MentorMarketingGoogle />} />
                <Route
                  path="facebook_ads"
                  element={<VendorMarketingFacebook />}
                />
                {/* marketing sub section ends*/}

                {/* single tabs */}
                <Route path="webpage" element={<MentorWebpage />} />
                <Route path="instagram" element={<MentorInstagram />} />
                <Route path="facebook" element={<MentorFacebook />} />
                {/* single tabs */}

                <Route path="add-hotel" element={<VendorAddHotel />} />
                <Route path="booking" element={<MentorBooking />} />
                <Route path="hotels" element={<BVVendorHotel />} />
                <Route path="recovery" element={<BDVendorRecovery />} />
              </Route>

              <Route path="hotel-list-v1" element={<HotelListPage1 />} />
              <Route path="hotel-list-v2" element={<HotelListPage2 />} />
              <Route path="hotel-list-v3" element={<HotelListPage3 />} />
              <Route path="hotel-list-v4" element={<HotelListPage4 />} />
              <Route path="hotel-list-v5" element={<HotelListPage5 />} />
              <Route
                path="hotel-single-v1/:id"
                element={<HotelSingleV1Dynamic />}
              />
              <Route
                path="hotel-single-v2/:id"
                element={<HotelSingleV2Dynamic />}
              />
              <Route path="booking-page" element={<BookingPage />} />

              <Route path="tour-list-v1" element={<TourListPage1 />} />
              <Route path="tour-list-v2" element={<TourListPage2 />} />
              <Route path="tour-list-v3" element={<TourListPage3 />} />
              <Route path="tour-single/:id" element={<TourSingleV1Dynamic />} />

              <Route path="activity-list-v1" element={<ActivityListPage1 />} />
              <Route path="activity-list-v2" element={<ActivityListPage2 />} />
              <Route path="activity-list-v3" element={<ActivityListPage3 />} />
              <Route
                path="activity-single/:id"
                element={<ActivitySingleV1Dynamic />}
              />

              <Route path="rental-list-v1" element={<RentalListPage1 />} />
              <Route path="rental-list-v2" element={<RentalListPage2 />} />
              <Route path="rental-list-v3" element={<RentalListPage3 />} />
              <Route
                path="rental-single/:id"
                element={<RentalSingleV1Dynamic />}
              />

              <Route path="car-list-v1" element={<CarListPage1 />} />
              <Route path="car-list-v2" element={<CarListPage2 />} />
              <Route path="car-list-v3" element={<CarListPage3 />} />
              <Route path="car-single/:id" element={<CarSingleV1Dynamic />} />

              <Route path="cruise-list-v1" element={<CruiseListPage1 />} />
              <Route path="cruise-list-v2" element={<CruiseListPage2 />} />
              <Route path="cruise-list-v3" element={<CruiseListPage3 />} />
              <Route
                path="cruise-single/:id"
                element={<CruiseSingleV1Dynamic />}
              />

              <Route path="flight-list-v1" element={<FlightListPage1 />} />
            </Route>
          </Routes>
          <ScrollTopBehaviour />
        </BrowserRouter>

        <SrollTop />
      </Provider>
    </main>
  );
}

export default App;

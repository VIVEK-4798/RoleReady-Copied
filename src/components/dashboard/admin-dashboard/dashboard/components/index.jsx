import React from 'react'

const index = () => {
  return (
    <div>index</div>
  )
}

export default index

// import { useEffect, useState } from "react";
// import { Link } from "react-router-dom";
// import DashboardCard from "./components/DashboardCard";
// import Sidebar from "../common/Sidebar";
// import Header from "../../../header/dashboard-header";
// import ChartSelect from "./components/ChartSelect";
// import ChartMain from "./components/ChartMain";
// import RercentBooking from "./components/RercentBooking";
// import Footer from "../common/Footer";
// import { showAlert } from "@/utils/isTextMatched";
// import axios from "axios";
// import { api } from "@/utils/apiProvider";
// import { getId, getRole } from "@/utils/DOMUtils";

// const options = [
//   {
//     title: "Last 7 Days",
//     name: "weekly",
//   },
//   {
//     title: "Last 30 Days",
//     name: "monthly",
//   },
// ];

// const index = () => {
//   const [stateCount, setStateCount] = useState([]);
//   const [selectedOption, setSelectedOption] = useState(options[0]);
//   const [chartData, setChartData] = useState([]);
//   const [todaysBooking, setTodaysBooking] = useState([]);
//   const [filterTodaysBooking, setFilterTodaysBooking] = useState([]);
//   const [adminCardData, setAdminCardData] = useState([]);
//   const [dashboardTitle, setDashboardTitle] = useState("Dashboard");

//   // Determine the dashboard title based on user role
// //   useEffect(() => {
// //     const role = localStorage.getItem("role");
// //     const titles = {
// //       admin: "Admin Dashboard",
// //       "vendor-user": "Vendor Dashboard",
// //       "venue-user": "Venue Dashboard",
// //     };
// //     setDashboardTitle(titles[role] || "Dashboard");
// //   }, []);

// //   const fetchCount = async () => {
// //     try {
// //       const response = await axios.get(`${api}/api/dashboard/booking-status-count?type=${getRole()}&id=${getId()}`);
// //       if (response.status === 200) {
// //         setStateCount(response.data);
// //       } else {
// //         showAlert("Something went wrong while fetching card data", "danger");
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       showAlert("Something went wrong while fetching card data", "danger");
// //     }
// //   };

// //   const fetchCardsCount = async () => {
// //     try {
// //       const response = await axios.get(`${api}/api/dashboard/get-cards-count`);
// //       if (response.status === 200) {
// //         setAdminCardData(response.data.results);
// //       } else {
// //         showAlert("Something went wrong while fetching card data", "danger");
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       showAlert("Something went wrong while fetching card data", "danger");
// //     }
// //   };

// //   const fetchChartData = async () => {
// //     try {
// //       const response = await axios.get(
// //         `${api}/api/dashboard/pending-chart-data?type=${getRole()}&id=${getId()}&period=${selectedOption.name}`
// //       );
// //       if (response.status === 200) {
// //         setChartData(response.data);
// //       } else {
// //         showAlert("Something went wrong while fetching chart data", "danger");
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       showAlert("Something went wrong while fetching chart data", "danger");
// //     }
// //   };

// //   const fetchTodaysBooking = async () => {
// //     try {
// //       const response = await axios.get(`${api}/api/dashboard/bookings-today?type=${getRole()}&id=${getId()}`);
// //       if (response.status === 200) {
// //         setTodaysBooking(response.data);
// //         setFilterTodaysBooking(response.data);
// //       } else {
// //         showAlert("Something went wrong while fetching chart data", "danger");
// //       }
// //     } catch (err) {
// //       console.log(err);
// //       showAlert("Something went wrong while fetching chart data", "danger");
// //     }
// //   };

// //   useEffect(() => {
// //     fetchCount();
// //     fetchTodaysBooking();
// //     fetchCardsCount();
// //   }, []);

// //   useEffect(() => {
// //     fetchChartData();
// //   }, [selectedOption]);

//   return (
//     <>
//       <div className="header-margin"></div>

//       <Header />
//       {/* End dashboard-header */}

//       <div className="dashboard">
//         <div className="dashboard__sidebar bg-white scroll-bar-1">
//           <Sidebar />
//           {/* End sidebar */}
//         </div>
//         {/* End dashboard__sidebar */}

//         <div className="dashboard__main">
//           <div className="dashboard__content bg-light-2">
//             <div className="row y-gap-20 justify-between items-end pb-60 lg:pb-40 md:pb-32">
//               <div className="col-12">
//                 <h1 className="text-30 lh-14 fw-600">{dashboardTitle}</h1>
//                 <div className="text-15 text-light-1">
//                   Track and manage customer orders and all bookings.
//                 </div>
//               </div>
//               {/* End .col-12 */}
//             </div>
//             {/* End .row */}

//             <DashboardCard stateCount={stateCount} adminCardData={adminCardData} />

//             <div className="row y-gap-30 pt-20 chart_responsive">
//               <div className="col-xl-5 col-md-6">
//                 <div className="py-30 px-30 rounded-4 bg-white shadow-3">
//                   <div className="d-flex justify-between items-center">
//                     <h2 className="text-18 lh-1 fw-500">Today's Bookings</h2>
//                     <div>
//                       <Link to="#" className="text-14 text-blue-1 fw-500 underline">
//                         View All
//                       </Link>
//                     </div>
//                   </div>
//                   {/* End d-flex */}

//                   <RercentBooking
//                     todaysBooking={todaysBooking}
//                     filterTodaysBooking={filterTodaysBooking}
//                     setFilterTodaysBooking={setFilterTodaysBooking}
//                   />
//                 </div>
//                 {/* End py-30 */}
//               </div>
//               {/* End .col */}
//               <div className="col-xl-7 col-md-6">
//                 <div className="py-30 px-30 rounded-4 bg-white shadow-3">
//                   <div className="d-flex justify-between items-center">
//                     <h2 className="text-18 lh-1 fw-500">Earning Statistics</h2>
//                     <ChartSelect
//                       options={options}
//                       selectedOption={selectedOption}
//                       setSelectedOption={setSelectedOption}
//                     />
//                   </div>
//                   {/* End .d-flex */}

//                   <div className="pt-30">
//                     <ChartMain chartData={chartData} />
//                   </div>
//                 </div>
//               </div>
//               {/* End .col */}
//             </div>
//             {/* End .row */}

//             <Footer />
//           </div>
//           {/* End .dashboard__content */}
//         </div>
//         {/* End dashbaord content */}
//       </div>
//       {/* End dashbaord content */}
//     </>
//   );
// };

// export default index;

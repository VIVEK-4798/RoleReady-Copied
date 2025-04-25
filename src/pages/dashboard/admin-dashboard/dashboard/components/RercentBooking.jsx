import { convertISOToDateFormat, convertUnixToDate, getClassOfStatus, isAdminLoggedIn, isVendorLoggedIn, isVenueLoggedIn } from "@/utils/DOMUtils";
import { useState } from "react";

const RercentBooking = ({filterTodaysBooking, todaysBooking, setFilterTodaysBooking}) => {
  const [activeTab, setActiveTab] = useState(0);
  const handleTabClick = (index, tab = "") => {
    setActiveTab(index);
    if (tab.toLowerCase() === "all bookings") {
      setFilterTodaysBooking(todaysBooking);
    } else {
      setFilterTodaysBooking(todaysBooking.filter((item)=>{return tab.toLowerCase() === item.type}))
    }
  };
  const getBookingDate = (date) => {
    const booking_dates = date ? JSON.parse(date).split(",").join(" to ") : "N/A";
    return booking_dates;
  }

  const getBookingTabsItem = () => {
    let tabItems = [
      "All Bookings",
    ];
    if (isAdminLoggedIn()) {
      tabItems.push("Vendor","Venue");
    }
    return tabItems;
  }
  

  const isVendor = isVendorLoggedIn();
  const isVenue = isVenueLoggedIn();
  const isAdmin = isAdminLoggedIn();

  const renderBookingStatus = (item) => {
    return (
    <span style={{width:"max-content"}}className={`rounded-100 py-4 px-10 d-flex text-center text-14 fw-500 ${getClassOfStatus(item.status)}`}>
      {item.status}
    </span>)
  }

  return (
    <div className="overflow-scroll scroll-bar-1 pt-30 tabs -underline-2 js-tabs">
      <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
        {getBookingTabsItem().map((item, index) => (
          <div className="col-auto" key={index}>
            <button
              className={`tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button ${
                activeTab === index ? "is-tab-el-active" : ""
              }`}
              onClick={() => handleTabClick(index,item)}
            >
              {item}
            </button>
          </div>
        ))}
      </div>
      <table className="table-3 -border-bottom col-12">
        <thead className="bg-light-2">
          <tr>
            <th>Customer Name</th>
            <th>Customer Phone No</th>
            {(isVendor || isAdmin) && (activeTab === 1  || activeTab === 0) && <th>Service</th>}
            {(isVenue || isAdmin ) && (activeTab === 2  || activeTab === 0) && <th>Venue</th>}
            {(isVenue || isAdmin ) && <th>Appoitment Date</th>}
            <th>Booking Dates</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filterTodaysBooking.map((item)=>(
            <tr>
              <td>{item?.user_name}</td>
              <td>{item?.user_phone}</td>
              {(isVendor || isAdmin) && (activeTab === 1 || activeTab === 0) && <td>{item?.vendor_service}</td>}              
              {(isVenue || isAdmin ) && (activeTab === 2 || activeTab === 0) && <th>{item?.venue_name}</th>}
              {(isVenue || isAdmin ) && <th>{convertISOToDateFormat(item?.appointment_date)}</th>}
              <td className="fw-500">{getBookingDate(item?.booking_dates)}</td>
              <td>
                {renderBookingStatus(item)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RercentBooking;

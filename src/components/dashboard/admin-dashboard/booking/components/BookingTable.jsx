import { useState } from "react";
import ActionsButton from "../components/ActionsButton";
import { convertISOToDateFormat, convertUnixToDate, getClassOfStatus, isAdminLoggedIn, isVendorLoggedIn, isVenueLoggedIn } from "@/utils/DOMUtils";
import Pagination from "@/components/hotel-list/common/Pagination";

const BookingTable = ({tabItems, setShowModal, data=[], setSearchParams, update, setBookingData, filterData, setFilterData, setUpdate}) => {
  const [activeTab, setActiveTab] = useState(0);

  // const handleTabClick = (index, tab = "") => {
  //   setActiveTab(index);
  //   if (tab === "All Booking") {
  //     setSearchParams((prev)=>({
  //       ...prev,
  //       tab: ""
  //     }));
  //   }
  //   else {
  //     setSearchParams((prev)=>({
  //       ...prev,
  //       tab:tab
  //     }));
  //   }
  // };

  // const getBookingDate = (date) => {
  //   const booking_dates = date ? JSON.parse(date).split(",").join(" to ") : "N/A";
  //   return booking_dates;
  // }
  // const renderBookingStatus = (item) => {
  //   return (
  //   <span style={{width:"max-content"}}className={`rounded-100 py-4 px-10 d-flex text-center text-14 fw-500 ${getClassOfStatus(item.status)}`}>
  //     {item.status}
  //   </span>)
  // }
  // const isVendor = isVendorLoggedIn();
  // const isVenue = isVenueLoggedIn();
  // const isAdmin = isAdminLoggedIn();
  return (
    <>
      <div className="tabs -underline-2 js-tabs">
        {/* <div className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20 js-tabs-controls">
          {tabItems.map((item, index) => (
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
        </div> */}
        {/* End tabs */}

        <div className="tabs__content pt-30 js-tabs-content">
          <div className="tabs__pane -tab-item-1 is-tab-el-active">
            <div className="overflow-scroll scroll-bar-1">
              <table className="table-3 -border-bottom col-12">
                <thead className="bg-light-2">
                  <tr>
                    <th>Customer Name</th>
                    <th>Customer Phone No</th>
                    {/* {(isVendor || isAdmin) && <th>Service</th>}
                    {(isVenue || isAdmin ) && <th>Appoitment Date</th>}
                    {(isVenue || isAdmin ) && <th>Venue Name</th>} */}
                    <th>Booking Dates</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* {filterData.results && filterData.results.map((item)=>(
                    <tr>
                      <td>{item?.user_name}</td>
                      <td>{item?.user_mobile}</td>
                      {(isVendor || isAdmin) && <td>{item?.vendor_service}</td>}
                      {(isVenue || isAdmin ) && <th>{convertISOToDateFormat(item?.appointment_date)}</th>}
                      {(isVenue || isAdmin ) && <th>{item?.venue_name}</th>}
                      <td className="fw-500">{getBookingDate(item?.booking_dates)}</td>
                      <td>
                        {renderBookingStatus(item)}
                      </td>
                      <td>
                        <ActionsButton booking={item} setShowModal={setShowModal} setBookingData={setBookingData} update={update} setUpdate={setUpdate}/>
                      </td>
                    </tr>
                  ))} */}
                </tbody>
              </table>
            </div>
          </div>
          {/* <Pagination totalPages={data?.pagination?.totalPages} setSearchParams={setSearchParams}/> */}
        </div>
      </div>
    </>
  );
};

export default BookingTable;

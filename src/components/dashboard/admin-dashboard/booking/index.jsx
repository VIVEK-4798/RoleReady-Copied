import React from 'react';
import Sidebar from "../common/Sidebar";
import Header from "../../../header/dashboard-header";
import Footer from "../common/Footer";
// import { useNavigate } from "react-router-dom";
// import { useEffect, useState } from "react";
// import { api } from "@/utils/apiProvider";
// import axios from "axios";
// import {  getHeader, isLoggedInUser } from "@/utils/DOMUtils";
// import { bookingState, bookingStateArray } from "@/constant/constants";
import BookingTable from "./components/BookingTable";
import FilterBox from "./components/filter-box";
// import { showAlert } from "@/utils/isTextMatched";
// import DatePicker from "react-multi-date-picker";
// import TimePicker from "react-multi-date-picker/plugins/time_picker";

const index = () => {

    // const navigate = useNavigate();
    // const [update,setUpdate] = useState(null);
    // const [data, setData] = useState([]);
    // const [filterData, setFilterData] = useState([]);
    // const [showModal, setShowModal] = useState(false);
    // const [bookingData, setBookingData] = useState({});
    // const [searchParams, setSearchParams] = useState({ page: 1, limit: 10, search: "", tab : "" }); 
    // const fetchBookingDetails  = async () => {
    //   try {
    //     const response = await axios.get(`${api}/api/booking/get-bookings`, {
    //       headers : getHeader(),
    //       params : {
    //         ...searchParams
    //       }
    //     });
    //     if (response.status === 200) {
    //       setFilterData(response.data);
    //       setData(response.data);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // }
  
    // const handleSubmit = async (e) => {
    //   e.preventDefault();
    //   try {
    //     await axios.put(`${api}/api/booking/update-booking/${bookingData.booking_id}`,
    //       {
    //         ...bookingData,
    //         booking_dates : bookingData.booking_dates.toString(),
    //         appointment_date : bookingData.appointment_date.toString()
    //       });
    //     showAlert("Booking Updated !!","success");
    //     setShowModal(false);
    //     setUpdate(!update);
    //   } catch (error) {
    //     showAlert("Something went wrong");
    //   }
    // }
  
    // const setBookingDates = (values) => {
    //   setBookingData((prevValue)=>{
    //     return {
    //       ...prevValue,
    //       booking_dates : values
    //     }
    //   })
    // }
  
    // const handleChange = (name,value) => {
    //   setBookingData((prevValue)=>{
    //     return {
    //       ...prevValue,
    //       [name] : value
    //     }
    //   })
    // }
  
    // useEffect(()=>{
    //   fetchBookingDetails()
    // },[update, searchParams])
  
    // useEffect(()=>{
    //   if (!isLoggedInUser()) {
    //     navigate("/");
    //   }
    // })

  return (
    <>
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
              <div className="col-auto">
                <h1 className="text-30 lh-14 fw-600">Booking History</h1>
                <div className="text-15 text-light-1">
                See All Venues And Vendors Booking Here.
                </div>
              </div>
              {/* End .col-auto */}

              {/* <div className="col-auto">
                <FilterBox setSearchParams={setSearchParams}/>
              </div> */}
            </div>
            {/* End .row */}

            {/* <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <BookingTable data={data} setShowModal={setShowModal} setSearchParams={setSearchParams} setBookingData={setBookingData} setUpdate={setUpdate} update={update} tabItems={bookingState()} setFilterData={setFilterData} filterData={filterData}/>
            </div> */}
            <div className="py-30 px-30 rounded-4 bg-white shadow-3">
              <BookingTable />
            </div>
            {/* {showModal && (
              <div className="modal-overlay">
                <div className="modal-content">
                  <h3>Update Booking</h3>
                  <form >
                    <div>
                      <h4 className="text-15 fw-500 ls-2 lh-16">From Date - To Date</h4>
                      <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker">
                        <DatePicker
                          inputClass="custom_input-picker"
                          containerClassName="custom_container-picker"
                          value={bookingData.booking_dates}
                          onChange={setBookingDates}
                          numberOfMonths={2}
                          offsetY={10}
                          range
                          rangeHover
                          format="DD MMMM YYYY"
                        />
                      </div>
                    </div>
                    <div>
                      <h4 className="text-15 fw-500 ls-2 lh-16">Re-Sechedule Visit</h4>
                      <div className="text-15 text-light-1 ls-2 lh-16 custom_dual_datepicker">
                        <DatePicker
                          inputClass="custom_input-picker"
                          containerClassName="custom_container-picker"
                          value={bookingData.appointment_date}
                          onChange={(value)=>{handleChange("appointment_date",value)}}
                          numberOfMonths={1}
                          offsetY={10}
                          rangeHover
                          format="DD MMMM YYYY HH:mm"
                          plugins={[<TimePicker position="bottom" hideSeconds mStep={30}/>]} 
                        />
                      </div>
                    </div>
                    <div className="col-12">
                      <div className="form-input" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
                        <div className="dropdown js-dropdown js-services-active w-100">
                          <div
                            className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                            data-bs-toggle="dropdown"
                            data-bs-auto-close="true"
                            aria-expanded="false"
                            data-bs-offset="0,10"
                          >
                            <span className="d-flex js-dropdown-title">{bookingData.status}</span>
                            <i className="icon icon-chevron-sm-down text-7 ml-10" />
                          </div>
                          <div className="toggle-element -dropdown w-100 dropdown-menu">
                            <div className="text-14 y-gap-15 js-dropdown-list">
                            {bookingStateArray.map((state, index) => (
                              <div
                              key={index}
                              id={state}
                              className={`${
                                bookingData.status === state ? "text-blue-1" : ""
                              } js-dropdown-link`}
                              onClick={()=>{handleChange("status",state)}}
                              >
                              {state}
                              </div>
                            ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="modal-actions mt-5">
                      <button onClick={handleSubmit} className="button bg-blue-1 text-white">
                        Submit
                      </button>
                      <button
                        type="button"
                        className="button bg-light-2 text-dark-1"
                        onClick={() => setShowModal(false)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )} */}
            <Footer />
          </div>
          {/* End .dashboard__content */}
        </div>
        {/* End dashbaord content */}
      </div>
      {/* End dashbaord content */}
         
    </>
  )
}

export default index

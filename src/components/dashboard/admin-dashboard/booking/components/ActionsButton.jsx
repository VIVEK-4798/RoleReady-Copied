import { api } from "@/utils/apiProvider";
// import { showAlert } from "@/utils/isTextMatched";
import axios from "axios";
import { useState } from "react";
import { DateObject } from "react-multi-date-picker";

const ActionsButton = ({booking, setShowModal, setBookingData, setUpdate, update}) => {
  const [activeFilter, setActiveFilter] = useState("all");

  const handleFilterClick = (filter, booking) => {
    setActiveFilter(filter);
    if (filter === "delete") {
      deleteBooking(booking.booking_id);
    } else if (filter === "edit") {
      setBookingData({
        ...booking, 
        booking_dates: JSON.parse(booking.booking_dates).split(",").map((date) => {return new DateObject({ date, format: "DD MMMM YYYY" }).format("DD MMMM YYYY")}),
        appointment_date : booking.appointment_date
      });
      setShowModal(true);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const response = await axios.delete(`${api}/api/booking/delete-booking/${id}`);
      if (response.data.success) {
        showAlert(response.data.message);
        setUpdate(!update);
      } else {
        showAlert("Something went wrong","success");
      }
    } catch (error) {
      showAlert("Something went wrong");
    }
  }

  const filters = [
    { label: "Edit", value: "edit" },
    { label: "Delete", value: "delete" },
  ];

  return (
    <div className="dropdown js-dropdown js-actions-1-active">
      <div
        className="dropdown__button d-flex items-center rounded-4 text-blue-1 bg-blue-1-05 text-14 px-15 py-5"
        data-bs-toggle="dropdown"
        data-bs-auto-close="true"
        aria-expanded="false"
        data-bs-offset="0,10"
      >
        <span className="js-dropdown-title">
          Action
        </span>
        <i className="icon icon-chevron-sm-down text-7 ml-10" />
      </div>
      <div className="toggle-element -dropdown-2 js-click-dropdown dropdown-menu">
        <div className="text-14 fw-500 js-dropdown-list">
          {filters.map((filter) => (
            <div key={filter.value}>
              <button
                className={`d-block js-dropdown-link ${
                  activeFilter === filter.value ? "text-blue-1" : ""
                }`}
                onClick={() => handleFilterClick(filter.value,booking)}
              >
                {filter.label}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActionsButton;

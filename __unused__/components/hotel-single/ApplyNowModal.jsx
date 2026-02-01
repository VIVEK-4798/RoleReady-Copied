import React, { useRef, useEffect, useState } from "react";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import "react-toastify/dist/ReactToastify.css";

const ApplyNowModal = ({ show, onClose, type, venueId = null, service_reg_id = null }) => {
  const modalRef = useRef(null);
  const userId = localStorage.getItem("user_id") || 1;

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    resume: null,
  });

  const handleClickOutside = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      onClose();
    }
  };

  useEffect(() => {
    if (show) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [show]);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "resume" ? files[0] : value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!["venue", "vendor"].includes(type)) {
    toast.error("Invalid application type.");
    return;
  }

  const form = new FormData();
  form.append("user_id", userId);
  form.append("type", type);
  form.append("status", "Pending");
  form.append("booking_dates", JSON.stringify(["Resume Applied"]));
  form.append("appointment_date", new Date().toLocaleString());
  form.append("name", formData.name);
  form.append("phone", formData.phone);
  form.append("resume", formData.resume);
  form.append("venue_id", venueId ?? null);
  form.append("service_reg_id", type === "vendor" ? service_reg_id : null);

  try {
    await axios.post(`${api}/api/booking/create-booking`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    toast.success("Application submitted successfully!");
    setTimeout(() => {
      onClose();
    }, 1500);
  } catch (err) {
    console.error(err);
    toast.error("Failed to submit application.");
  }
};


  if (!show) return null;

  return (
    <>
      <ToastContainer />
      <div className="modal-overlay">
        <div className="modal-content" ref={modalRef}>
          <h2 className="modal-title">
            Apply for this {type === "vendor" ? "Job" : "Internship"}
          </h2>
          <form onSubmit={handleSubmit} className="modal-form">
            <input
              type="text"
              name="name"
              placeholder="Your Name"
              required
              onChange={handleChange}
            />
            <input
              type="tel"
              name="phone"
              placeholder="Phone Number"
              required
              onChange={handleChange}
            />
            <input
              type="file"
              name="resume"
              accept=".pdf,.doc,.docx"
              required
              onChange={handleChange}
            />
            <button type="submit">Apply Now</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default ApplyNowModal;

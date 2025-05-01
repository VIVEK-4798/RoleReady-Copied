import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { api } from "@/utils/apiProvider";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare } from "@fortawesome/free-solid-svg-icons";

const CertificatePopupPage = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [certificate, setCertificate] = useState({
    title: "",
    organization: "",
    issuedDate: "",
    linked: false,
    skills: "",
    description: "",
  });
  const [savedCertificate, setSavedCertificate] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const user_id = user?.user_id;

  useEffect(() => {
    if (!user_id) return;
    fetchCertificate();
  }, []);

  const fetchCertificate = async () => {
    try {
      const res = await axios.get(`${api}/api/profile/get-certificate/${user_id}`);
      if (res.data.certificate) {
        const parsed = JSON.parse(res.data.certificate); // Parse it here
        setSavedCertificate(parsed);
      }
    } catch (err) {
      console.error("Error fetching certificate:", err);
    }
  };
  

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setCertificate((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    try {
      const res = await axios.post(`${api}/api/profile/save-certificate`, {
        user_id,
        certificate,
      });

      if (res.data.success) {
        toast.success("Certificate saved successfully");
        setSavedCertificate(certificate);
        setShowPopup(false);
      } else {
        toast.error("Failed to save certificate");
      }
    } catch (err) {
      toast.error("Error saving certificate");
      console.error(err);
    }
  };

  const handleOverlayClick = (e) => {
    if (e.target.classList.contains("overlay")) {
      setShowPopup(false);
    }
  };

  useEffect(() => {
    document.body.style.overflow = showPopup ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [showPopup]);

  const openEditPopup = () => {
    if (savedCertificate) setCertificate(savedCertificate);
    setShowPopup(true);
  };

  return (
    <div style={{ backgroundColor: "#fff" }}>
      <div className="rounded p-3 mb-12">
        <div className="d-flex justify-between items-start">
          <div className="flex flex-col">
            <h5 className="text-20 fw-600 mb-12">Certificates</h5>
            {savedCertificate ? (
              <>
                <p className="text-16 text-light-1 mb-10 whitespace-pre-line">
                  <strong>{savedCertificate.title}</strong> by{" "}
                  <strong>{savedCertificate.organization}</strong>
                  <br />
                  {savedCertificate.issuedDate}{" "}
                  <br />
                  Skills: {savedCertificate.skills}
                  <br />
                  {savedCertificate.description}
                </p>
                <FontAwesomeIcon
                  icon={faPenToSquare}
                  onClick={openEditPopup}
                  className="text-blue-500 cursor-pointer hover:opacity-80"
                  size="lg"
                />
              </>
            ) : (
              <span
                className="text-blue-1 cursor-pointer"
                onClick={() => setShowPopup(true)}
              >
                Add Certificate
              </span>
            )}
          </div>
          <div>
            <img
              src="/img/profile/certificate.webp"
              alt="certificate"
              style={{ width: 140, height: 110 }}
            />
          </div>
        </div>
      </div>

      {showPopup && (
        <div className="popup-main overlay" onClick={handleOverlayClick}>
          <form onSubmit={(e) => e.preventDefault()} className="popup-second">
            <h3 className="text-lg font-semibold mb-2">
              Certificates <span style={{ color: "red" }}>*</span>
            </h3>

            <div className="grid grid-cols-1 gap-3">
              <div>
                <label className="text-sm">Title of Certificate *</label>
                <input
                  type="text"
                  name="title"
                  value={certificate.title}
                  onChange={handleChange}
                  placeholder="Title of Certificate"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Issuing Organization *</label>
                <input
                  type="text"
                  name="organization"
                  value={certificate.organization}
                  onChange={handleChange}
                  placeholder="Organisation"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Issued Date *</label>
                <input
                  type="date"
                  name="issuedDate"
                  value={certificate.issuedDate}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  required
                />
              </div>

              <div>
                <label className="text-sm">Skills</label>
                <input
                  type="text"
                  name="skills"
                  value={certificate.skills}
                  onChange={handleChange}
                  placeholder="Add skills"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                />
              </div>

              <div>
                <label className="text-sm">Description</label>
                <textarea
                  name="description"
                  value={certificate.description}
                  onChange={handleChange}
                  placeholder="Describe your certificate or achievement"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm mb-2"
                  rows="3"
                ></textarea>
              </div>
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: "1.5rem" }}>
              <button onClick={() => setShowPopup(false)} className="cancel-button">
                Cancel
              </button>
              <button onClick={handleSave} className="save-button">
                Save
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default CertificatePopupPage;

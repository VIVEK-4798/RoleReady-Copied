import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";
import "../../../../public/sass/components/jobstourprops.scss";

const TourProperties = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bannerImages = [
    "banner1.webp",
    "banner3.png",
    "banner4.webp",
    "banner2.avif",
    "banner6.webp",
    "banner5.jpg",
    "banner7.jpg",
    "banner8.jpg",
  ];

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/vendor/get-vendors`, {
        headers: { id: getId() },
      });

      const updatedVendors = response.data.results.map((vendor, index) => {
        const bannerImage = `/img/banners/jobs/${bannerImages[index % bannerImages.length]}`;
        return {
          ...vendor,
          bannerImage,
        };
      });

      setVendors(updatedVendors);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setError("Failed to fetch vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  return (
    <div className="venue-grid">
      {vendors.map((item, index) => {
        const images = item?.portfolio ? JSON.parse(item.portfolio) : [];

        return (
          <div key={index} className="venue-card-wrapper">
            <Link
              to={`/tour-single/${item.service_reg_id}`}
              className="venue-card"
              onMouseEnter={(e) => e.currentTarget.classList.add("hovered")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("hovered")}
            >
              <div
                className="venue-banner"
                style={{ backgroundImage: `url(${item.bannerImage})` }}
              >
                <div className="venue-logo">
                  <img
                    src={images[0] || "https://via.placeholder.com/60"}
                    alt="Company Logo"
                  />
                </div>
              </div>

              <div className="venue-tags">
                <div className="tag in-office">{item?.job_type || "Full Time"}</div>
                <div className="tag hiring">
                  <span>⚡</span>
                  <span>Actively Hiring</span>
                </div>
              </div>

              <div className="venue-content">
                <h4>{item.vendor_name || "Tour Vendor"}</h4>
                <p>{item.city_name}, {item.region_name}</p>
                <div className="venue-meta">
                  <span>Experience: <strong>{item.work_experience || "0"}</strong> yrs</span>
                  <span className="stipend">₹{item.job_salary || "15K"}/Month</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default TourProperties;

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import "../../../../public/sass/components/jobstourprops.scss";

const TourProperties = ({ filters }) => {
  
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const bannerImages = [
    "banner1.webp", "banner3.png", "banner4.webp", "banner2.avif",
    "banner6.webp", "banner5.jpg", "banner7.jpg", "banner8.jpg"
  ];

  const fetchVendors = async () => {
    setLoading(true);
    setError(null);

    try {
      const hasCity = filters?.city?.city_name;
      const hasCategory = filters?.category;

      let response;

      if (hasCity || hasCategory) {
        // Search with filters
        response = await axios.get(`${api}/api/vendor/search-vendors`, {
          params: {
            city_name: hasCity ? filters.city.city_name : "",
            vendor_service: hasCategory ? filters.category : "",
            page: 1,
            limit: 20,
          },
        });
      } else {
        // Fetch all vendors
        response = await axios.get(`${api}/api/vendor/get-vendors`);
      }
      
      let fetched = [];

      // Handle both response shapes
      if (hasCity || hasCategory) {
        fetched = response.data.data || [];
      } else {
        fetched = response.data.results || [];
      }

      const updated = fetched.map((vendor, index) => ({
        ...vendor,
        bannerImage: `/img/banners/jobs/${bannerImages[index % bannerImages.length]}`
      }));

      setVendors(updated);
    } catch (err) {
      console.error("Failed to fetch vendors:", err);
      setError("Error loading vendors.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, [filters]);

  if (loading) return <p className="text-center mt-30">Loading jobs...</p>;
  if (error) return <p className="text-center text-red-600 mt-30">{error}</p>;
  if (vendors.length === 0) return <p className="text-center mt-30">No jobs found.</p>;

  return (
      <div
        className="venue-grid"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '30px',
          justifyContent: 'flex-start',
        }}
      >
      {vendors.map((item, index) => {
        const images = item?.portfolio ? JSON.parse(item.portfolio) : [];

        return (
          <div
            key={index}
            className="venue-card-wrapper"
            style={{
              flex: '0 0 calc(25% - 30px)',
              maxWidth: 'calc(25% - 30px)',
              minWidth: '280px',
            }}
          >
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
                <div className="tag hiring"><span>⚡</span><span>Actively Hiring</span></div>
              </div>

              <div className="venue-content">
                <h4>{item.vendor_name}</h4>
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

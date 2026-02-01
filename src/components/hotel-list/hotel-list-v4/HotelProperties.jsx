import { useEffect, useState } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { getId } from "@/utils/DOMUtils";
import { Link } from "react-router-dom";
import "../../../../public/sass/components/internshiphotelProp.scss";

const bannerImages = [
  "banner1.webp", "banner2.png", "banner3.png", "banner4.png",
  "banner6.jpeg", "banner5.png", "banner7.jpg", "banner8.jpeg"
];

const HotelProperties = ({ filters }) => {
  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchVenues = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/venue/search-venues`, {
        params: {
          city_name: filters.city?.city_name || "",
          venue_categories: filters.category || "",
          page: 1,
          limit: 20,
        },
        headers: {
          id: getId(),
        },
      });

      const fetched = response.data.data || [];

      const updatedVenues = fetched.map((venue, index) => ({
        ...venue,
        bannerImage: `/img/banners/${bannerImages[index % bannerImages.length]}`,
      }));

      setVenues(updatedVenues);
    } catch (err) {
      setError("Failed to load venues.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVenues();
  }, [filters]);

  if (loading) return <div>Loading venues...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div
      className="venue-grid"
      style={{
        display: "flex",
        flexWrap: "wrap",
        gap: "30px",
        justifyContent: "flex-start",
      }}
    >
      {venues.map((item, index) => {
        const images = item?.venue_images ? JSON.parse(item.venue_images) : [];

        return (
          <div
            key={index}
            className="venue-card-wrapper"
            style={{
              flex: "0 0 calc(25% - 30px)",
              maxWidth: "calc(25% - 30px)",
              minWidth: "280px",
            }}
          >
            <Link
              to={`/hotel-single-v1/${item.venue_id}`}
              className="venue-card"
              onMouseEnter={(e) => e.currentTarget.classList.add("hovered")}
              onMouseLeave={(e) => e.currentTarget.classList.remove("hovered")}
            >
              <div
                className="venue-banner"
                style={{ backgroundImage: `url("${item.bannerImage}")` }}
              >
                <div className="venue-logo">
                  <img
                    src={images[0] || "https://via.placeholder.com/60"}
                    alt="Logo"
                  />
                </div>
              </div>

              <div className="venue-tags">
                <div className="tag in-office">{item.internship_type || "In Office"}</div>
                <div className="tag hiring">
                  <span>⚡</span><span>Actively Hiring</span>
                </div>
              </div>

              <div className="venue-content">
                <h4>{item.venue_name}</h4>
                <p>{item.venue_address}</p>
                <div className="venue-meta">
                  <span>
                    Duration: <strong>{item.duration_months || "3"}</strong> months
                  </span>
                  <span className="stipend">₹{item.stipend || "8K"}/Month</span>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </div>
  );
};

export default HotelProperties;

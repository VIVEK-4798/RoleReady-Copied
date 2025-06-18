import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";
import "../../../../public/sass/components/internshiphotelProp.scss";

const HotelProperties = () => {
  const itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

const bannerImages = [
  "banner1.webp",
  "banner2.png",
  "banner3.png",
  "banner4.png",
  "banner6.jpeg",
  "banner5.png",
  "banner7.jpg",
  "banner8.jpeg",
];

const fetchVenues = async () => {
  setLoading(true);
  setError(null);
  try {
    const response = await axios.get(`${api}/api/venue/get-venue`, {
      headers: {
        id: getId(),
      },
    });

    if (response.data.success) {
      console.log(response.data.results);
      
      const updatedVenues = response.data.results.map((venue, index) => {
        const bannerImage = `/img/banners/${bannerImages[index % bannerImages.length]}`;
        return {
          ...venue,
          bannerImage,
        };
      });
      setVenues(updatedVenues);
    } else {
      setError("Failed to fetch venues.");
    }
  } catch (err) {
    setError("An error occurred while fetching venues.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    fetchVenues();
  }, []);

  return (
    <div className="venue-grid">
      {venues.map((item, index) => {
        const images = item?.venue_images ? JSON.parse(item.venue_images) : [];

        return (
          <div key={index} className="venue-card-wrapper">
            <Link
              to={`/hotel-single-v1/${item.venue_id}`}
              className="venue-card"
              onMouseEnter={(e) => {
                e.currentTarget.classList.add("hovered");
              }}
              onMouseLeave={(e) => {
                e.currentTarget.classList.remove("hovered");
              }}
            >
              <div
                className="venue-banner"
                style={{
                  backgroundImage: `url("${item.bannerImage}")`,
                }}
              >
                <div className="venue-logo">
                  <img
                    src={images[0] || "https://via.placeholder.com/60"}
                    alt="Company Logo"
                  />
                </div>
              </div>

              <div className="venue-tags">
                <div className="tag in-office">
                  {item.internship_type || "In Office"}
                </div>
                <div className="tag hiring">
                  <span>⚡</span>
                  <span>Actively Hiring</span>
                </div>
              </div>

              <div className="venue-content">
                <h4>{item.venue_name || "Data Analyst Internship"}</h4>
                <p>{item.venue_address || "Mom Pharmacy"}</p>
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

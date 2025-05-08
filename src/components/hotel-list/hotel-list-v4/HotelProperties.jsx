import { Link } from "react-router-dom";
import Slider from "react-slick";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";

const HotelProperties = () => {
  const itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  function ArrowSlick(props) {
    const className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    const char =
      props.type === "next" ? (
        <i className="icon icon-chevron-right text-12" />
      ) : (
        <i className="icon icon-chevron-left text-12" />
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  const [venues, setVenues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setVenues(response.data.results || []);
        console.log("Fetched venues:", response.data.results);
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
    <>
      {venues.map((item, index) => {
        const images = item?.venue_images
          ? JSON.parse(item.venue_images)
          : [];
        const categories = item?.venue_categories
          ? JSON.parse(item.venue_categories)
          : [];

        return (
          <div
            className="col-lg-4 col-sm-6"
            key={index}
            data-aos="fade"
            data-aos-delay={index * 100}
          >
            <Link
              to={`/hotel-single-v1/${item.venue_id}`}
              className="hotelsCard -type-1 hover-inside-slider"
            >
              <div className="hotelsCard__image">
                <div className="cardImage inside-slider">
                  <Slider
                    {...itemSettings}
                    arrows={true}
                    nextArrow={<ArrowSlick type="next" />}
                    prevArrow={<ArrowSlick type="prev" />}
                  >
                    {images.map((img, i) => (
                      <div className="cardImage ratio ratio-1:1" key={i}>
                        <div className="cardImage__content">
                          <img
                            className="rounded-4 col-12 js-lazy"
                            src={img}
                            alt="internship"
                          />
                        </div>
                      </div>
                    ))}
                  </Slider>

                  <div className="cardImage__wishlist">
                    <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                      <i className="icon-heart text-12" />
                    </button>
                  </div>

                  {categories.length > 0 && (
                    <div className="cardImage__leftBadge">
                      <div
                        className="py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase"
                        style={{
                          backgroundColor: categories[0].category_color_class,
                          color: "#fff",
                        }}
                      >
                        {categories[0].category_name}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="hotelsCard__content mt-10">
                <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
                  <span>{item.venue_name || "Internship"}</span>
                </h4>
                <p className="text-light-1 lh-14 text-14 mt-5">
                  {item.city_name}, {item.region_name}
                </p>
                <div className="d-flex items-center mt-20">
                  <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                    {item.stipend}
                  </div>
                  <div className="text-14 text-dark-1 fw-500 ml-10">
                    {item.internship_type}
                  </div>
                  <div className="text-14 text-light-1 ml-10">
                    {item.duration_months} month(s)
                  </div>
                </div>
                <div className="mt-5">
                  <div className="fw-500">
                    Work Detail:{" "}
                    <span>{item.work_detail}</span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        );
      })}
    </>
  );
};

export default HotelProperties;

import { Link } from "react-router-dom";
import Slider from "react-slick";
import { hotelsData } from "../../data/hotels";
import isTextMatched from "../../utils/isTextMatched";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";

const Hotels2 = () => {

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

  var settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    responsive: [
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
        },
      },

      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 520,
        settings: {
          slidesToShow: 1,
        },
      },
    ],
  };

  var itemSettings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  // custom navigation
  function ArrowSlick(props) {
    let className =
      props.type === "next"
        ? "slick_arrow-between slick_arrow -next arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-next"
        : "slick_arrow-between slick_arrow -prev arrow-md flex-center button -blue-1 bg-white shadow-1 size-30 rounded-full sm:d-none js-prev";
    className += " arrow";
    const char =
      props.type === "next" ? (
        <>
          <i className="icon icon-chevron-right text-12"></i>
        </>
      ) : (
        <>
          <span className="icon icon-chevron-left text-12"></span>
        </>
      );
    return (
      <button className={className} onClick={props.onClick}>
        {char}
      </button>
    );
  }

  return (
    <>
<Slider {...settings}>
  {venues.slice(0, 4).map((item, index) => {
    const images = JSON.parse(item.venue_images || "[]");
    const tagData = JSON.parse(item.venue_categories || "[]");
    const tag = tagData[0]?.category_name || "Internship";

    return (
      <div
        key={item.venue_id}
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
                {images.length > 0 ? (
                  images.map((img, i) => (
                    <div className="cardImage ratio ratio-1:1" key={i}>
                      <div className="cardImage__content ">
                        <img
                          className="rounded-4 col-12 js-lazy"
                          src={img}
                          alt={`venue-${i}`}
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div className="cardImage ratio ratio-1:1">
                      <img
                        className="rounded-4 col-12 js-lazy"
                        src="/img/jobsCategory/Sales&BusinessDevelopment.png"
                        alt="default-1"
                      />
                    </div>
                    <div className="cardImage ratio ratio-1:1">
                      <img
                        className="rounded-4 col-12 js-lazy"
                        src="/img/jobsCategory/HumanResources.jpg"
                        alt="default-2"
                      />
                    </div>
                  </>
                )}
              </Slider>

              <div className="cardImage__wishlist">
                <button className="button -blue-1 bg-white size-30 rounded-full shadow-2">
                  <i className="icon-heart text-12" />
                </button>
              </div>

              <div className="cardImage__leftBadge">
                <div className="py-5 px-15 rounded-right-4 text-12 lh-16 fw-500 uppercase bg-blue-1 text-white">
                  {tag}
                </div>
              </div>
            </div>
          </div>

          <div className="hotelsCard__content mt-10">
            <h4 className="hotelsCard__title text-dark-1 text-18 lh-16 fw-500">
              <span>{item.venue_name || "Untitled Internship"}</span>
            </h4>
            <p className="text-light-1 lh-14 text-14 mt-5">
              {item.city_name}, {item.state}
            </p>
            <div className="d-flex items-center mt-20">
              <div className="flex-center bg-blue-1 rounded-4 size-30 text-12 fw-600 text-white">
                {item.venue_rate ?? "4.5"}
              </div>
              <div className="text-14 text-dark-1 fw-500 ml-10">Recommended</div>
              <div className="text-14 text-light-1 ml-10">Based on skills</div>
            </div>
            <div className="mt-5">
              <div className="fw-500">
                Duration: <span className="text-blue-1">{item.duration_months} month(s)</span>
              </div>
              <div className="fw-500">
                Stipend: <span className="text-blue-1">₹{item.stipend}</span>
              </div>
            </div>
          </div>
        </Link>
      </div>
    );
  })}
</Slider>
    </>
  );
};

export default Hotels2;

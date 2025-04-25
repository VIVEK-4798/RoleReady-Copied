import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import pricingData from "../../data/pricing";
import PricingPagination from "./PricingPagination";

const PricingComponent = () => {
  const [filterOption, setFilterOption] = useState("annual");
  const [filteredItems, setFilteredItems] = useState([]);

  useEffect(() => {
    setFilteredItems(
      pricingData.filter((elm) => elm.tags?.includes(filterOption))
    );
  }, [filterOption]);

  const filterOptions = [
    { label: "Annual ( Save 20% )", value: "annual" },
    { label: "Monthly", value: "monthly" },
  ];

  return (
    <>
      <div className="tabs -pills-3 pt-30 js-tabs">
        <div className="tabs__controls row x-gap-10 justify-center js-tabs-controls">
          {filterOptions.map((option) => (
            <div className="col-auto" key={option.value}>
              <button
                className={`tabs__button text-14 fw-500 px-20 py-10 rounded-4 bg-light-2 js-tabs-button ${
                  filterOption === option.value ? "is-tab-el-active" : ""
                }`}
                onClick={() => setFilterOption(option.value)}
              >
                {option.label}
              </button>
            </div>
          ))}
        </div>
        {/* End tab-controls */}

        <div className="row y-gap-30 pt-30">
          {filteredItems.slice(0, 9).map((item) => (
            <div className="col-lg-3 col-sm-6 mb-4" key={item.id}>
              <Link
                to="#"
                className="blogCard -type-1 d-block rounded-8 shadow p-3"
              >
                <div className="blogCard__image">
                  <div className="rounded-8">
                    <h2>{item.category}</h2>
                    <h2>
                      <i className="bi bi-currency-rupee"></i>
                      {item.price}
                    </h2>
                    <p className="text-light-1">{item.subHeading}</p>
                    <hr />
                  </div>
                </div>
                <div className="pt-20">
                  <h4 className="text-dark-1 text-18 fw-500 mb-5">
                    {item.details}
                  </h4>
                  {item.features.map((i, index) => (
                    <p key={index}>
                      <i className="bi bi-check-circle-fill text-success me-2"></i>
                      {i}
                    </p>
                  ))}
                  <Link
                    to="/signup"
                    className={`button mt-40 fw-400 text-14 h-40 ${item.color}`}
                  >
                    {item.button}
                  </Link>
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default PricingComponent;

import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";

const categories = [
  "Software Development",
  "Digital Marketing",
  "Data Analysis",
  "Customer Support",
  "Graphic Design",
  "Human Resources",
  "Sales & Business Development",
  "Content Writing",
  "Finance & Accounting",
  "UI/UX Designer",
  "Product Management",
  "Community & Branding"
];


const LocationSearch = ({ onChange }) => {
  const [searchValue, setSearchValue] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [cityList, setCityList] = useState([]);
  const [isCityDropdownVisible, setIsCityDropdownVisible] = useState(false);
  const [isCategoryDropdownVisible, setIsCategoryDropdownVisible] = useState(false);

  const wrapperRef = useRef(null);

  useEffect(() => {
    const fetchCities = async () => {
      try {
        const res = await axios.get(`${api}/api/city/get-city`);
        if (res.data.success) {
          setCityList(res.data.results);
        }
      } catch (error) {
        console.error("Failed to fetch cities:", error);
      }
    };

    fetchCities();
  }, []);

  const handleCityClick = (city) => {
    setSearchValue(city.city_name);
    setSelectedCity(city);
    setIsCityDropdownVisible(false);
    if (onChange) onChange({ city, category: selectedCategory });
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setIsCategoryDropdownVisible(false);
    if (onChange) onChange({ city: selectedCity, category });
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsCityDropdownVisible(false);
        setIsCategoryDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      ref={wrapperRef}
      style={{
        position: "relative",
        zIndex: 50,
        display: "flex",
        gap: "16px",
        flexWrap: "wrap"
      }}
    >
      {/* Location Box */}
      <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
        <h4 className="text-15 fw-500 ls-2 lh-16 mb-5">Location</h4>
        <input
          autoComplete="off"
          type="search"
          placeholder="Where are you going?"
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setIsCityDropdownVisible(true);
          }}
          onFocus={() => setIsCityDropdownVisible(true)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc"
          }}
        />

        {isCityDropdownVisible && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              marginTop: "4px",
              borderRadius: "8px",
              boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 9999
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {cityList
                .filter((item) =>
                  item.city_name.toLowerCase().includes(searchValue.toLowerCase())
                )
                .map((item) => (
                  <li
                    key={item.city_id}
                    onClick={() => handleCityClick(item)}
                    style={{
                      padding: "12px 16px",
                      cursor: "pointer",
                      backgroundColor:
                        selectedCity?.city_id === item.city_id ? "#f0f0f0" : "#fff"
                    }}
                  >
                    <strong>{item.city_name}</strong>
                    <div style={{ fontSize: "12px", color: "#888" }}>
                      {item.city_address}
                    </div>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>

      {/* Category Box */}
      <div style={{ flex: 1, minWidth: "200px", position: "relative" }}>
        <h4 className="text-15 fw-500 ls-2 lh-16 mb-5">Category</h4>
        <div
          onClick={() => setIsCategoryDropdownVisible(!isCategoryDropdownVisible)}
          style={{
            width: "100%",
            padding: "8px",
            borderRadius: "6px",
            border: "1px solid #ccc",
            cursor: "pointer",
            backgroundColor: "#fff"
          }}
        >
          {selectedCategory || "Select a category"}
        </div>

        {isCategoryDropdownVisible && (
          <div
            style={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              backgroundColor: "#fff",
              marginTop: "4px",
              borderRadius: "8px",
              boxShadow: "0px 8px 16px rgba(0,0,0,0.15)",
              maxHeight: "250px",
              overflowY: "auto",
              zIndex: 9999
            }}
          >
            <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
              {categories.map((category, idx) => (
                <li
                  key={idx}
                  onClick={() => handleCategoryClick(category)}
                  style={{
                    padding: "12px 16px",
                    cursor: "pointer",
                    backgroundColor:
                      selectedCategory === category ? "#f0f0f0" : "#fff"
                  }}
                >
                  {category}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default LocationSearch;

import HotelContent from "./content/HotelContent";
import HotelPolicy from "./content/HotelPolicy";
import BannerUploader from "./content/BannerUploader";
import FeaturedUploader from "./content/FeaturedUploader";
import GalleryUploader from "./content/GalleryUploader";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { useEffect, useState } from "react";

const BasicInformation = ({vendorData = {}, handleChange = ()=>{}, handleDropDownChange}) => {
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState(null); 

  const [regions, setRegions] = useState([]);
  const [selectedRegions, setSelectedRegions] = useState(null); 

  const fetchCities = async () => {
    try {
        const response = await axios.get(`${api}/api/city/get-city`);
        if (response.data.success) {
          setCities(response.data.results);
        }
    } catch (error) {
        console.log('failed to fetch the user');
        console.error(error);
    }
  };

  const fetchRegions = async () => {
    if (selectedCity !== null) {
      try {
        const response = await axios.get(`${api}/api/region/get-regions-by-city-id/${selectedCity.city_id}`);
        if (response.data.success) {
          setRegions(response.data.results);
        }
    } catch (error) {
        console.log('failed to fetch the user');
        console.error(error);
    }
    }
  };

  const handleCityDropDownChange = (city)=>{
    setSelectedCity(city);
    handleDropDownChange({name:"city_name",value:city.city_name})
  }
  
  const handleRegionDropDownChange = (region)=>{
    setSelectedCity(region);
    handleDropDownChange({name:"region_name",value:region.region_name,})
    handleDropDownChange({name:"pincode",value:region.region_pincode,})
  }

  useEffect(()=>{
    fetchCities();
  },[])

  useEffect(()=>{
    fetchRegions();
  },[selectedCity]);

  return (
    <>
      <div className="col-xl-10">
        <div className="row x-gap-20 y-gap-20">
          <div className="col-12">
            <div className="form-input ">
              <input type="text" required name="vendor_name" value={vendorData?.vendor_name} onChange={handleChange}/>
              <label className="lh-1 text-16 text-light-1">Job Name <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>
          <div className="col-12">
            <div className="form-input">
              <input type="text" required name="vendor_address" value={vendorData?.vendor_address} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Campany Address <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>
          <div className="col-6">
            <div className="form-input" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
              <div className="dropdown js-dropdown js-services-active w-100">
                <div
                  className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  data-bs-offset="0,10"
                >
                  <span className="js-dropdown-title">{vendorData.city_name || "Select City"}</span>
                  <i className="icon icon-chevron-sm-down text-7 ml-10" />
                </div>
                <div className="toggle-element -dropdown w-100 dropdown-menu">
                  <div className="text-14 y-gap-15 js-dropdown-list">
                  {cities.map((option, index) => (
                    <div
                    key={index}
                    id={option.city_id}
                    name="city_name"
                    className={`${
                      vendorData.city_name === option.city_name ? "text-blue-1" : ""
                    } js-dropdown-link`}
                    onClick={()=>{handleCityDropDownChange(option)}}
                    >
                    {option.city_name}
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-6">
            <div className="form-input" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
              <div className="dropdown js-dropdown js-services-active w-100">
                <div
                  className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  data-bs-offset="0,10"
                >
                  <span className="js-dropdown-title">{vendorData.region_name || "Select Region"}</span>
                  <i className="icon icon-chevron-sm-down text-7 ml-10" />
                </div>
                <div className="toggle-element -dropdown w-100 dropdown-menu">
                  <div className="text-14 y-gap-15 js-dropdown-list">
                  {regions.map((option, index) => (
                    <div
                    key={index}
                    id={option.id}
                    name="region_name"
                    className={`${
                      vendorData.region_name === option.region_name ? "text-blue-1" : ""
                    } js-dropdown-link`}
                    onClick={()=>{handleRegionDropDownChange(option)}}
                    >
                    {option.region_name}
                    </div>
                  ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-6">
            <div className="form-input">
              <input type="text" required name="state" value={vendorData?.state} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">State/Province <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          <div className="col-6">
            <div className="form-input">
              <input type="text" required name="pincode" value={vendorData?.pincode} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Postal Code <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          <div className="col-12">
            <div className="form-input">
              <input type="text" required name="country" value={vendorData?.country} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Country <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          <div className="col-6">
            <div className="form-input">
              <input type="tel" required name="contact_number" value={vendorData?.contact_number} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Contact Number <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          <div className="col-6">
            <div className="form-input">
              <input type="email" required name="email" value={vendorData?.email} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Contact Email <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          <div className="col-12">
            <div className="form-input">
              <input type="url" required name="website" value={vendorData?.website} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Website URL</label>
            </div>
          </div>

          <div className="col-12">
            <div className="form-input">
              <input type="url" required name="maplink" value={vendorData?.maplink} onChange={handleChange} />
              <label className="lh-1 text-16 text-light-1">Google Maps Link</label>
            </div>
          </div>
          {/* End youtube Video */}
        </div>
      </div>
    </>
  );
};

export default BasicInformation;

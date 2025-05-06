import HotelContent from "./content/HotelContent";
import HotelPolicy from "./content/HotelPolicy";
import BannerUploader from "./content/BannerUploader";
import FeaturedUploader from "./content/FeaturedUploader";
import GalleryUploader from "./content/GalleryUploader";
import { useEffect, useState } from "react";
// import RegionSearch from "@/components/hero/hero-1/RegionSearch";
import LocationSearch from "@/components/hero/hero-1/LocationSearch";
import axios from 'axios';
import { api } from "@/utils/apiProvider";
import { debounce } from "@/utils/DOMUtils";

const AdministrativeControl = ({ venueFormData = {}, handleChange = () => {}, handleDropDownChange, handleCheckBox }) => {
  const [searchUser, setSearchUser] = useState(venueFormData?.name || "");
  const [users, setUsers] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await axios.get(`${api}/api/user/search-users`, {
        params: { page: 1, limit: 10, search: searchUser},
      });
      if (response.data.success) {
        setUsers(response.data.data);
      }
    } catch (error) {
      showAlert("Something went wrong while fetching users!");
    }
  };

  useEffect(() => {
    fetchUser();
  }, [searchUser]);

  useEffect(() => {
    fetchUser();
  }, []);

   const onSearchUserChange = (e) => {
      debounce(()=>{
        setSearchUser(e.target.value);
      }
        ,1000)
      (e.target.value);
    } 

  const handleUserDropDownChange = (user) => {
    handleDropDownChange({ name: "user_id", value: user.user_id });
    setSearchUser(user.name);
  };

  return (
    <>
      <div className="col-xl-10">
        <div className="row x-gap-20 y-gap-20">
          <div className="col-12">
            <div className="form-input ">
              <input
                type="text"
                required
                name="special_label"
                value={venueFormData?.special_label}
                onChange={handleChange}
              />
              <label className="lh-1 text-16 text-light-1">Special Label <span style={{ color: 'red', fontWeight: '500' }}>*</span></label>
            </div>
          </div>

          {/* Dropdown for Publish / Draft */}
          <div className="col-12">
            <div className="d-flex">
              <div className="form-input" style={{ border: "1px solid #ccc", borderRadius: "4px", padding: "8px" }}>
                <div className="dropdown js-dropdown js-services-active w-100">
                  <div
                    className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 h-50 text-14"
                    data-bs-toggle="dropdown"
                    data-bs-auto-close="true"
                    aria-expanded="false"
                    data-bs-offset="0,10"
                  >
                    <input
                      type="text"
                      readOnly
                      value={venueFormData.is_enable ? "Publish" : "Draft"}
                      className="js-search js-dd-focus"
                      style={{
                        marginTop: "-20px",
                        border: "none",
                        position: "relative",
                        top: "13px",
                        left: "-29px",
                        backgroundColor: "transparent"
                      }}
                    />
                    <label className="lh-1 text-16 text-light-1" style={{ left: "-10px", top: "8px" }}>Status</label>
                    <i className="icon icon-chevron-sm-down text-7 ml-10" />
                  </div>
                  <div className="toggle-element -dropdown w-100 dropdown-menu">
                    <div className="text-14 y-gap-15 js-dropdown-list">
                      <div
                        className={`js-dropdown-link ${venueFormData.is_enable ? "text-blue-1" : ""}`}
                        onClick={() => {
                          handleCheckBox({ name: "is_enable", value: true });
                        }}
                      >
                        <div className="ml-10">
                          <div className="text-15 lh-12 fw-500 js-search-option-target">
                            Publish
                          </div>
                        </div>
                      </div>
                      <div
                        className={`js-dropdown-link ${!venueFormData.is_enable ? "text-blue-1" : ""}`}
                        onClick={() => {
                          handleCheckBox({ name: "is_enable", value: false });
                        }}
                      >
                        <div className="ml-10">
                          <div className="text-15 lh-12 fw-500 js-search-option-target">
                            Draft
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Other form fields */}
          <div className="col-12">
            <div className="d-flex">
              <div className="form-checkbox mt-5">
                <input
                  type="checkbox"
                  onChange={(e) => { handleCheckBox({ name: "is_featured", value: e.target.checked }) }}
                  name="is_featured"
                  checked={venueFormData.is_featured}
                  value={venueFormData.is_featured}
                />
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
              </div>
              <div className="text-15 lh-15 text-light-1 ml-10">
                Do you want to make this venue as featured.
              </div>
            </div>
          </div>

          {/* User Dropdown */}
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
                  <input
                    type="search"
                    autoComplete="off"
                    required
                    className="js-search js-dd-focus"
                    onChange={onSearchUserChange}
                    style={{
                      marginTop: "-30px",
                      border: `none`,
                      position: "relative",
                      top: "13px",
                      left: "-29px"
                    }}
                  />
                  <label className="lh-1 text-16 text-light-1" style={{ left: "-10px", top: "16px" }}>{searchUser ? "Selected User :" + searchUser : "Update Owner"}</label>
                  <i className="icon icon-chevron-sm-down text-7 ml-10" />
                </div>
                <div className="toggle-element -dropdown w-100 dropdown-menu">
                  <div className="text-14 y-gap-15 js-dropdown-list">
                    {users.map((user, index) => (
                      <div
                        key={index}
                        id={user.id}
                        name="user_id"
                        className={`${venueFormData.user_id === user.user_id ? "text-blue-1" : ""} js-dropdown-link`}
                        onClick={() => { handleUserDropDownChange(user) }}
                      >
                        <div className="ml-10">
                          <div className="text-15 lh-12 fw-500 js-search-option-target">
                            {user.name}
                          </div>
                          <div className="text-14 lh-12 text-light-1 mt-5">
                            {user.email}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};

export default AdministrativeControl;

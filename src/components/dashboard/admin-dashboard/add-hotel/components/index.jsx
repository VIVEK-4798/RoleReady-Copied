import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import BasicInformation from "./BasicInformation";
import DetailsAndPricing from "./DetailsAndPricing";
import MediaAndResources from "./MediaAndResources";
import AdministrativeControl from "./AdministrativeControl";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { useLocation, useNavigate, useParams } from "react-router-dom";
// import { showAlert } from "@/utils/isTextMatched";

const Index = () => {
  let params = useParams();
  const state = useLocation()?.state || null;
  const mode = params.mode;
  const [allCategories, setAllCategories] = useState([]);
  const [errors, setError] = useState([]);
  const navigate = useNavigate();

  const [venueFormData, setVenueFormData] = useState({
    venue_name: "",        // Venue name
    venue_address: "",     // Venue address
    state: "",             // State
    pincode: "",           // Pincode
    country: "",           // Country
    venue_phone_no: "",    // Venue phone number
    venue_email: "",       // Venue email
    website: "",           // Website
    venue_categories: [],  // Venue categories (will be an array for multiple selections)
    venue_rate: "",        // Venue rate
    venue_overview: "",    // Venue overview
    venue_map_url: "",     // Venue map URL
    venue_images: [],    // Venue images (Blob, default is null)
    veg_package_price: "", // Veg package price
    veg_package: [],       // Veg package
    non_veg_package_price: "", // Non-veg package price
    non_veg_package: [],   // Non-veg package
    city_name:"",
    region_name:"",
    is_enable : false
  });

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);

  const fetchCategories = async () => {
    try {
        const response = await axios.get(`${api}/api/categories/get-categories`);
        if (response.data.success) {
          setAllCategories(response.data.results);
        }
    } catch (error) {
        console.log('failed to fetch the user');
        console.error(error);
    }
  };

  useEffect(()=>{
    if (mode === "add") {
      setVenueFormData({
        venue_name: "",      
        venue_address: "",    
        state: "",           
        pincode: "",         
        country: "",          
        venue_phone_no: "",  
        venue_email: "",      
        website: "",         
        venue_categories: [], 
        venue_rate: "",        
        venue_overview: "",   
        venue_map_url: "",    
        venue_images: [],  
        veg_package_price: "",
        veg_package: [],    
        non_veg_package_price: "",
        non_veg_package: [], 
        city_name:"",
        region_name:"",
        is_enable: true})
    }
  },[mode]);

  useEffect(()=>{
    fetchCategories();
    if (mode === "edit") {
      let editFormData = {};
      if (state != null) {
        editFormData = {
          ...state,
          venue_categories : JSON.parse(state?.venue_categories),
          venue_images : JSON.parse(state?.venue_images),
          veg_package : JSON.parse(state?.veg_package),
          non_veg_package : JSON.parse(state?.non_veg_package)
        }
        setVenueFormData((prevState) => ({
          ...prevState,
          ...editFormData
        }));
      }
    }
  },[]);

  useEffect(() => {
    const isFormIncomplete = Object.values(venueFormData).some(value => value === "" || (Array.isArray(value) && value.length === 0));
    setIsSaveDisabled(isFormIncomplete);
    setIsNextDisabled(false);  // Adjust this based on specific step validation if needed
  }, [venueFormData]);

  const handleCategoryDropDownChange = (category)=> {
    const {category_name, category_color_class} = category;
    let new_venue_categories = [];
    if (venueFormData.venue_categories.some(obj => obj["category_name"] === category_name)) {
      new_venue_categories = venueFormData.venue_categories.filter((category)=>{return category_name !== category.category_name})
    } else {
      new_venue_categories = venueFormData.venue_categories;
      new_venue_categories.push({category_name:category_name,category_color_class: category_color_class});
    }
    setVenueFormData((prevState) => ({
      ...prevState,
      venue_categories: new_venue_categories,
    }));
  }

  const handleDropDownChange = ({name,value}) => {
    setVenueFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  }

  const handleChange = (event)=> {
    const {name,value} = event.target;
    setVenueFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  }

  const handleCheckBox = (checkbox)=>{
    const {name,value} = checkbox;
    setVenueFormData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  } 

  const [tabIndex, setTabIndex] = useState(0);
  const defaultTabs = [
    {
      label: "Basic Information",
      labelNo: 1,
      content: <BasicInformation venueFormData={venueFormData} handleChange={handleChange} setVenueFormData={setVenueFormData} handleDropDownChange={handleDropDownChange}/>,
    },
    {
      label: "Details & Pricing",
      labelNo: 2,
      content: <DetailsAndPricing  handleChange={handleChange}  handleDropDownChange={handleDropDownChange}  venueFormData={venueFormData} allCategories={allCategories} handleCategoryDropDownChange = {handleCategoryDropDownChange}/>,
    },
    {
      label: "Media & Resources",
      labelNo: 3,
      content: <MediaAndResources venueFormData={venueFormData} setVenueFormData={setVenueFormData}/>,
    }
  ];

  const getTabs = () => {
    if (localStorage.getItem("role") === "admin" && defaultTabs.some((tab)=>{return tab.label !== "Administrative Control"})) {
      defaultTabs.push({
        label: "Administrative Control",
        labelNo: 4,
        content: <AdministrativeControl venueFormData={venueFormData} handleChange={handleChange} handleCheckBox={handleCheckBox} handleDropDownChange={handleDropDownChange} />,
      })
    }
    return defaultTabs;
  }

  const validateFormData = (formData) => {
    const errors = [];
    Object.keys(formData).forEach((key) => {
      if (key === "is_featured") return;
      const value = formData[key];
      if (Array.isArray(value) && value.length === 0) {
        errors.push(`${key.replace(/_/g, ' ')} is required.`);
      }
      else if (typeof value === "string" && value.trim() === "") {
        errors.push(`${key.replace(/_/g, ' ')} is required.`);
      }
      else if (typeof value === "number" && isNaN(value)) {
        errors.push(`${key.replace(/_/g, ' ')} is required.`);
      }
    });
    return errors;
  };

  const getUserId = () => {
    const keys = ['adminId', 'vendor-userId', 'venue-userId'];
    for (const key of keys) {
      const value = localStorage.getItem(key);
      if (value) {
        return value;
      }
    }
    return null;
  }

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    const currentError = validateFormData(venueFormData);
    setError(currentError);
    if (currentError.length > 0) {
      showAlert(currentError[0], "error");
      console.error("Form validation failed:", errors);
    } else {
      let ApiBody = {
        ...venueFormData,
        venue_categories: JSON.stringify(venueFormData.venue_categories),
        veg_package: JSON.stringify(venueFormData.veg_package),
        non_veg_package: JSON.stringify(venueFormData.non_veg_package),
        venue_images: JSON.stringify(venueFormData.venue_images)
      }
      if (mode === "add") {
        ApiBody = {
          ...ApiBody,
          user_id: getUserId()
        }
      }
      else if (mode === "edit") {
        if (ApiBody.name || ApiBody.mobile || ApiBody.email || ApiBody.email || ApiBody.user_name) {
          delete ApiBody.name;
          delete ApiBody.mobile;
          delete ApiBody.email;
          delete ApiBody.user_name
        }
      }
      try {
        const url = mode === "edit" ? `${api}/api/venue/update-venue/${state.venue_id}` : `${api}/api/venue/add-venue`;
        const response = await axios.post(url, ApiBody);
        if (response.data.results === true) {
          setVenueFormData({
            venue_name: "",        // Venue name
            venue_address: "",     // Venue address
            state: "",             // State
            pincode: "",           // Pincode
            country: "",           // Country
            venue_phone_no: "",    // Venue phone number
            venue_email: "",       // Venue email
            website: "",           // Website
            venue_categories: [],  // Venue categories (will be an array for multiple selections)
            venue_rate: "",        // Venue rate
            venue_overview: "",    // Venue overview
            venue_map_url: "",     // Venue map URL
            venue_images: [],      // Venue images (Blob, default is null)
            veg_package_price: "", // Veg package price
            veg_package: [],       // Veg package
            non_veg_package_price: "", // Non-veg package price
            non_veg_package: [],   // Non-veg package
            is_featured: false,
            special_lable: ""
          });
          navigate("/admin-dashboard/venues");
        } else {
          showAlert('something went wrong', 'error');
        }
      } catch (error) {
        if (error) window.alert(error.response.data.error);
        console.error('Error:', error);
      }
      console.log("Form is valid, submitting data...");
    }
  };

  const handleNextStep = () => {
    setTabIndex((prev) => (prev + 1) % getTabs().length);
  }

  return (
    <>
      <Tabs
        className="tabs -underline-2 js-tabs"
        selectedIndex={tabIndex}
        onSelect={(index) => setTabIndex(index)}
      >
        <TabList className="tabs__controls row x-gap-40 y-gap-10 lg:x-gap-20">
          {getTabs().map((tab, index) => (
            <Tab key={index} className="col-auto">
              <button className="tabs__button text-18 lg:text-16 text-light-1 fw-500 pb-5 lg:pb-0 js-tabs-button">
                {tab.labelNo}. {tab.label}
              </button>
            </Tab>
          ))}
        </TabList>

        <div className="tabs__content pt-30 js-tabs-content">
          {getTabs().map((tab, index) => (
            <TabPanel
              key={index}
              className={`-tab-item-${index + 1} ${
                tabIndex === index ? "is-tab-el-active" : ""
              }`}
            >
              {tab.content}
            </TabPanel>
          ))}
        </div>
      </Tabs>
      <div className="pt-30" style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {errors.length !== 0 && <div className="text-15 lh-15 text-light-1 ml-10">
          {errors[0]}
        </div>}
        <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" onClick={handleNextStep} style={{ marginRight: '10px' }} disabled={isNextDisabled}>
          Next Step <div className="icon-arrow-top-right ml-15" />
        </button>
        <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" onClick={handleSubmit} disabled={isSaveDisabled}>
          Save Changes <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </>
  );
};

export default Index;

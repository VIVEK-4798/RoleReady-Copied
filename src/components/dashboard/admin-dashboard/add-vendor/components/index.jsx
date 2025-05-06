import React, { useEffect, useState } from "react";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import BasicInformation from "./BasicInformation";
import DetailsAndPricing from "./DetailsAndPricing";
import MediaAndResources from "./MediaAndResources";
import AttributesTabContent from "./AttributesTabContent";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import AdministrativeControl from "./AdministrativeControl";
import { useLocation, useNavigate, useParams } from "react-router-dom";


const Index = () => {
  let params = useParams();
  const state = useLocation()?.state || null;
  const mode = params.mode;
  const [services, setServices] = useState([]);
  const [component, setComponent] = useState(null);
  const [errors, setError] = useState([]);
  const navigate = useNavigate();

  const [vendorData, setVendorData] = useState({
    vendor_name: '',        
    vendor_rate: '',            
    vendor_package: [],         
    vendor_overview: '',        
    portfolio: [],              
    contact_number: '',
    pincode: '',
    vendor_address: '',
    city_name: '',
    vendor_service: '',
    country: '',
    email: '',
    maplink: '',
    website: '',
    state: '',
    region_name: '',
    is_enable: true,
    special_lable: '',
    is_featured: false,
    responsibilities: '',     
    requirements: '',      
    perks: '',      
    eligibility: '',      
    job_type: '',               
    work_detail: '',            
    job_salary: '',  
    work_experience: '',        
  });
  

  const [isSaveDisabled, setIsSaveDisabled] = useState(true);
  const [isNextDisabled, setIsNextDisabled] = useState(false);
  
  const fetchService = async () => {
    try {
        const response = await axios.get(`${api}/api/service/get-services`);
        if (response.data.success) {
          setServices(response.data.results);
        }
    } catch (error) {
        console.log('failed to fetch the user');
        console.error(error);
    }
  };

  useEffect(()=>{
    if (mode === "add") {
      setVendorData({vendor_name: '',    
        vendor_name: '',        
        vendor_rate: '',            
        vendor_package: [],         
        vendor_overview: '',        
        portfolio: [],              
        contact_number: '',
        pincode: '',
        vendor_address: '',
        city_name: '',
        vendor_service: '',
        country: '',
        email: '',
        maplink: '',
        website: '',
        state: '',
        region_name: '',
        is_enable: true,
        special_lable: '',
        is_featured: false,
        responsibilities: '',     
        requirements: '',      
        perks: '',      
        eligibility: '',      
        job_type: '',               
        work_detail: '',            
        job_salary: '',  
        work_experience: '',  
      })
    }
  },[mode])
  useEffect(()=>{
    fetchService();
    if (mode === "edit") {
      let editFormData = {};
      if (state != null) {
        editFormData = {
          ...state,
          vendor_package : JSON.parse(state?.vendor_package),
          portfolio : JSON.parse(state?.portfolio)
        }
        setVendorData((prevState) => ({
          ...prevState,
          ...editFormData
        }));
      }
    }
    
  },[]);

  const handleComponentChange = (e) => {
    const {name,value} = e.target;
    setComponent((prevState)=>({
      ...prevState,
      [name]:value
    }))
  }

  useEffect(() => {
    const requiredFields = [
      "vendor_name",
      "vendor_package",
      "vendor_overview",
      "vendor_address",
      "vendor_service",
      "country",
      "email",
      "state",
      "special_lable",
    ];
  
    const isFormIncomplete = requiredFields.some(key => {
      const value = vendorData[key];
      return value === "" || (Array.isArray(value) && value.length === 0);
    });
  
    setIsSaveDisabled(isFormIncomplete);
    setIsNextDisabled(false); // Adjust based on step validation
  }, [vendorData]);
  

  const handleSubmitComponent = ()=>{
    let new_package = vendorData.vendor_package;
    new_package.push({...component,id: Math.floor(Date.now() / 1000)});
    setVendorData((prevState) => ({
      ...prevState,
      vendor_package: new_package,
    }));
    setComponent({component_name:"",component_remark:""});
  }

  const handleComponentDelete = (id)=>{
    let new_package = vendorData.vendor_package.filter((item)=>{return item.id !== id});
    setVendorData((prevState) => ({
      ...prevState,
      vendor_package: new_package,
    }));
  }

  const handleServiceDropDownChange = (service)=> {
    const {service_name} = service;
    setVendorData((prevState) => ({
      ...prevState,
      vendor_service: service_name,
    }));
  }

  const handleDropDownChange = ({name,value}) => {
    setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  }

  const handleChange = (event)=> {
    const {name,value} = event.target;
    setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  }

  const handleCheckBox = (checkbox)=>{
    const {name,value} = checkbox;
    setVendorData((prevState) => ({
        ...prevState,
        [name]: value,
    }));
  } 

  const [tabIndex, setTabIndex] = useState(0);
  const defaultTabs = [
    {
      label: "Basic Information",
      labelNo: 1,
      content: <BasicInformation vendorData={vendorData} handleChange={handleChange} handleDropDownChange={handleDropDownChange}/>,
    },
    {
      label: "Details & Pricing",
      labelNo: 2,
      content: <DetailsAndPricing vendorData={vendorData} handleChange={handleChange} handleDropDownChange={handleDropDownChange} handleComponentDelete={handleComponentDelete} component={component} handleComponentChange = {handleComponentChange} handleSubmitComponent={handleSubmitComponent} services={services} handleServiceDropDownChange = {handleServiceDropDownChange}/>,
    },
    {
      label: "Media & Resources",
      labelNo: 3,
      content: <MediaAndResources  vendorData={vendorData} setVendorData={setVendorData}/>,
    }
  ];
  
  const getTabs = () => {
    if (localStorage.getItem("role") === "admin" && defaultTabs.some((tab)=>{return tab.label !== "Administrative Control"})) {
      defaultTabs.push({
        label: "Administrative Control",
        labelNo: 4,
        content: <AdministrativeControl vendorData={vendorData} handleChange={handleChange} handleCheckBox={handleCheckBox} />,
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
    const currentError = validateFormData(vendorData);
    setError(currentError);
    if (currentError.length > 0) {
      showAlert(currentError[0],"error");
      console.error("Form validation failed:", errors);
    } else {
      let ApiBody = {
        ...vendorData,
        vendor_package: JSON.stringify(vendorData.vendor_package),
        portfolio: JSON.stringify(vendorData.portfolio)
      }
      if (mode === "add") {
        ApiBody = {
          ...ApiBody,
          user_id: getUserId(),
        }
      }
      else if (mode === "edit") {
        if (ApiBody.name) {
          delete ApiBody.name;
          delete ApiBody.mobile;
          delete ApiBody.email;
        }
      }
      try 
        {
          const url = mode === "edit" ? `${api}/api/vendor/update-vendor/${state.service_reg_id}` :`${api}/api/vendor/add-vendor`;
          const response = await axios.post(url, ApiBody);
          if (response.data.results === true) {
              setVendorData({
                service_reg_id: null,          
                user_id: '',                 
                vendor_name: '',        
                vendor_rate: '',            
                vendor_package: [],         
                vendor_overview: '',        
                portfolio: [],              
                contact_number: '',
                pincode: '',
                vendor_address: '',
                city_name: '',
                vendor_service: '',
                country: '',
                email: '',
                maplink: '',
                website: '',
                state: '',
                region_name: '',
                is_enable: true,
                special_lable: '',
                is_featured: false,
                responsibilities: '',     
                requirements: '',      
                perks: '',      
                eligibility: '',      
                job_type: '',               
                work_detail: '',            
                job_salary: '',  
                work_experience: '',
              });
              showAlert("Vendor Updated successfully","success")
              navigate("/admin-dashboard/vendors");
          } else {
            //window.alert("Something went wrong");  
            showAlert('something went wrong', 'error');
          }
        } catch (error) {
          if(error)
            showAlert(error?.message|| "Something went wrong","danger")
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
      <div
        className="pt-30"
        style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}
      >
        {errors.length !== 0 && (
          <div className="text-15 lh-15 text-light-1 ml-10">{errors[0]}</div>
        )}
        <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" onClick={handleNextStep} style={{ marginRight: "10px" }} disabled={isNextDisabled}>
          Next Step <div className="icon-arrow-top-right ml-15" />
        </button>
        <button className="button h-50 px-24 -dark-1 bg-blue-1 text-white" onClick={handleSubmit}disabled={isSaveDisabled}>
          Save Changes <div className="icon-arrow-top-right ml-15" />
        </button>
      </div>
    </>
  );
};

export default Index;

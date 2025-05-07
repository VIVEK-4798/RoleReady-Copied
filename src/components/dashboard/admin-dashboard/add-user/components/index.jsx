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
  const [errors, setError] = useState([]);
  const navigate = useNavigate();
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const [tabIndex, setTabIndex] = useState(0);
  const defaultTabs = [
    {
      label: "User Information",
      labelNo: 1,
      content: <BasicInformation />,
    },
  ];
  
  const getTabs = () => {
  
    return defaultTabs;
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
    </>
  );
};

export default Index;

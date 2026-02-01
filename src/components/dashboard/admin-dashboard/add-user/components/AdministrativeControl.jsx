import HotelContent from "./content/HotelContent";
import HotelPolicy from "./content/HotelPolicy";
import BannerUploader from "./content/BannerUploader";
import FeaturedUploader from "./content/FeaturedUploader";
import GalleryUploader from "./content/GalleryUploader";
import { useEffect, useState } from "react";
import LocationSearch from "@/components/hero/hero-5/LocationSearch";

const AdministrativeControl = ({vendorData, handleChange = ()=>{},handleCheckBox}) => {

  return (
    <>
      <div className="col-xl-10">
        <div className="row x-gap-20 y-gap-20">
          <div className="col-12">
            <div className="form-input ">
              <input type="text" required name="special_label" value={vendorData?.special_label} onChange={handleChange}/>
              <label className="lh-1 text-16 text-light-1">Special Label</label>
            </div>
          </div>
          <div className="col-12">
            <div className="d-flex ">
              <div className="form-checkbox mt-5">
                <input type="checkbox" onChange={(e)=>{handleCheckBox({name:"is_featured",value: e.target.checked})}} name="is_featured" checked={vendorData.is_featured === 1} value={vendorData.is_featured}/>
                <div className="form-checkbox__mark">
                  <div className="form-checkbox__icon icon-check" />
                </div>
              </div>
              <div className="text-15 lh-15 text-light-1 ml-10">
                Do you want this site to feature.
              </div>
            </div>
          </div>
          {/* End youtube Video */}
        </div>
      </div>
    </>
  );
};

export default AdministrativeControl;

import "photoswipe/dist/photoswipe.css";
import { hotelsData } from "@/data/hotels";
import Header11 from "@/components/header/header-11";
import Overview from "@/components/hotel-single/Overview";
import PopularFacilities from "@/components/hotel-single/PopularFacilities";
import PropertyHighlights from "@/components/hotel-single/PropertyHighlights";
import RatingTag from "@/components/hotel-single/RatingTag";
import StickyHeader from "@/components/hotel-single/StickyHeader";
import TopBreadCrumb from "@/components/hotel-single/TopBreadCrumb";
import SidebarRight from "@/components/hotel-single/SidebarRight";
import AvailableRooms from "@/components/hotel-single/AvailableRooms";
import ReviewProgress from "@/components/hotel-single/guest-reviews/ReviewProgress";
import DetailsReview from "@/components/hotel-single/guest-reviews/DetailsReview";
import ReplyForm from "@/components/hotel-single/ReplyForm";
import ReplyFormReview from "@/components/hotel-single/ReplyFormReview";
import Facilities from "@/components/hotel-single/Facilities";
import { useEffect, useState } from "react";
import axios from "axios";
import { getId } from "@/utils/DOMUtils";
import { api } from "@/utils/apiProvider";
import Surroundings from "@/components/hotel-single/Surroundings";
import HelpfulFacts from "@/components/hotel-single/HelpfulFacts";
import Faq from "@/components/faq/Faq";
import Hotels2 from "@/components/hotels/Hotels2";
import CallToActions from "@/components/common/CallToActions";
import DefaultFooter from "@/components/footer/default";
import GalleryOne from "@/components/hotel-single/GalleryOne";
import { useParams } from "react-router-dom";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Internship Single || GoHire - Internship & Career React Template",
  description: "Explore detailed internship opportunities on GoHire.",
};


const HotelSingleV1Dynamic = () => {
  let params = useParams();
  const id = params.id;

  const hotel = hotelsData.find((item) => item.id == id) || hotelsData[0];
  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  const fetchInternship = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get(`${api}/api/venue/get-venue/${id}`);
      setInternship(response.data || []);
    } catch (err) {
      setError("An error occurred while fetching internship data.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    fetchInternship();
  }, [id]);
  

  return (
    <>
      <MetaComponent meta={metadata} />

      <div className="header-margin"></div>

      <Header11 />
        {internship && Object.keys(internship).length > 0 && (
          <TopBreadCrumb internship={internship}/>
        )}
      {/* End top breadcrumb */}
      {internship && Object.keys(internship).length > 0 && (
          <StickyHeader internship={internship} />
        )}
      {/* sticky single header for hotel single */}

      {internship && Object.keys(internship).length > 0 && (
          <GalleryOne internship={internship} />
        )}

      {/* End gallery grid wrapper */}

      <section className="pt-30">
        <div className="container">
          <div className="row y-gap-30">
            <div className="col-xl-8">
              <div className="row y-gap-40">
                <div className="col-12">
                  {internship && Object.keys(internship).length > 0 && (
                    <PropertyHighlights internship={internship} />
                  )}
                </div>

                <div id="overview" className="col-12">
                {internship && Object.keys(internship).length > 0 && (
                  <Overview internship={internship}/>
                )}
                </div>

                <div className="col-12">
                  <div className="row y-gap-10 pt-20">
                  {internship && Object.keys(internship).length > 0 && (
                  <PopularFacilities internship={internship}/>
                )}
                  </div>
                </div>

                <div className="col-12">
                  <RatingTag />
                </div>
              </div>
            </div>

            <div className="col-xl-4">
            {internship && Object.keys(internship).length > 0 && (
                  <SidebarRight internship={internship}/>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="mt-40" id="facilities">
        <div className="container">
          <div className="row x-gap-40 y-gap-40">
            <div className="col-12">
              <h3 className="text-22 fw-500">Intern Requirements</h3>
              <div className="row x-gap-40 y-gap-40 pt-20">
              {internship && Object.keys(internship).length > 0 && (
                  <Facilities internship={internship}/>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pt-40">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row">
              <div className="col-12">
                <h3 className="text-22 fw-500">Intern Perks</h3>
              </div>
            </div>
            {/* End .row */}

            <div className="row x-gap-50 y-gap-30 pt-20">
            {internship && Object.keys(internship).length > 0 && (
                  <HelpfulFacts internship={internship}/>
                )}
            </div>
          </div>
        </div>
      </section>

      <section className="pt-40">
        <div className="container">
          <div className="row border-top-light">
            <div className="col-xl-8 col-lg-10 mt-30">
              <div className="row">
                <div className="col-auto">
                  <h3 className="text-22 fw-500">Leave a Reply</h3>
                  <p className="text-15 text-dark-1 mt-5">
                    Your email address will not be published.
                  </p>
                </div>
              </div>
              <ReplyForm />
            </div>
          </div>
        </div>
      </section>

      <section className="pt-40">
        <div className="container">
          <div className="row">
            <div className="col-12">
              <div className="px-24 py-20 rounded-4 bg-light-2">
                <div className="row x-gap-20 y-gap-20 items-center">
                  <div className="col-auto">
                    <div className="flex-center size-60 rounded-full bg-white">
                      <i className="bi bi-laptop text-24 text-dark"></i>
                    </div>
                  </div>
                  <div className="col-auto">
                    <h4 className="text-18 lh-15 fw-500">
                      Verified Internship Opportunity
                    </h4>
                    <div className="text-15 lh-15">
                      This internship is vetted by our team to ensure it provides real-world experience, mentorship, and growth opportunities for students and freshers.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="faq" className="pt-40 layout-pb-md">
        <div className="container">
          <div className="pt-40 border-top-light">
            <div className="row y-gap-20">
              <div className="col-lg-4">
                <h2 className="text-22 fw-500">
                  FAQs about
                  <br /> Startups24x7 Internships
                </h2>
              </div>

              <div className="col-lg-8">
                <div className="accordion -simple row y-gap-20 js-accordion">
                  <Faq />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <div className="col-auto">
            <div className="sectionTitle -md">
              <h2 className="sectionTitle__title">
                Popular internships similar to this opportunity
              </h2>
              <p className=" sectionTitle__text mt-5 sm:mt-0">
                Explore similar internships that match your skills and interests
              </p>
            </div>
            </div>
          </div>

          <div className="pt-40 sm:pt-20 item_gap-x30">
            <Hotels2 />
          </div>
        </div>
      </section>
      <CallToActions />

      <DefaultFooter />
    </>
  );
};

export default HotelSingleV1Dynamic;

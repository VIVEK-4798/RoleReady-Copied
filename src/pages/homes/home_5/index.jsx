import Header5 from "@/components/header/header-5";
import Hero5 from "@/components/hero/hero-5";
import { Link } from "react-router-dom";
import Footer4 from "@/components/footer/footer-4";
import Tours2 from "@/components/tours/Tours2";
import TourCategories from "@/components/home/home-5/TourCategories";
import Locations from "@/components/home/home-5/Locations";
import CallToActions from "@/components/home/home-5/CallToActions";
import Blog from "@/components/blog/Blog3";
import Tours3 from "@/components/tours/Tours3";
import DiscountsBanner from "@/components/home/home-5/DiscountsBanner";
import Counter3 from "@/components/counter/Counter3";
import WhyChooseUs from "@/components/home/home-5/WhyChooseUs";
import JoinOurBusiness from "@/components/home/home-5/JoinOurBusiness";
import Testimonial from "@/components/home/home-5/Testimonial";
import Brand2 from "@/components/brand/Brand2";
import DefaultHeader from "@/components/header/default-header";

import MetaComponent from "@/components/common/MetaComponent";

const metadata = {
  title: "Webeazzy",
  description: "Webeazzy - Travel & Tour ReactJs Template",
};

const Home_5 = () => {
  return (
    <>
      <MetaComponent meta={metadata} />
      {/* End Page Title */}

      {/* <Header5 /> */}
      <DefaultHeader />
      {/* End Header 5 */}

      <Hero5 />
      {/* End Hero 5 */}

      {/* <section className="layout-pt-lg layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Most Popular Tours</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>

            <div className="col-auto">
              <Link
                to="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                More <div className="icon-arrow-top-right ml-15" />
              </Link>
            </div>
          </div>

          <div className="row y-gap-30 pt-40 sm:pt-20 item_gap-x30">
            <Tours2 />
          </div>
        </div>
      </section> */}
      {/* End Tours Sections */}

      {/* <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Choose Tour Types</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex x-gap-15 items-center ">
                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-left-hover js-tour-type-prev">
                    <i className="icon icon-arrow-left" />
                  </button>
                </div>

                <div className="col-auto">
                  <div className="pagination -dots text-border js-tour-type-pag" />
                </div>

                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-right-hover js-tour-type-next">
                    <i className="icon icon-arrow-right" />
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="relative overflow-hidden pt-40 sm:pt-20">
            <TourCategories />
          </div>
        </div>
      </section> */}

      {/* <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Explore Hot Locations</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Interdum et malesuada fames ac ante ipsum
                </p>
              </div>
            </div>

            <div className="col-auto">
              <a
                href="#"
                className="button -md -blue-1 bg-blue-1-05 text-blue-1"
              >
                More <div className="icon-arrow-top-right ml-15" />
              </a>
            </div>
          </div>

          <div className="row y-gap-30 pt-40 sm:pt-20">
            <Locations />
          </div>
        </div>
      </section> */}
      {/* End Explore Hot Locations */}

      <section className="layout-pt-md layout-pb-md">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
            <div className="sectionTitle -md">
                <h2 className="sectionTitle__title">Deals &amp; Discounts</h2>
                <p className=" sectionTitle__text mt-5 sm:mt-0">
                  Get Deals on hosting, SaaS, AI tools & more
                </p>
              </div>
            </div>
            {/* End .col */}

            <div className="col-auto">
              <div className="d-flex x-gap-15 items-center ">
                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-left-hover js-tour-discounts-prev">
                    <i className="icon icon-arrow-left" />
                  </button>
                </div>
                {/* End prev navigation */}
                <div className="col-auto">
                  <div className="pagination -dots text-border js-tour-discount-pagination" />
                </div>
                {/* End pagination */}
                <div className="col-auto">
                  <button className="d-flex items-center text-24 arrow-right-hover js-tour-discounts-next">
                    <i className="icon icon-arrow-right" />
                  </button>
                </div>
                {/* End .next navigation */}
              </div>
            </div>
            {/* End .col for swiper navigation and pagination */}
          </div>
          {/* End .col */}

          <div className="row y-gap-30 pt-40">
            <div className="col-xl-5">
              <DiscountsBanner />
            </div>
            {/* End col-xl-5 */}

            <div className="col-xl-7">
              <Tours3 />
            </div>
            {/* End col-xl-7 */}
          </div>
          {/* End .row */}
        </div>
        {/* End .container */}
      </section>
      {/* End Deals & Discounts */}

      <section className="layout-pt-md layout-pb-lg">
        <div className="container">
          <div className="row justify-center text-center">
            <Counter3 />
          </div>
        </div>
      </section>
      {/* End counter up Section */}

      <section className="section-bg layout-pt-lg md:pt-0 md:pb-60 sm:pb-40 layout-pb-lg bg-blue-1-05">
        <WhyChooseUs />
      </section>
      {/* End whycosse Section */}
        
      <section className="section-bg layout-pt-lg md:pt-0 md:pb-60 sm:pb-40 layout-pb-lg">
        <JoinOurBusiness />
      </section>
      {/* End whycosse Section */}


      <CallToActions />
      {/* End CallToActions */}

      <Footer4 />
      {/* End Footer Section */}
    </>
  );
};

export default Home_5;

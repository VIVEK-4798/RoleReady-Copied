import Header5 from "@/components/header/header-5";
import Hero5 from "@/components/hero/hero-5";
import { Link } from "react-router-dom";
import Footer4 from "@/components/footer/footer-4";
import DefaultCallToActions from "@/components/common/CallToActions";
import GuestCallToActions from "@/components/home/home-5/CallToActions";
import Counter3 from "@/components/counter/Counter3";
import WhyChooseUs from "@/components/home/home-5/WhyChooseUs";
import BenefitsBar from "@/components/home/home-5/BenefitsBar";
import JobListings from "@/components/home/home-5/JobListings";
import InternshipListings from "@/components/home/home-5/InternshipListings";
import JoinOurBusiness from "@/components/home/home-5/JoinOurBusiness";
import DefaultHeader from "@/components/header/default-header";
import MetaComponent from "@/components/common/MetaComponent";
import { useEffect, useState } from "react";
import College from "@/components/home/home-5/College";
import Counter2 from "@/components/counter/Counter2";
import WhoIsItFor from "@/components/home/home-5/WhoIsItFor";

const metadata = {
  title: "Startups24x7",
  description: "Startups24x7 - All-in-One Platform for Startup Services",
};

const Home_5 = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  return (
    <>
      <MetaComponent meta={metadata} />

      <DefaultHeader />
      <Hero5 />

      {/* Counter Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex justify-center text-center">
            <Counter2 />
          </div>
        </div>
      </section>

      {/* Job Listings (currently disabled) */}
      <section className="py-16 bg-blue-50">
        {/* <JobListings /> */}
      </section>

      {/* Internship Listings (currently disabled) */}
      <section className="py-16 bg-blue-50">
        {/* <InternshipListings /> */}
      </section>

      {/* Join Our Business */}
      <section className="py-20 bg-gray-50">
        <JoinOurBusiness />
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-blue-50">
        <WhyChooseUs />
      </section>

      {/* Who Is It For */}
      <section className="py-20 bg-blue-50">
        <WhoIsItFor />
      </section>

      {/* Conditional Call To Action */}
      {isLoggedIn ? <DefaultCallToActions /> : <GuestCallToActions />}

      <Footer4 />
    </>
  );
};

export default Home_5;

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
import College from "@/components/home/home-5/College";
import Counter2 from "@/components/counter/Counter2";
import WhoIsItFor from "@/components/home/home-5/WhoIsItFor";
import NewCallToActions from "@/components/common/social/NewCallToActions";
import { useEffect, useState, useRef } from "react";

const metadata = {
  title: "RoleReady",
  description: "RoleReady - Placement Readiness",
};

const Home_5 = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const whyChooseUsRef = useRef(null);
    const joinOurBusinessRef = useRef(null);

    useEffect(() => {
      const user = localStorage.getItem("user");
      setIsLoggedIn(!!user);
    }, []);

    const handleCheckReadiness = () => {
      whyChooseUsRef.current?.scrollToCTAAndOpenDemo();
    };

    const scrollToJoinOurBusiness = () => {
      joinOurBusinessRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    };


  return (
    <>
      <MetaComponent meta={metadata} />

      <DefaultHeader />
      <Hero5
        onCheckReadiness={handleCheckReadiness}
        onLearnMore={scrollToJoinOurBusiness}
      />


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
      <section ref={joinOurBusinessRef} className="py-20 bg-gray-50">
        <JoinOurBusiness />
      </section>

      <section className="py-20 bg-blue-50">
        <WhyChooseUs ref={whyChooseUsRef} />
      </section>


      {/* Who Is It For */}
      <section className="py-20 bg-blue-50">
        <WhoIsItFor />
      </section>

      {/* Conditional Call To Action */}
      {isLoggedIn ? <NewCallToActions /> : <GuestCallToActions />}

      <Footer4 />
    </>
  );
};

export default Home_5;

import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import MobileMenu from "../MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 10) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => {
      window.removeEventListener("scroll", changeBackground);
    };
  }, []);

  return (
    <>
      <header className={`header -type-5 ${navbar ? "-header-5-sticky" : ""}`}>
        <div className="header__container container">
          <div className="row justify-between items-center">
            <div className="col-auto mobile-col">
              <div className="d-flex items-center">
                <div className="mr-20 d-flex items-center">
                  <div className="mr-15 d-none md:d-flex">
                    <Link
                      to="/login"
                      className="icon-user text-inherit text-22 "
                    />
                  </div>
                  {/* End mobile menu icon */}

                  <button
                    className="d-flex items-center icon-menu text-dark-1 text-20"
                    data-bs-toggle="offcanvas"
                    aria-controls="mobile-sidebar_menu"
                    data-bs-target="#mobile-sidebar_menu"
                  ></button>

                  <div
                    className="offcanvas offcanvas-start  mobile_menu-contnet"
                    tabIndex="-1"
                    id="mobile-sidebar_menu"
                    aria-labelledby="offcanvasMenuLabel"
                    data-bs-scroll="true"
                  >
                    <MobileMenu />
                  </div>
                </div>
                {/* humberger menu */}

                <Link to="/" className="header-logo mr-20">
                  <img src="/img/general/webeazzy-logo2.png" alt="logo icon" />
                  <img src="/img/general/webeazzy-logo2.png" alt="logo icon" />
                </Link>
                {/* End logo */}

                {/* <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div> */}
                {/* End header-menu */}
              </div>
              {/* End d-flex */}
            </div>
            {/* End col */}

            <div className="col-auto">
              <div className="header__buttons d-flex items-center is-menu-opened-hide">
                {/* Start btn-group */}
                <Link
                  to="/pricing"
                  className="button px-30 fw-400 text-14 text-black -white h-50 text-dark-1 mr-10"
                >
                  Pricing
                </Link>
                <div className="col-auto">
                  <div className="w-1 h-20 bg-black-20 mr-10" />
                </div>
                <div className="header__buttons d-flex items-center is-menu-opened-hide">
                  <Link
                    to="/login"
                    className="button px-30 fw-400 text-14 -white h-50 text-dark-1 text-black"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="button px-30 fw-400 text-14 text-black border-black bg-white -outline-black h-50 ml-20"
                  >
                    Get started for Free
                  </Link>
                </div>
                {/* End btn-group */}
              </div>
            </div>
            {/* End col-auto */}
          </div>
          {/* End .row */}
        </div>
        {/* End header_container */}
      </header>
      {/* // End header */}
    </>
  );
};

export default Header1;

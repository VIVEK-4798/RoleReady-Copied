import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import MainMenu from "../MainMenu";
import CurrenctyMegaMenu from "../CurrenctyMegaMenu";
import LanguageMegaMenu from "../LanguageMegaMenu";
import MobileMenu from "../MobileMenu";

const Header1 = () => {
  const [navbar, setNavbar] = useState(false);
  const user = sessionStorage.getItem("user");

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
      <header className={`header bg-white ${navbar ? "is-sticky" : ""}`}>
        <div className="header__container px-30 sm:px-20">
          <div className="row justify-between items-center">
            <div className="col-auto">
              <div className="d-flex items-center">
                <Link to="/" className="header-logo mr-20">
                  <img src="/img/logo/logo_resized.png" alt="logo icon" />
                  <img src="/img/logo/logo_resized.png" alt="logo icon" />
                </Link>

                <div className="header-menu">
                  <div className="header-menu__content">
                    <MainMenu style="text-dark-1" />
                  </div>
                </div>
              </div>
            </div>

            <div className="col-auto">
              <div className="d-flex items-center">
                <div className="d-flex items-center is-menu-opened-hide md:d-none">

                  {/* Conditionally render Post Job button */}
                  {(user === "mentor" || user === "admin") && (
                    <Link
                      to="/mentor-dashboard/vendor/add"
                      className="button px-30 fw-400 text-14 h-50 mr-20"
                      style={{
                        border: "2px solid #5693C1",
                        color: "#5693C1",
                        transition: "all 0.3s ease",
                        backgroundColor: "transparent",
                        fontWeight:"600",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.backgroundColor = "#5693C1";
                        e.target.style.color = "white";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.backgroundColor = "transparent";
                        e.target.style.color = "#5693C1";
                      }}
                    >
                      Post Job
                    </Link>
                  )}
                  <Link
                    to="/pricing"
                    className="button px-30 fw-400 text-14 -white h-50 text-dark-1"
                  >
                    Pricing
                  </Link>

                  <div className="col-auto">
                    <div className="w-1 h-20 bg-black-20" />
                  </div>

                  <Link
                    to={
                      user === "mentor"
                        ? "/mentor-dashboard/dashboard"
                        : user === "admin"
                        ? "/admin-dashboard/dashboard"
                        : user === "user"
                        ? "/vendor-dashboard/dashboard"
                        : "/login"
                    }
                    className="button px-30 fw-400 text-14 -white h-50 text-dark-1"
                  >
                    {user ? "Dashboard" : "Login"}
                  </Link>

                  <Link
                    to="/signup"
                    className="button px-30 fw-400 text-14 border-black -outline-black h-50 ml-20"
                  >
                    Get started for Free
                  </Link>
                </div>

                {/* Mobile icon buttons */}
                <div className="d-none xl:d-flex x-gap-20 items-center pl-30 text-dark-1">
                  <div>
                    <Link
                      to="/login"
                      className="d-flex items-center icon-user text-inherit text-22"
                    />
                  </div>
                  <div>
                    <button
                      className="d-flex items-center icon-menu text-inherit text-20"
                      data-bs-toggle="offcanvas"
                      aria-controls="mobile-sidebar_menu"
                      data-bs-target="#mobile-sidebar_menu"
                    />
                    <div
                      className="offcanvas offcanvas-start mobile_menu-contnet"
                      tabIndex="-1"
                      id="mobile-sidebar_menu"
                      aria-labelledby="offcanvasMenuLabel"
                      data-bs-scroll="true"
                    >
                      <MobileMenu />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header1;
  
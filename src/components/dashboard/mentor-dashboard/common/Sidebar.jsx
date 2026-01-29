import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  function logoutHandler(e) {
    e.preventDefault();
    sessionStorage.clear();
    navigate("/login");
  }
  const sidebarData = [
        {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Internships",
      allowedRole: ["mentor", "venue-user"],
      links: [
        { title: "All Internships", href: "venues", allowedRole: ["mentor", "venue-user"] },
        { title: "Add Internship", href: "venue/add", allowedRole: ["mentor", "venue-user"] },
      ],
    },
    {
      icon: "/img/dashboard/sidebar/house.svg",
      title: "Jobs",
      allowedRole: ["mentor", "vendor-user"],
      links: [
        { title: "All Jobs", href: "vendors", allowedRole: ["mentor"] },
        { title: "Add Job", href: "vendor/add", allowedRole: ["mentor"] },
      ],
    },
  ];

  return (
    <>
      <div className="sidebar -dashboard" id="vendorSidebarMenu">
        <div className="sidebar__item ">
          {/* <Link
            to="/mentor-dashboard/dashboard"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Dashboard
          </Link> */}
        </div>
        <div className="sidebar__item ">
          <Link
            to="/mentor-dashboard/profile"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/avatars/5.png"
              alt="profile icon"
              style={{ width: "26px", height: "26px", objectFit: "cover" }}
              className="mr-15"
            />
            Profile
          </Link>
        </div>
        {/* End accordion__item */}

        {/* Mentor Validation Queue */}
        <div className="sidebar__item ">
          <Link
            to="/mentor-dashboard/validation-queue"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <span style={{ 
              marginRight: "15px", 
              fontSize: "1.2rem",
              width: "26px",
              textAlign: "center"
            }}>🎓</span>
            Skill Validation
          </Link>
        </div>
        {/* End validation queue */}

        {/* <div className="sidebar__item ">
          <a
            href="/mentor-dashboard/booking"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/booking.svg"
              alt="image"
              className="mr-15"
            />
            Applicants
          </a>
        </div> */}
        {/* End accordion__item */}

        {/* <div className="sidebar__item ">
          <a
            href="/mentor-dashboard/webpage"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/gear.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Manage Webpage
          </a>
        </div> */}

        {sidebarData.map((item, index) => (
          <div className="sidebar__item" key={index}>
            <div className="accordion -db-sidebar js-accordion">
              <div className="accordion__item">
                <div
                  className="accordion__button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#sidebarItem${index}`}
                >
                  <div className="sidebar__button col-12 d-flex items-center justify-between">
                    <div className="d-flex items-center text-15 lh-1 fw-500">
                      <img src={item.icon} alt="image" className="mr-10" />
                      {item.title}
                    </div>
                    <div className="icon-chevron-sm-down text-7" />
                  </div>
                </div>
                <div
                  id={`sidebarItem${index}`}
                  className="collapse"
                  data-bs-parent="#vendorSidebarMenu"
                >
                 <ul className="list-disc pt-15 pb-5 pl-40">
                  {item.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <Link to={`/mentor-dashboard/${link.href}`} className="text-15">
                        {link.title}
                      </Link>
                    </li>
                  ))}
                </ul>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* <div className="sidebar__item ">
          <a
            href="/mentor-dashboard/instagram"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/icons/instagram.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Instagram
          </a>
        </div> */}

        {/* <div className="sidebar__item ">
          <a
            href="/mentor-dashboard/facebook"
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/icons/facebook.svg"
              className="h-auto w-auto mr-10 "
              alt="icon"
              style={{ maxHeight: "3vh" }}
            />
            Facebook
          </a>
        </div> */}

        <div className="sidebar__item ">
          <a
            href="#"
            onClick={(e) => logoutHandler(e)}
            className="sidebar__button d-flex items-center text-15 lh-1 fw-500"
          >
            <img
              src="/img/dashboard/sidebar/log-out.svg"
              alt="image"
              className="mr-15"
            />
            Logout
          </a>
        </div>
        {/* End accordion__item */}
      </div>
    </>
  );
};

export default Sidebar;

import { useEffect, useState } from "react";
import ApplyNowModal from "./ApplyNowModal";

const StickyHeader = ({ internship }) => {
  const [header, setHeader] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const changeBackground = () => {
    if (window.scrollY >= 200) {
      setHeader(true);
    } else {
      setHeader(false);
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", changeBackground);
    return () => window.removeEventListener("scroll", changeBackground);
  }, []);

  return (
    <>
      <div className={`singleMenu js-singleMenu ${header ? "-is-active" : ""}`}>
        <div className="singleMenu__content">
          <div className="container">
            <div className="row y-gap-20 justify-between items-center">
              <div className="col-auto">
                <div className="singleMenu__links row x-gap-30 y-gap-10">
                  <div className="col-auto">
                    <a href="#overview">Overview</a>
                  </div>
                  <div className="col-auto">
                    <a href="#facilities">Requirements</a>
                  </div>
                  <div className="col-auto">
                    <a href="#faq">Faq</a>
                  </div>
                </div>
              </div>

              <div className="col-auto">
                <div className="row x-gap-15 y-gap-15 items-center">
                  <div className="col-auto">
                    <button
                      onClick={() => setShowModal(true)}
                      className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
                    >
                      Apply Now <div className="icon-arrow-top-right ml-15" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Apply Now Modal */}
            <ApplyNowModal
        internship={internship}
        show={showModal}
        onClose={() => setShowModal(false)}
        type="venue"
        venueId={internship.venue_id}
      />
    </>
  );
};

export default StickyHeader;

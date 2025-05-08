import ModalVideo from "react-modal-video";
import { Gallery, Item } from "react-photoswipe-gallery";
import { Link } from "react-router-dom";
import React, { useState } from "react";

export default function GalleryOne({ internship }) {
  const [isOpen, setOpen] = useState(false);
  return (
    <>
      <ModalVideo
        channel="youtube"
        autoplay
        isOpen={isOpen}
        videoId="oqNZOOWF8qM"
        onClose={() => setOpen(false)}
      />
      <section className="pt-40">
        <div className="container">
          <div className="row y-gap-20 justify-between items-end">
            <div className="col-auto">
              <div className="row x-gap-20  items-center">
                <div className="col-auto">
                  <h1 className="text-30 sm:text-25 fw-600">{internship?.venue_name}</h1>
                </div>
                {/* End .col */}
                <div className="col-auto">
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                  <i className="icon-star text-10 text-yellow-1" />
                </div>
              </div>
              {/* End .row */}

              <div className="row x-gap-20 y-gap-20 items-center">
                <div className="col-auto">
                  <div className="d-flex items-center text-15 text-light-1">
                    <i className="icon-location-2 text-16 mr-5" />
                    {internship?.city_name}
                  </div>
                </div>
                {internship.venue_map_url && (
                  <div className="col-auto">
                    <a
                      href={internship.venue_map_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-1 text-15 underline"
                    >
                      Show on map
                    </a>
                  </div>
                )}
              </div>
              {/* End .row */}
            </div>
            {/* End .col */}

            <div className="col-auto">
              <div className="row x-gap-15 y-gap-15 items-center">
                <div className="col-auto">
                  {/* <div className="text-14">
                    From{" "}
                    <span className="text-22 text-dark-1 fw-500">
                      US${internship?.price}
                    </span>
                  </div> */}
                </div>
                <div className="col-auto">
                  <Link
                    to="/booking-page"
                    className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
                  >
                    Apply Now <div className="icon-arrow-top-right ml-15" />
                  </Link>
                </div>
              </div>
            </div>
            {/* End .col */}
          </div>
          {/* End .row */}

          <Gallery>
            <div className="galleryGrid -type-1 pt-30">
              {[...(internship?.venue_images ? JSON.parse(internship.venue_images) : []), 
                "/img/jobsCategory/Sales&BusinessDevelopment.png", 
                "/img/jobsCategory/HumanResources.jpg",
                "/img/jobsCategory/ContentWriting.png",
                "/img/jobsCategory/officeInside.webp",
              ].map((img, index) => (
                <div key={index} className="galleryGrid__item relative d-flex">
                  <Item original={img} thumbnail={img} width={660} height={660}>
                    {({ ref, open }) => (
                      <img
                        src={img}
                        ref={ref}
                        onClick={open}
                        alt={`venue-img-${index}`}
                        role="button"
                        className="rounded-4"
                      />
                    )}
                  </Item>

                  {index === 0 && (
                    <div className="absolute px-20 py-20 col-12 d-flex justify-end">
                      <button className="button -blue-1 size-40 rounded-full flex-center bg-white text-dark-1">
                        <i className="icon-heart text-16" />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </Gallery>
        </div>
        {/* End .container */}
      </section>
    </>
  );
}

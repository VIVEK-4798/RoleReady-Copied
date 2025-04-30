import React from "react";

const ProfileHeader = () => {
  return (
    <div className="bg-white shadow rounded p-3 mb-30">
      <div className="d-flex justify-between align-items-center">
        <div className="d-flex align-items-center gap-20">
          <img
            src="/img/avatars/5.png"
            alt="Profile"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              border: "4px solid #fff",
            }}
          />
          <div>
            <h3 className="text-22 fw-600">Vivek Kumar</h3>
            <p className="text-14 text-light-1">@vivekkum9323</p>
            <p className="text-14 text-light-1">
              Rashtriya Military School, Bengaluru
            </p>
            <div className="progress mt-10" style={{ width: 100 }}>
              <div className="progress-bar bg-blue-1" style={{ width: "67%" }}>
                67%
              </div>
            </div>
          </div>
        </div>
        <button className="button -blue-1 p-2">Edit Profile</button>
      </div>
    </div>
  );
};

export default ProfileHeader;

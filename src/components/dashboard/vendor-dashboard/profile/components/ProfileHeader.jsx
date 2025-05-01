import React, { useEffect, useState } from "react";
import { api } from "@/utils/apiProvider";

const ProfileHeader = () => {
  const [userData, setUserData] = useState(null);
  const [education, setEducation] = useState(null);
  const [profileInfo, setProfileInfo] = useState({});
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);

    const fetchEducation = async () => {
      try {
        const res = await fetch(`${api}/api/profile/get-education/${user?.user_id}`);
        const data = await res.json();
        
        if (data.education) {
          const parsed = JSON.parse(data.education);
          setEducation(parsed);
        }
      } catch (err) {
        console.error("Failed to fetch education:", err);
      }
    };

    if (user?.user_id) fetchEducation();
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setUserData(user);
    const fetchProfileInfo = async () => {
      try {
        const res = await fetch(`${api}/api/profile/get-profile-info/${user?.user_id}`);
        const data = await res.json();
        setProfileInfo(data);
        console.log(data);
        
      } catch (err) {
        console.error("Failed to fetch profile info:", err);
      }
    };

    if (user?.user_id) fetchProfileInfo();
  }, []);

  useEffect(() => {
    const calculateProgress = () => {
      let filled = 0;
      let total = 8;
  
      if (userData?.name) filled++;
      if (userData?.email) filled++;
  
      if (profileInfo?.about_text?.trim()) filled++;
  
      if (profileInfo?.skills?.trim()) filled++;
  
      try {
        const experience = JSON.parse(profileInfo?.experience || '{}');
        if (experience?.organisation || experience?.designation) filled++;
      } catch {}
  
      try {
        const edu = JSON.parse(profileInfo?.education || '{}');
        if (edu?.college) filled++;
      } catch {}
  
      if (profileInfo?.resume_file) filled++;
  
      try {
        const certificate = JSON.parse(profileInfo?.certificate || '{}');
        if (certificate?.title || certificate?.organization) filled++;
      } catch {}
  
      try {
        const project = JSON.parse(profileInfo?.projects || '{}');
        if (project?.title || project?.link) filled++;
      } catch {}
  
      total = 9;
  
      const percent = Math.round((filled / total) * 100);
      setProgress(percent);
    };
  
    calculateProgress();
  }, [userData, profileInfo]);
  

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
            <h3 className="text-22 fw-600">{userData?.name || "User Name"}</h3>
            <p className="text-14 text-light-1">@{userData?.email?.split("@")[0]}</p>
            <p className="text-14 text-light-1">{education?.college || ""}</p>

            <div className="progress mt-10" style={{ width: 100 }}>
              <div className="progress-bar bg-blue-1" style={{ width: `${progress}%` }}>
                {progress}%
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

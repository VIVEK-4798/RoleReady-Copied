import { useState, useEffect } from "react";
import axios from "axios";
import { api } from "@/utils/apiProvider";
import { getId, getUserId } from "@/utils/DOMUtils";
import AvatarUploader from "./AvatarUploader";
import { Roles } from "@/constant/constants";
import { useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PersonalInfo = () => {
  let params = useParams();
  const state = useLocation()?.state || null;
  const mode = params.mode;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    newPassword: "",
    confirmPassword: "",
    image:"",
    role:""
  });
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fetch user details when the component mounts
  useEffect(() => {
    if (mode === "edit") {
      setFormData({
        ...state,
        image:JSON.parse(state.image) || "/img/misc/avatar-1.png"
      });
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "newPassword" || name === "confirmPassword") {
      setPasswordsMatch(
        name === "newPassword"
          ? value === formData.confirmPassword
          : value === formData.newPassword
      );
    }

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    if (!passwordsMatch) {
      toast.error("Passwords do not match");
      return;
    }
  
    try {
      const apiBody = {
        ...formData,
        image: JSON.stringify(formData.image),
        password: formData.newPassword,
      };
      let response = null;
      setLoading(true);
  
      if (mode === "edit") {
        response = await axios.put(`${api}/api/user/update-users/${formData.user_id}`, apiBody);
      } else {
        response = await axios.post(`${api}/api/user/create-users`, apiBody);
      }
  
      setLoading(false);
  
      if (response.status === 201 || response.status === 200) {
        toast.success("User added successfully");
        setFormData({
          name: "",
          email: "",
          mobile: "",
          newPassword: "",
          confirmPassword: "",
          image: "",
          role: "",
        });
      } else {
        toast.error(response.data.message || "Update failed");
      }
    } catch (error) {
      setLoading(false);
      toast.error(error?.response?.data?.error || "Update failed");
      console.error("Error updating profile:", error);
    }
  };  

  return (
    <div>
      {loading && <div>Loading...</div>}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <AvatarUploader formData={formData} setFormData={setFormData} />
          {/* End AvatarUploader */}

          <div className="border-top-light mt-30 mb-30" />

          <div className="col-xl-9">
            <div className="row x-gap-20 y-gap-20">
              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">Full Name</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">Email</label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="number"
                    name="mobile"
                    value={formData.mobile}
                    onChange={handleChange}
                    required
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Phone Number
                  </label>
                </div>
              </div>


              <div className=" form-input col-md-6 dropdown js-dropdown js-services-active w-50" >
                <div
                  className="dropdown__button d-flex items-center justify-between bg-white rounded-4 w-100 text-14 px-20 text-14"
                  data-bs-toggle="dropdown"
                  data-bs-auto-close="true"
                  aria-expanded="false"
                  data-bs-offset="0,10"
                  style={{border: "1px solid #dddddd", height:"70px"}}
                >
                  <span className="js-dropdown-title">
                    {Roles.find((role)=>{return role.roleUserName === formData.role})?.roleName || "Select Role"}                    
                  </span>
                  <i className="icon icon-chevron-sm-down text-7 ml-10" />
                </div>
                <div className="toggle-element -dropdown w-100 dropdown-menu">
                  <div className="text-14 y-gap-15 js-dropdown-list">
                    {Roles.map((option, index) => (
                      <div
                        key={index}
                        id={index}
                        name="role"
                        className={`${
                          formData.role === option.roleName
                            ? "text-blue-1"
                            : ""
                        } js-dropdown-link`}
                        onClick={()=>{
                          setFormData((prev)=>({
                            ...prev,
                            role: option.roleUserName
                          }))
                        }}
                      >
                        {option.roleName}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="password"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleChange}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Password
                  </label>
                </div>
              </div>

              <div className="col-md-6">
                <div className="form-input">
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <label className="lh-1 text-16 text-light-1">
                    Password Again
                  </label>
                </div>
                {!passwordsMatch && (
                  <div className="text-15 lh-15 text-light-1 ml-10">
                    Passwords must match.
                  </div>
                )}
              </div>
            </div>
          </div>

          <br />

          <div className="col-12">
            <div className="row x-gap-10 y-gap-10">
              <div className="col-auto">
                <button
                  type="submit"
                  className="button h-50 px-24 -dark-1 bg-blue-1 text-white"
                >
                  Save Changes <div className="icon-arrow-top-right ml-15" />
                </button>
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="button h-50 px-24 -blue-1 bg-blue-1-05 text-blue-1"
                  onClick={() => {
                    // Reset formData to original user details
                    setFormData({
                      name: "",
                      email: "",
                      mobile: "",
                      currentPassword: "",
                      newPassword: "",
                      confirmPassword: "",
                    });
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </form>
      )}
    </div>
  );
};

export default PersonalInfo;

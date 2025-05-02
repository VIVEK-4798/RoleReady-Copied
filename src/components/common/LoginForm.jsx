import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState } from 'react';
import axios from 'axios';
import { api } from "@/utils/apiProvider";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginForm = () => {
  const state = useLocation()?.state || null;
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    role: "user",
  });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${api}/api/auth/login`, formData);

      if (response.status === 200) {
        setFormData({ email: "", password: "", role: "user" });

        const userData = response.data.userData;
        const userId = userData.user_id;
        const userRole = userData.role;

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem(`${userRole}Id`, userId);
        localStorage.setItem("role", userRole);
        
        sessionStorage.setItem("user", userRole);
        console.log("userRole", userRole);
        

        toast.success("Login successful!");

        setTimeout(() => {
          if (state?.type && state?.id) {
            navigate(`/${state.type}/${state.id}`);
          } else {
            if (userRole === "admin") {
              navigate("/admin-dashboard/dashboard");
            } else if (userRole === "user") {
              navigate("/vendor-dashboard/dashboard");
            } else if (userRole === "mentor") {
              navigate("/mentor-dashboard/dashboard");
            } else {
              navigate("/");
            }
          }
        }, 1000);
      } else {
        toast.error("Something went wrong.");
      }
    } catch (error) {
      toast.error(error?.response?.data?.error || "Login failed");
      console.error("Login error:", error);
    }
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} />
      <form className="row y-gap-20" onSubmit={handleSubmit}>
        <div className="col-12">
          <h1 className="text-22 fw-500">Welcome back</h1>
          <p className="mt-10">
            Don&apos;t have an account yet?{" "}
            <Link to="/signup" className="text-blue-1">
              Sign up for free
            </Link>
          </p>
        </div>

        {/* Role dropdown */}
        <div className="col-12">
          <label>Select Role:</label>
          <div className="form-input">
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
              <option value="mentor">Mentor</option>
            </select>
          </div>
        </div>

        <div className="col-12">
          <div className="form-input">
            <input
              type="text"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
            />
            <label className="lh-1 text-14 text-light-1">Email</label>
          </div>
        </div>

        <div className="col-12">
          <div className="form-input">
            <input
              type="password"
              name="password"
              required
              value={formData.password}
              onChange={handleChange}
            />
            <label className="lh-1 text-14 text-light-1">Password</label>
          </div>
        </div>

        <div className="col-12">
          <a href="#" className="text-14 fw-500 text-blue-1 underline">
            Forgot your password?
          </a>
        </div>

        <div className="col-12">
          <button
            type="submit"
            className="button py-20 -dark-1 bg-blue-1 text-white w-100"
          >
            Sign In <div className="icon-arrow-top-right ml-15" />
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginForm;

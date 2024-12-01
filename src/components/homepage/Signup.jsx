/* eslint-disable react/prop-types */
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { hostExists, userExists } from "../../redux/reducers/auth";
import { config } from "../../constants/config";

// Helper function for validation
const validateForm = (data) => {
  const errors = {};
  if (!data.username) errors.username = "Username is required.";
  if (!data.email) errors.email = "Email is required.";
  else if (!/^[a-zA-Z0-9._%+-]+@gmail\.com$/.test(data.email)) {
    errors.email =
      "Email must be a valid Gmail address (e.g., example@gmail.com).";
  }
  if (!data.password) errors.password = "Password is required.";
  else if (data.password.length < 6)
    errors.password = "Password must be at least 6 characters.";
  return errors;
};

const Signup = ({ userType, onSubmit, toggleForm }) => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    // Clear specific error on input change
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form data
    const validationErrors = validateForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setIsLoading(true);

    const endpoint =
      userType === "Admin" ? "/admin/register" : "/user/register";

    try {
      const { data } = await axios.post(
        `${import.meta.env.VITE_SERVER}${endpoint}`,
        formData,
        config
      );

      const { success, message, user, host } = data;

      if (success) {
        if (userType === "Admin" && host) {
          dispatch(hostExists(host));
        } else if (userType === "Student" && user) {
          dispatch(userExists(user));
        } else {
          toast.error("Unexpected response. Please try again.");
          return;
        }

        toast.success(message);
        onSubmit();
        navigate(userType === "Admin" ? "/admin-dashboard" : "/");
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center w-full">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md"
      >
        {/* Username Input */}
        <div className="mb-4">
          <label
            htmlFor="username"
            className="block text-gray-700 font-medium mb-1"
          >
            Username
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={formData.username}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.username ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter username"
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-gray-700 font-medium mb-1"
          >
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.email ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your email"
          />
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label
            htmlFor="password"
            className="block text-gray-700 font-medium mb-1"
          >
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className={`w-full px-4 py-2 border rounded-lg ${
              errors.password ? "border-red-500" : "border-gray-300"
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white font-bold py-2 rounded-lg hover:bg-green-700 transition"
          disabled={isLoading}
        >
          {isLoading ? (
            <span className="loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
          ) : (
            "Sign Up"
          )}
        </button>

        {/* Switch to Login */}
        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => toggleForm()}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            Log In
          </span>
        </p>
      </form>
    </div>
  );
};

export default Signup;

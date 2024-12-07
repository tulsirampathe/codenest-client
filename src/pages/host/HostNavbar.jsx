// HostNavbar.js
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { config, server } from "../../constants/config";
import { hostNotExists } from "../../redux/reducers/auth";

function HostNavbar() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const handleLogout = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const { data } = await axios.post(`${server}/admin/logout`, {}, config);

      if (data.success) {
        dispatch(hostNotExists());
        toast.success(data.message);
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <nav className="bg-indigo-600 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo or Dashboard Title */}
          <Link to="/" className="text-2xl font-bold">
            Dashboard
          </Link>

          {/* Navbar Links */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center"
            >
              <FaHome className="mr-1" /> Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="hover:bg-indigo-700 px-3 py-2 rounded-md flex items-center"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loader inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
              ) : (
                <>
                  <FaSignOutAlt className="mr-1" /> Logout
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HostNavbar;
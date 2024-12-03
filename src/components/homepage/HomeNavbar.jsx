import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaSignOutAlt, FaUserCircle } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { config, server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";

const HomeNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();

    setIsLoading(true);
    try {
      const { data } = await axios.post(`${server}/user/logout`, {}, config);

      if (data.success) {
        dispatch(userNotExists());
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
    <nav className="bg-gradient-to-r from-teal-400 via-cyan-500 to-blue-600 shadow-md w-full top-0 overflow-visible">
      <div className="container mx-auto px-6 py-4 flex justify-between items-center overflow-visible">
        <Link
          to="/"
          className="text-2xl font-bold text-white cursor-pointer hover:text-yellow-300"
        >
          Codenest
        </Link>
        <ul className="flex space-x-8 text-white text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-300">
              Home
            </Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-300">
              About
            </Link>
          </li>
        </ul>

        {user && (
          <div
            className="relative flex items-center space-x-4"
            ref={dropdownRef}
          >
            <button
              onClick={toggleDropdown}
              className="relative focus:outline-none"
            >
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="User picture"
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                />
              ) : (
                <FaUserCircle className="text-white text-3xl cursor-pointer" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-10 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                <p className="px-4 py-2 text-gray-700 text-sm font-semibold">
                  {user.username}
                </p>
                <p className="px-4 py-2 text-gray-700 text-sm font-semibold">
                  {user.email}
                </p>
                <hr className="border-t border-gray-200" />
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm font-semibold flex items-center text-red-500 hover:bg-gray-100"
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
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default HomeNavbar;

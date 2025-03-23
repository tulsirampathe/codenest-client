import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaBars, FaSignOutAlt, FaUserCircle, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { config, server } from "../../constants/config";
import { userNotExists } from "../../redux/reducers/auth";

const HomeNavbar = () => {
  const { user } = useSelector((state) => state.auth);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);
  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
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
    <nav className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md w-full top-0">
      <div className="container mx-auto px-6 py-3 flex justify-between items-center">
        {/* Logo */}
        <Link to="/" className="cursor-pointer flex items-center">
          <img
            src="/Logo.png"
            alt="CodeNest"
            className="h-12 w-auto filter drop-shadow-md transition-transform duration-300 ease-in-out transform hover:scale-110"
          />
        </Link>

        {/* Desktop Menu */}
        <ul className="hidden md:flex space-x-8 text-lg">
          <li>
            <Link to="/" className="hover:text-yellow-300">Home</Link>
          </li>
          <li>
            <Link to="/about" className="hover:text-yellow-300">About</Link>
          </li>
        </ul>

        {/* Profile (Desktop) */}
        {user && (
          <div className="hidden md:flex items-center space-x-4 relative">
            <button onClick={toggleDropdown} className="relative focus:outline-none">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt="User"
                  className="w-10 h-10 rounded-full border-2 border-white cursor-pointer"
                />
              ) : (
                <FaUserCircle className="text-white text-2xl cursor-pointer" />
              )}
            </button>

            {isDropdownOpen && (
              <div className="absolute top-12 right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-20">
                <p className="px-4 py-2 text-gray-700 text-sm font-semibold">{user.username}</p>
                <p className="px-4 py-2 text-gray-700 text-sm font-semibold">{user.email}</p>
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

        {/* Mobile Menu Button */}
        <button className="md:hidden text-2xl focus:outline-none" onClick={toggleMobileMenu}>
          {isMobileMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white text-gray-800 shadow-md absolute top-16 left-0 w-full px-6 py-4 z-20">
          <ul className="flex flex-col space-y-4 text-lg">
            <li>
              <Link to="/" className="hover:text-blue-500" onClick={toggleMobileMenu}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/about" className="hover:text-blue-500" onClick={toggleMobileMenu}>
                About
              </Link>
            </li>

            {/* User Profile (Mobile) */}
            {user && (
              <div className="border-t pt-4">
                <div className="flex items-center space-x-4">
                  {user?.picture ? (
                    <img src={user.picture} alt="User" className="w-10 h-10 rounded-full border-2 border-gray-400" />
                  ) : (
                    <FaUserCircle className="text-gray-600 text-3xl" />
                  )}
                  <div>
                    <p className="text-sm font-semibold">{user.username}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>

                {/* Logout Button */}
                <button
                  onClick={handleLogout}
                  className="mt-4 w-full text-left px-4 py-2 text-sm font-semibold flex items-center text-red-500 hover:bg-gray-100"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="loader inline-block w-4 h-4 border-2 border-gray-500 border-t-transparent rounded-full animate-spin"></span>
                  ) : (
                    <>
                      <FaSignOutAlt className="mr-1" /> Logout
                    </>
                  )}
                </button>
              </div>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default HomeNavbar;

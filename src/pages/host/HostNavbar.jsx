// HostNavbar.js
import React from "react";
import toast from "react-hot-toast";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import useMutationToast from "../../hooks/useMutationToast";
import { useHostLogoutMutation } from "../../redux/api/api";
import { hostNotExists } from "../../redux/reducers/auth";

function HostNavbar() {
  const navigate = useNavigate();

  const dispatch = useDispatch();

  const [hostLogout, { isLoading, isSuccess, data, isError, error }] =
    useHostLogoutMutation();

  // Use the useMutationToast hook to handle toast messages
  useMutationToast({
    isLoading,
    isSuccess,
    data,
    isError,
    error,
    loadingMessage: "Logging out...",
    successMessage: "You have logged out successfully.",
  });

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      const { data } = await hostLogout();

      if (isSuccess) {
        dispatch(hostNotExists());
      } else {
        throw new Error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Something Went Wrong");
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
            >
              <FaSignOutAlt className="mr-1" /> Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default HostNavbar;

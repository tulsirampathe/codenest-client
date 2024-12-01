import React, { useEffect, useState } from "react";
import Modal from "./Modal";
import Login from "./Login";
import Signup from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import { useJoinChallengeMutation } from "../../redux/api/api";
import useMutationToast from "../../hooks/useMutationToast";
import { setChallengeID } from "../../redux/reducers/auth";
import { useNavigate } from "react-router-dom";

const Body = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true); // Toggle between Login and Signup
  const [activeTab, setActiveTab] = useState("Student");
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Track login status
  const [key, setKey] = useState(""); // State for the access key

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { host, user } = useSelector((state) => state.auth);

  // Open and close modal
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setKey("");
  };

  // Toggle between Login and Signup forms
  const toggleForm = () => setIsLogin((prev) => !prev);

  const [joinChallenge, joinStatus] = useJoinChallengeMutation();

  useMutationToast({
    ...joinStatus,
    successMessage: joinStatus.data?.message || "Challenge join successfully",
  });

  const handleKeyChange = (event) => {
    setKey(event.target.value);
  };

  const handleSubmitKey = async () => {
    if (!key.trim()) {
      alert("Please enter a valid access key.");
      return;
    }
    try {
      await joinChallenge({ challengeKey: key });
    } catch (error) {
      console.error("Error while joining challenge:", error);
    }
  };

  useEffect(() => {
    if (joinStatus.isSuccess && joinStatus.data?.challengeID) {
      dispatch(setChallengeID(joinStatus.data.challengeID));
      navigate("/challenge-page");
    }
  }, [joinStatus.isSuccess, joinStatus.data, dispatch, navigate]);

  // Handle successful login
  const handleLogin = () => {
    setIsLoggedIn(true); // Set as logged in
    closeModal(); // Close the modal
  };

  // Handle successful signup
  const handleSignup = () => {
    setIsLoggedIn(true); // Set as logged in
    closeModal(); // Close the modal
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      {/* Title Section - Show only if not logged in */}
      {!host && !user && (
        <div className="text-center py-16">
          <h1 className="text-5xl font-extrabold text-yellow-400 mb-4">
            Welcome to <span className="text-teal-400">Codenest</span>
          </h1>
          <p className="text-lg text-gray-300">
            Empowering teachers to create coding tests and students to excel.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      {!host && !user && (
        <div className="flex justify-center space-x-8 mb-8">
          <button
            className={`px-6 py-3 rounded-md text-lg font-semibold ${
              activeTab === "Admin" ? "bg-teal-500 text-white" : "bg-gray-700"
            } hover:scale-105 transition`}
            onClick={() => setActiveTab("Admin")}
          >
            Admin
          </button>
          <button
            className={`px-6 py-3 rounded-md text-lg font-semibold ${
              activeTab === "Student" ? "bg-teal-500 text-white" : "bg-gray-700"
            } hover:scale-105 transition`}
            onClick={() => setActiveTab("Student")}
          >
            Student
          </button>
        </div>
      )}

      {/* Content Section */}
      {!host && !user && (
        <div className="flex justify-center">
          {/* Admin Tab Content */}
          {activeTab === "Admin" && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
              <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">
                Admin Dashboard
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Manage tests, monitor progress, and ensure a seamless experience
                for students.
              </p>
              <div className="flex flex-col space-y-4 items-center">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    openModal();
                  }}
                  className="w-2/3 bg-blue-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-blue-700 shadow-lg transform hover:scale-105 transition duration-300"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    openModal();
                  }}
                  className="w-2/3 bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-yellow-600 shadow-lg transform hover:scale-105 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}

          {/* Student Tab Content */}
          {activeTab === "Student" && (
            <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
              <h2 className="text-3xl font-extrabold text-teal-400 mb-6">
                Student Access
              </h2>
              <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                Improve your coding skills through personalized tests and
                challenges.
              </p>
              <div className="flex flex-col space-y-4 items-center">
                <button
                  onClick={() => {
                    setIsLogin(true);
                    openModal();
                  }}
                  className="w-2/3 bg-teal-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-teal-600 shadow-lg transform hover:scale-105 transition duration-300"
                >
                  Log In
                </button>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    openModal();
                  }}
                  className="w-2/3 bg-yellow-500 text-white font-semibold py-3 px-6 rounded-md hover:bg-yellow-600 shadow-lg transform hover:scale-105 transition duration-300"
                >
                  Sign Up
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modal for Login/Signup */}
      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {isLogin ? `${activeTab} Log In` : `${activeTab} Sign Up`}
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              {isLogin
                ? `Access your ${activeTab} account and manage your dashboard.`
                : `Create a new ${activeTab} account and start your journey.`}
            </p>
          </div>

          {/* Render Login or Signup Component */}
          {isLogin ? (
            <Login
              userType={activeTab} // Pass user type (Admin/Student) to Login
              onSubmit={handleLogin} // Handle login and close modal
              toggleForm={toggleForm}
            />
          ) : (
            <Signup
              userType={activeTab} // Pass user type (Admin/Student) to Signup
              onSubmit={handleSignup} // Handle signup and close modal
              toggleForm={toggleForm}
            />
          )}
        </Modal>
      )}

      {/* Content Section */}
      {host ||
        (user && (
          <div className="flex justify-center items-center min-h-screen">
            {/* Admin Tab Content (When Logged In) */}
            {host && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-yellow-400 mb-6">
                  Admin Dashboard
                </h2>
                <p className="text-gray-300 mb-8 text-lg leading-relaxed">
                  Manage tests, monitor progress, and ensure a seamless
                  experience for students.
                </p>
                <p className="text-xl text-gray-200">
                  You can now grade the students' performance and view reports.
                </p>
              </div>
            )}

            {/* Student Tab Content (When Logged In) */}
            {user && (
              <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
                <h2 className="text-3xl font-extrabold text-teal-400 mb-6">
                  Welcome, Student
                </h2>
                <p className="text-gray-300 mb-2 text-lg leading-relaxed">
                  Improve your coding skills through personalized tests and
                  challenges.
                </p>

                <p className="font-semibold text-xl text-yellow-400 mb-4 leading-relaxed">
                  Enter the access key to start your test.
                </p>

                <input
                  type="text"
                  value={key}
                  onChange={handleKeyChange}
                  className="w-2/3 bg-gray-200 text-gray-700 py-3 px-6 mb-4 rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  placeholder="Enter access key"
                />
                <div className="flex justify-center">
                  <button
                    onClick={handleSubmitKey}
                    className="w-2/3 bg-teal-600 text-white font-semibold py-3 px-6 rounded-md hover:bg-teal-700 shadow-lg transform hover:scale-105 transition duration-300"
                  >
                    Submit
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
    </div>
  );
};

export default Body;

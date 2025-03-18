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
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { host, user } = useSelector((state) => state.auth);

  // **State Management**
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [activeTab, setActiveTab] = useState("Student");
  const [key, setKey] = useState("");

  // **Mutation Hook**
  const [joinChallenge, joinStatus] = useJoinChallengeMutation();
  useMutationToast({
    ...joinStatus,
    successMessage: joinStatus.data?.message || "Challenge joined successfully",
  });

  // **Effect to Navigate on Success**
  useEffect(() => {
    if (joinStatus.isSuccess && joinStatus.data?.challengeID) {
      dispatch(setChallengeID(joinStatus.data.challengeID));
      navigate("/challenge-page");
    }
  }, [joinStatus.isSuccess, joinStatus.data, dispatch, navigate]);

  // **Handlers**
  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    setKey("");
  };
  const toggleForm = () => setIsLogin((prev) => !prev);
  const handleKeyChange = (event) => setKey(event.target.value);

  const handleSubmitKey = async () => {
    if (!key.trim()) return alert("Please enter a valid access key.");
    try {
      await joinChallenge({ challengeKey: key });
    } catch (error) {
      console.error("Error while joining challenge:", error);
    }
  };

  // **Render Tab Navigation**
  const renderTabNavigation = () => (
    <div className="flex justify-center space-x-8 mb-8">
      {["Instructor", "Student"].map((tab) => (
        <button
          key={tab}
          className={`px-6 py-3 rounded-md text-lg font-semibold ${
            activeTab === tab ? "bg-teal-500 text-white" : "bg-gray-700"
          } hover:scale-105 transition`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </div>
  );

  // **Render Tab Content**
  const renderTabContent = () => {
    const isInstructor = activeTab === "Instructor";
    return (
      <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
        <h2
          className={`text-3xl font-extrabold ${
            isInstructor ? "text-yellow-400" : "text-teal-400"
          } mb-6`}
        >
          {isInstructor ? "Instructor Dashboard" : "Student Access"}
        </h2>
        <p className="text-gray-300 mb-8 text-lg leading-relaxed">
          {isInstructor
            ? "Manage tests, monitor progress, and ensure a seamless experience for students."
            : "Improve your coding skills through personalized tests and challenges."}
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
    );
  };

  // **Render Modal**
  const renderModal = () => (
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
      {isLogin ? (
        <Login
          userType={activeTab == "Instructor" ? "Admin" : "Student"}
          onSubmit={closeModal}
          toggleForm={toggleForm}
        />
      ) : (
        <Signup
        userType={activeTab == "Instructor" ? "Admin" : "Student"}
        onSubmit={closeModal}
          toggleForm={toggleForm}
        />
      )}
    </Modal>
  );

  // **Render Logged-in View**
  const renderLoggedInView = () => {
    const isInstructor = Boolean(host);
    return (
      <div className="flex flex-col items-center space-y-6">
        {/* Instructor / Student Heading */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-10 max-w-md text-center">
          <h2
            className={`text-3xl font-extrabold ${
              isInstructor ? "text-yellow-400" : "text-teal-400"
            } mb-6`}
          >
            {isInstructor ? "Instructor Dashboard" : "Welcome, Student"}
          </h2>
          <p className="text-gray-300 mb-6 text-lg leading-relaxed">
            {isInstructor
              ? "Manage tests, monitor progress, and ensure a seamless experience for students."
              : "Explore coding contests and quizzes to enhance your skills!"}
          </p>
        </div>

        {/* Features Section (Only for Students) */}
        {!isInstructor && (
          <div className="flex flex-wrap justify-center gap-6">
            {/* Join Coding Contest Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-yellow-400 mb-4">
                Join Coding Contest
              </h3>
              <p className="text-gray-300 mb-4">
                Enter the access key to participate in exciting coding
                challenges.
              </p>
              <input
                type="text"
                value={key}
                onChange={handleKeyChange}
                className="w-full bg-gray-200 text-gray-700 py-2 px-4 mb-4 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                placeholder="Enter access key"
              />
              <button
                onClick={handleSubmitKey}
                className="w-full bg-yellow-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-yellow-600 shadow-lg transform hover:scale-105 transition duration-300"
              >
                Join Now
              </button>
            </div>

            {/* Take a Quiz Card */}
            <div className="bg-gray-800 rounded-lg shadow-lg p-6 max-w-xs text-center">
              <h3 className="text-2xl font-bold text-teal-400 mb-4">
                Take a Quiz
              </h3>
              <p className="text-gray-300 mb-4">
                Test your knowledge with fun and interactive quizzes.
              </p>
              <button
                onClick={() => navigate("/user/quiz/dashboard")}
                className="w-full bg-teal-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-teal-600 shadow-lg transform hover:scale-105 transition duration-300"
              >
                Start Quiz
              </button>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-gray-800 via-gray-900 to-black">
      {/* Title Section */}
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

      {/* Conditional Rendering */}
      {!host && !user ? (
        <>
          {renderTabNavigation()}
          <div className="flex justify-center">{renderTabContent()}</div>
        </>
      ) : (
        <div className="flex justify-center items-center min-h-screen">
          {renderLoggedInView()}
        </div>
      )}

      {isModalOpen && renderModal()}
    </div>
  );
};

export default Body;

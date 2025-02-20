/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaHome } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { formatTime } from "../../constants/constant";
import { FiSettings, FiUser } from "react-icons/fi";
import ConfirmationModal from "../../shared/ConfirmationModal";

function MCQNavbar({
  handleRun,
  handleSubmit,
  onSelect,
  toggleQuestionList,
  challenge,
}) {
  const [timeLeft, setTimeLeft] = useState(null);
  const [hasStarted, setHasStarted] = useState(false);
  const [hasEnded, setHasEnded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const navigate = useNavigate();

  // Effect to handle the timer and challenge states
  useEffect(() => {
    if (!challenge) return; // Guard against missing challenge data
    const startTime = new Date(challenge.startTime).getTime();
    const endTime = new Date(challenge.endTime).getTime();

    const updateTimer = () => {
      const currentTime = Date.now();
      if (currentTime < startTime) {
        setHasStarted(false);
        setHasEnded(false);
        setTimeLeft(startTime - currentTime);
      } else if (currentTime >= startTime && currentTime <= endTime) {
        setHasStarted(true);
        setHasEnded(false);
        setTimeLeft(endTime - currentTime);
      } else {
        setHasStarted(false);
        setHasEnded(true);
        setTimeLeft(0);
      }
    };

    updateTimer(); // Run initially
    const timer = setInterval(updateTimer, 1000); // Update every second

    return () => clearInterval(timer); // Cleanup on unmount
  }, [challenge]);
  return (
    <div className="w-full h-[8vh] flex justify-between items-center px-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white shadow-md">
      {/* Left Section: Home Link, Divider, Contest Name, and View Questions Button */}
      <div className="flex items-center space-x-6">
        <Link
          to="/challenge-page"
          className="flex items-center text-white hover:text-indigo-200 transition-colors duration-200"
        >
          <FaHome className="mr-2 text-xl" />
          <span className="font-semibold text-lg">Home</span>
        </Link>

        <div className="border-l-2 border-white h-8 mx-4"></div>

        <button
          onClick={toggleQuestionList}
          className="text-xs flex flex-col text-zinc-200 hover:text-white transition-colors duration-200"
        >
          <span className="text-sm font-semibold text-white">Contest Name</span>
          View all problems
        </button>
      </div>

      {/* Right Section: Timer, End Contest Button, Settings, and User Icons */}
      <div className="flex items-center space-x-6">
        <div className="text-lg">
          <span>{timeLeft ? formatTime(timeLeft) : "Loading..."}</span>
        </div>

        {hasStarted && !hasEnded && (
          <button
            onClick={() => setIsModalOpen(true)} // Open modal for confirmation
            className="bg-red-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-red-400 transition-transform transform hover:scale-105"
          >
            End Contest
          </button>
        )}

        <button className="text-white hover:text-indigo-200 transition-colors duration-200">
          <FiSettings className="text-2xl" />
        </button>
        <button className="text-white hover:text-indigo-200 transition-colors duration-200">
          <FiUser className="text-2xl" />
        </button>
      </div>

      {/* Confirmation Modal for End Contest */}
      <ConfirmationModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        // onConfirm={handleEndContest}
        title="End Contest"
        message="Are you sure you want to end this contest?"
      />
    </div>
  );
}

export default MCQNavbar;

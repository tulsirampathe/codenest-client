/* eslint-disable react/prop-types */
import React, { useEffect, useState } from "react";
import { FaTimes } from "react-icons/fa";
import useMutationToast from "../../hooks/useMutationToast";
import { useCreateChallengeMutation } from "../../redux/api/api";

function ChallengeSetup({ onClose, challengeType }) {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [description, setDescription] = useState("");

  // Destructure mutation and status properties
  const [createChallenge, createStatus] = useCreateChallengeMutation();

  // Apply `useMutationToast` to handle notifications
  useMutationToast({
    ...createStatus,
    loadingMessage: "Creating challenge...",
    successMessage:
      createStatus.data?.message || "Challenge created successfully!",
  });

  // Handle close logic after successful mutation
  useEffect(() => {
    if (createStatus.isSuccess) {
      onClose();
    }
  }, [createStatus.isSuccess, onClose]);

  // Function to handle time conversion to UTC
  const convertToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString(); // Converts to ISO string in UTC format
  };

  const handleCreateChallenge = async () => {
    // Convert times to UTC before sending
    const data = {
      title,
      description,
      startTime: convertToUTC(startTime),
      endTime: convertToUTC(endTime),
    };
    await createChallenge(data).unwrap(); // Unwrap to directly get the result
  };

  return (
    <div className="p-6 bg-white rounded-md shadow-lg w-full max-w-md mx-auto relative">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
      >
        <FaTimes />
      </button>
      <h1 className="text-2xl font-bold mb-4 text-gray-800 text-center border-b border-gray-200">
        {challengeType === "contests" ? "Coding" : "Quiz"} Challenge Setup
      </h1>

      {/* Challenge Setup Form */}
      <div className="mb-4">
        <label className="block text-gray-700">Challenge Name</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          required
        />
      </div>

      {/* Start and End Time */}
      <div className="mb-4">
        <label className="block text-gray-700">Start Time</label>
        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          required
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700">End Time</label>
        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          required
        />
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-gray-700">Challenge Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring focus:ring-indigo-500"
          rows="4"
        />
      </div>

      {/* Create Challenge Button */}
      <button
        onClick={handleCreateChallenge}
        className="w-full bg-indigo-600 text-white py-2 rounded-md hover:bg-indigo-700 transition duration-300"
      >
        Create {challengeType === "contests" ? "Coding" : "Quiz"} Challenge
      </button>
    </div>
  );
}

export default ChallengeSetup;

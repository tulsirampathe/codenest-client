/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  FaCalendarAlt,
  FaClipboard,
  FaClipboardCheck,
  FaTasks,
  FaTrash,
  FaKey,
} from "react-icons/fa";

const ChallengeHeader = ({
  challengeData,
  handleEditChallengeData,
  setIsEditing,
  isEditing,
  setIsModalOpen,
  handleCopy,
  copied,
}) => {

  // Reusable function to format dates and times
  const formatDateTime = (date) => {
    const dateObj = new Date(date);
    return dateObj.toLocaleString(undefined, {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <header className="p-8 rounded-lg bg-white shadow-lg w-full mb-6">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-2">
        {challengeData.title}
      </h1>
      {isEditing ? (
        <form onSubmit={handleEditChallengeData} className="mb-4">
          <input
            name="title"
            defaultValue={challengeData.title}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <textarea
            name="description"
            defaultValue={challengeData.description}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="datetime-local"
            name="startTime"
            defaultValue={formatDateTime(challengeData.startTime)}
            className="w-full border border-gray-300 rounded-md p-2 mb-2 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <input
            type="datetime-local"
            name="endTime"
            defaultValue={formatDateTime(challengeData.endTime)}
            className="w-full border border-gray-300 rounded-md p-2 mb-4 transition duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            required
          />
          <div className="flex justify-start">
            <button
              type="submit"
              className="bg-indigo-600 text-white py-2 px-4 rounded-md shadow hover:bg-indigo-700 transition duration-200"
            >
              Update Challenge Details
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="ml-2 bg-gray-400 text-white py-2 px-4 rounded-md shadow hover:bg-gray-500 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : (
        <>
          <p className="text-lg text-gray-700 font-medium mb-6 leading-relaxed">
            {challengeData.description}
          </p>

          {/* Start and End Date with Consistent Time Format */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm text-gray-800 mb-6">
            <div className="flex flex-col items-start bg-gradient-to-r from-indigo-200 to-indigo-300 text-indigo-800 py-4 px-6 rounded-lg font-semibold shadow-md w-full sm:w-auto max-w-xs transition duration-300 transform hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-indigo-600" />
                <span className="font-bold text-indigo-700">Start Date:</span>
              </div>
              <span className="text-gray-700">
                {formatDateTime(challengeData.startTime)}
              </span>
            </div>

            <div className="flex flex-col items-start bg-gradient-to-r from-indigo-200 to-indigo-300 text-indigo-800 py-4 px-6 rounded-lg font-semibold shadow-md w-full sm:w-auto max-w-xs transition duration-300 transform hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <FaCalendarAlt className="text-indigo-600" />
                <span className="font-bold text-indigo-700">End Date:</span>
              </div>
              <span className="text-gray-700">
                {formatDateTime(challengeData.endTime)}
              </span>
            </div>
          </div>

          {/* Key with Copy Option */}
          <div className="flex flex-col sm:flex-row justify-center gap-8 text-sm text-gray-800 mb-6">
            <div className="flex flex-col items-start bg-gradient-to-r from-indigo-200 to-indigo-300 text-indigo-800 py-4 px-6 rounded-lg font-semibold shadow-md w-full sm:w-auto max-w-xs transition duration-300 transform hover:scale-105">
              <div className="flex items-center gap-2 mb-2">
                <FaKey className="text-indigo-600" />
                <span className="font-bold text-indigo-700">
                  Challenge Key:
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-zinc-700 font-semibold underline">
                  {challengeData.key}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-4 rounded-full font-medium shadow-md hover:bg-indigo-700 transition duration-200 transform hover:scale-105"
                >
                  {copied ? (
                    <>
                      <FaClipboardCheck />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <FaClipboard />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* Action Buttons with Improved Design */}
          <div className="flex justify-center gap-8 mt-6">
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white py-2 px-6 rounded-full font-medium shadow-lg hover:bg-indigo-700 hover:shadow-xl transition duration-200 transform hover:scale-105 whitespace-nowrap"
            >
              <FaTasks />
              Edit Challenge
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-red-600 text-white py-2 px-6 rounded-full font-medium shadow-lg hover:bg-red-700 hover:shadow-xl transition duration-200 transform hover:scale-105 whitespace-nowrap"
            >
              <FaTrash />
              Delete Challenge
            </button>
          </div>
        </>
      )}
    </header>
  );
};

export default ChallengeHeader;



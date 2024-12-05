/* eslint-disable react/prop-types */
import React from "react";

function SubmissionResultCard({
  totalTestCases,
  passedTestCases,
  ErrorMessage,
  loading,
  onClose,
}) {
  const allTestCasesPassed = passedTestCases === totalTestCases;

  return (
    <div className="fixed top-0 right-0 w-full max-w-md bg-white shadow-lg rounded-lg p-6 m-4 border border-gray-300 z-50">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Submission Result</h2>
        <button
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 p-1 rounded-full focus:outline-none transition duration-200"
        >
          ✕
        </button>
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center items-center h-24">
            <svg
              className="animate-spin h-8 w-8 text-gray-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
              ></path>
            </svg>
            <p className="ml-4 text-gray-600 font-medium">Loading...</p>
          </div>
        ) : ErrorMessage ? (
          <div className="text-red-600 text-sm whitespace-pre-wrap">
            <strong>Error:</strong> {ErrorMessage}
          </div>
        ) : (
          <>
            <div className="text-gray-700 text-sm space-y-2">
              <p>
                <strong>Total Test Cases:</strong> {totalTestCases}
              </p>
              <p>
                <strong>Test Cases Passed:</strong> {passedTestCases}
              </p>
            </div>
            <div
              className={`p-4 rounded-lg text-center font-semibold ${
                allTestCasesPassed
                  ? "bg-green-100 text-green-700"
                  : "bg-red-100 text-red-700"
              }`}
            >
              {allTestCasesPassed ? (
                <>
                  <p className="text-xl">🎉 Congratulations!</p>
                  <p className="mt-2">
                    You nailed it! All test cases passed successfully. Keep up
                    the amazing work! 🚀
                  </p>
                </>
              ) : (
                <>
                  <p className="text-xl">💪 Don't Give Up!</p>
                  <p className="mt-2">
                    Some test cases failed, but every great coder faces
                    challenges. Review your solution, and you're bound to
                    succeed! 🌟
                  </p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default SubmissionResultCard;

/* eslint-disable react/prop-types */
import React from "react";
import { FaTimes } from "react-icons/fa";

const problems = [
  { id: 1, name: "Form Validation", exp: "0/10", status: "Not Attempted" },
  {
    id: 2,
    name: "React - inline stylings",
    exp: "0/10",
    status: "Not Attempted",
  },
  { id: 3, name: "useState returns", exp: "0/10", status: "Not Attempted" },
  { id: 4, name: "useReducer Hook", exp: "0/10", status: "Not Attempted" },
  {
    id: 5,
    name: "React - onclick syntax",
    exp: "0/10",
    status: "Not Attempted",
  },
];

const ShowQuestionList = ({ toggleQuestionList }) => {
  return (
    <div className="w-full p-6 text-white relative">
      <button
        onClick={toggleQuestionList}
        className="absolute top-4 right-4 text-gray-200 hover:bg-gray-500 p-2 rounded-full"
      >
        <FaTimes />
      </button>

      <h2 className="text-lg font-semibold mb-2">
        Problem of the day - <span className="text-yellow-400">MCQ</span>
      </h2>

      <div className="flex justify-between items-center mt-4 bg-gray-800 p-3 rounded-lg">
        <p>
          Total problems <span className="font-bold">5</span> • Attempted{" "}
          <span className="font-bold">0/5</span>
        </p>
        <p className="flex items-center gap-1">
          <span className="text-yellow-400">⚡</span> 0/50
        </p>
      </div>

      {/* Table Format */}
      <div className="mt-4 bg-gray-800 p-4 rounded-lg overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-700 text-left text-gray-300">
              <th className="p-3">#</th>
              <th className="p-3">Problem Name</th>
              <th className="p-3 text-center">XP</th>
              <th className="p-3 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {problems.map((problem, index) => (
              <tr
                key={problem.id}
                className="border-b border-gray-600 hover:bg-gray-700 transition rounded-lg"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{problem.name}</td>
                <td className="p-3 text-center text-yellow-400">
                  {problem.exp}
                </td>
                <td className="p-3 text-center">
                  <span
                    className={`px-2 py-1 rounded text-sm font-semibold ${
                      problem.status === "Solved"
                        ? "bg-green-600 text-white"
                        : "bg-red-600 text-white"
                    }`}
                  >
                    {problem.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ShowQuestionList;

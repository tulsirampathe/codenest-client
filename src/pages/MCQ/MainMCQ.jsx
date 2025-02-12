import React, { useState } from "react";
import MCQNavbar from "./MCQNavbar";
import ShowQuestionList from "./ShowQuestionList";
import ShowQuestion from "./ShowQuestion";

function MainMCQ() {
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [selected, setSelected] = useState(null);

  const options = [
    "Data correctness",
    "Mere data existence",
    "both (a) and (b)",
    "Data modification",
  ];

  const toggleQuestionList = () => {
    setShowQuestionList((prev) => !prev);
  };

  return (
    <div className="w-full min-h-screen bg-zinc-900 flex flex-col">
      <MCQNavbar toggleQuestionList={toggleQuestionList} />

      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-[92vh] gap-2 p-4 relative">
        <div className="col-span-1 md:col-span-1  bg-zinc-800 shadow-lg rounded-lg">
          {showQuestionList ? (
            <ShowQuestionList toggleQuestionList={toggleQuestionList} />
          ) : (
            <ShowQuestion />
          )}
        </div>

        <div className="col-span-1 md:col-span-2 p-4 bg-zinc-800 text-white shadow-lg rounded-lg">
          <h2 className="text-lg font-semibold mb-5">
            Options:{" "}
            <span className="text-zinc-400 text-sm">
              Pick one correct answer from below
            </span>
          </h2>
          <div className="space-y-3 mb-5">
            {options.map((option, index) => (
              <label
                key={index}
                className={`flex items-center space-x-2 p-3 border rounded-lg cursor-pointer transition ${
                  selected === index
                    ? "bg-gray-700 border-gray-500"
                    : "border-gray-600 hover:bg-gray-800"
                }`}
              >
                <input
                  type="radio"
                  name="mcq"
                  value={option}
                  checked={selected === index}
                  onChange={() => setSelected(index)}
                  className="hidden"
                />
                <div
                  className={`w-5 h-5 rounded-full border flex items-center justify-center ${
                    selected === index ? "border-blue-500" : "border-gray-500"
                  }`}
                >
                  {selected === index && (
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  )}
                </div>
                <span>{option}</span>
              </label>
            ))}
          </div>

          <div className="p-3 border rounded-lg bg-gray-600 border-gray-600 ">
            <h2 className="font-semibold ">Solution description</h2>
            <p className="text-sm text-gray-300">
              JSON is frequently used to send and receive data from a web
              server. The data that is sent to a web server must be a string. In
              that scenario, the js object is converted to a string using
              JSON.stringify().
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainMCQ;

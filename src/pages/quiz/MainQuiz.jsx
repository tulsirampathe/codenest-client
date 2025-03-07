import React, { useState } from "react";
import QuizNavbar from "./QuizNavbar";
import ShowQuestionList from "./ShowQuestionList";
import ShowQuestion from "./ShowQuestion";
import MCQNavigation from "./MCQNavigation";

function MainQuiz() {
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selected, setSelected] = useState(null);

  const questions = [
    {
      id: 1,
      title: "Form Validation",
      difficulty: "Medium",
      maxScore: 10,
      status: "Unsolved",
      problemStatement: "Given an array of integers, find the largest element.",
      options: [
        "Sort the array and take the last element",
        "Use a loop to track the max value",
        "Use the built-in max function",
        "All of the above",
      ],
    },
    {
      id: 2,
      title: "Database Indexing",
      difficulty: "Hard",
      maxScore: 15,
      status: "Unsolved",
      problemStatement:
        "Which indexing method is most efficient for searching in large databases?",
      options: ["B-Tree Indexing", "Hash Indexing", "Binary Search", "None"],
    },
    {
      id: 3,
      title: "React State Management",
      difficulty: "Easy",
      maxScore: 5,
      status: "Solved",
      problemStatement:
        "Which React hook is used to manage state inside a functional component?",
      options: ["useEffect", "useReducer", "useState", "useRef"],
    },
    {
      id: 4,
      title: "CSS Flexbox",
      difficulty: "Medium",
      maxScore: 10,
      status: "Unsolved",
      problemStatement:
        "Which property is used to align flex items along the main axis?",
      options: [
        "align-items",
        "flex-direction",
        "justify-content",
        "align-content",
      ],
    },
  ];

  const currentQuestion = questions[currentQuestionIndex];

  const toggleQuestionList = () => {
    setShowQuestionList((prev) => !prev);
  };

  const handleNext = () => {
    setSelected(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrev = () => {
    setSelected(null);
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleQuestionSelect = (index) => {
    setCurrentQuestionIndex(index);
    setShowQuestionList(false);
  };

  return (
    <div className="w-full min-h-screen flex flex-col bg-zinc-900">
      <QuizNavbar toggleQuestionList={toggleQuestionList} />

      <div className="grid grid-cols-1 md:grid-cols-3 w-full h-full md:h-[80vh] gap-2 p-4 flex-grow">
        <div className="col-span-1 md:col-span-1 bg-zinc-800 shadow-lg rounded-lg">
          {showQuestionList ? (
            <ShowQuestionList
              toggleQuestionList={toggleQuestionList}
              questions={questions}
              handleQuestionSelect={handleQuestionSelect}
            />
          ) : (
            <ShowQuestion question={currentQuestion} isSolved={false} />
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
            {currentQuestion.options.map((option, index) => (
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
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-row justify-center items-center w-full p-4 md:relative fixed bottom-0 left-0 right-0">
        <button
          className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
            currentQuestionIndex === 0
              ? "opacity-50 cursor-not-allowed bg-gray-700"
              : "bg-blue-600 hover:bg-blue-500"
          }`}
          onClick={handlePrev}
          disabled={currentQuestionIndex === 0}
        >
          Prev
        </button>

        <div className="mx-6 px-4 py-2 bg-zinc-800 rounded-lg text-sm font-medium text-gray-300 shadow-md">
          <button onClick={toggleQuestionList} className="cursor-pointer">
            Question {currentQuestionIndex + 1} of {questions.length}
          </button>
        </div>

        {currentQuestionIndex === questions.length - 1 ? (
          <button className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-500">
            Submit
          </button>
        ) : (
          <button
            className={`px-5 py-2 rounded-lg text-white font-semibold transition ${
              currentQuestionIndex === questions.length - 1
                ? "opacity-50 cursor-not-allowed bg-gray-700"
                : "bg-orange-500 hover:bg-orange-400"
            }`}
            onClick={handleNext}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}

export default MainQuiz;

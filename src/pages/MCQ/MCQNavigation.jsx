import { useState } from "react";
import { X } from "lucide-react";

const QuizNavigation = () => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const totalQuestions = 5;

  const handleNext = () => {
    if (currentQuestion < totalQuestions) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestion > 1) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  return (
    <div className=" text-white p-4 flex justify-center items-center relative">
      <button
        className={`text-gray-400 px-4 py-2 ${
          currentQuestion === 1
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-white"
        }`}
        onClick={handlePrev}
        disabled={currentQuestion === 1}
      >
        Prev
      </button>

      <button
        className="px-4 py-2"
      >
        Submit
      </button>

      {/* <div className="relative group">
        <div className="bg-gray-800 text-gray-300 px-4 py-2 rounded-md text-sm flex items-center space-x-2">
          <span>
            {currentQuestion}/{totalQuestions} done
          </span>
          <span>|</span>
          <span>Go to the next question</span>
          <button className="ml-2 text-gray-400 hover:text-white">
            <X size={16} />
          </button>
        </div>
      </div> */}

      <button
        className={`text-orange-500 px-4 py-2 ${
          currentQuestion === totalQuestions
            ? "opacity-50 cursor-not-allowed"
            : "hover:text-orange-400"
        }`}
        onClick={handleNext}
        disabled={currentQuestion === totalQuestions}
      >
        Next
      </button>
    </div>
  );
};

export default QuizNavigation;

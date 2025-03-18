import React, { useState, useEffect, useRef } from "react";
import { BiCodeBlock, BiTime } from "react-icons/bi";
import {
  FiCheck,
  FiChevronLeft,
  FiChevronRight,
  FiClock,
} from "react-icons/fi";
import {
  MdCheckCircle,
  MdHome,
  MdOutlineEmojiEvents,
  MdRestartAlt,
  MdTimer,
} from "react-icons/md";
import { useDispatch, useSelector } from "react-redux";
import {
  useGetUserQuizSubmissionQuery,
  useQuizDataQuery,
  useSubmitQuizQuestionMutation,
} from "../../redux/api/api";
import LoadingSpinner from "../../components/LoadingSpinner";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { setQuizID } from "../../redux/reducers/auth";

function MainQuiz() {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [timeSpent, setTimeSpent] = useState({});
  const [shuffledOptions, setShuffledOptions] = useState([]);
  const intervalRef = useRef(null);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, quizID } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!quizID && !quizSubmitted) {
      navigate("/user/quiz/dashboard");
    }
  }, [quizID, navigate]);

  const { data, isLoading: isQuizLoading } = useQuizDataQuery(quizID);
  const quizData = data?.quiz;



  const { data: userQuizAnswers, isLoading: isQuizAnswersLoading } =
    useGetUserQuizSubmissionQuery({ userId: user?._id, quizId: quizID });

  const [submitQuizQuestion] = useSubmitQuizQuestionMutation();

  useEffect(() => {
    if (userQuizAnswers?.submission?.answers) {
      setSelectedAnswers(userQuizAnswers.submission.answers);

      // Update timeSpent with the time taken from server
      const newTimeSpent = {};
      userQuizAnswers.submission.answers.forEach((answer) => {
        newTimeSpent[answer.question._id] = answer.timeTaken / 1000; // Convert ms to sec
      });
      setTimeSpent(newTimeSpent);
    }
  }, [userQuizAnswers]);

  useEffect(() => {
    if (quizData?.startTime && quizData?.endTime) {
      const startTime = moment.utc(quizData.startTime);
      const endTime = moment.utc(quizData.endTime);
      const durationSeconds = endTime.diff(startTime, "seconds"); // Convert to seconds
      setTimeRemaining(durationSeconds);
    }
  }, [quizData?.startTime, quizData?.endTime]);

  useEffect(() => {
    if (!quizSubmitted && timeRemaining > 0 && quizData) {
      const timer = setInterval(() => {
        setTimeRemaining((prev) => (prev > 0 ? prev - 1 : 0));
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [quizSubmitted, timeRemaining, quizData]);

  useEffect(() => {
    if (!quizData) return;

    const questionId = quizData.questions[currentQuestionIndex]._id;
    intervalRef.current = setInterval(() => {
      setTimeSpent((prev) => ({
        ...prev,
        [questionId]: (prev[questionId] || 0) + 1,
      }));
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [currentQuestionIndex, quizData]);

  const currentQuestion = quizData?.questions[currentQuestionIndex];

  useEffect(() => {
    if (currentQuestion?.options) {
      // Create an array of indexes to shuffle
      const indexedOptions = currentQuestion.options.map((option, index) => ({
        option,
        originalIndex: index, // Store original index for correct answer mapping
      }));

      // Shuffle options array using Fisher-Yates algorithm
      for (let i = indexedOptions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [indexedOptions[i], indexedOptions[j]] = [
          indexedOptions[j],
          indexedOptions[i],
        ];
      }

      setShuffledOptions(indexedOptions);
    }
  }, [currentQuestion]); // Shuffle only when the question changes

  const handleAnswerSelect = (questionId, optionIndex) => {
    const timeTaken = timeSpent[questionId] || 0; // Get time spent on the question

    submitQuizQuestion({
      quizId: quizID,
      questionId: questionId,
      selectedOption: optionIndex,
      timeTaken: timeTaken * 1000, // Convert seconds to milliseconds
    });
  };

  const handleQuizSubmit = () => {
    dispatch(setQuizID(null));
    setQuizSubmitted(true);
  };

  const formatTime = (seconds) => {
    const duration = moment.duration(seconds, "seconds");
    const hours = duration.hours();
    const minutes = duration.minutes();
    const secs = duration.seconds();

    let result = [];
    if (hours > 0) result.push(`${hours}h`);
    if (minutes > 0) result.push(`${minutes}m`);
    result.push(`${secs}s`);

    return result.join(" ");
  };

  if (isQuizLoading || !quizData || isQuizAnswersLoading) {
    return <LoadingSpinner />;
  }

  if (quizSubmitted) {
    return (
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-6">
        <div className="bg-gray-800 rounded-lg p-8 max-w-md w-full text-center shadow-lg">
          {/* Success Icon */}
          <MdCheckCircle className="text-5xl text-green-400 mx-auto mb-4" />

          <h1 className="text-2xl font-semibold mb-4">Quiz Completed</h1>
          <p className="text-gray-400 text-sm mb-6">
            You have successfully completed the quiz. Here are your results:
          </p>

          {/* Score Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-xl font-semibold text-blue-400">
                {userQuizAnswers?.submission?.totalScore}
              </p>
              <p className="text-gray-400 text-xs mt-1">Total Score</p>
            </div>
            <div className="bg-gray-700 p-4 rounded-md">
              <p className="text-xl font-semibold text-green-400">
                {Object.keys(selectedAnswers).length}/
                {quizData?.questions.length}
              </p>
              <p className="text-gray-400 text-xs mt-1">Questions Answered</p>
            </div>
          </div>

          {/* Back to Home Button */}
          <button
            onClick={() => navigate("/user/quiz/dashboard")}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium flex items-center justify-center gap-2 mx-auto transition"
          >
            <MdHome className="text-lg" /> Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-8">
      <div className="max-w-6xl mx-auto">
        {/* Quiz Header */}
        <div className="flex flex-col md:flex-row justify-between items-start mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
              {quizData.name}
            </h1>
            <div className="flex items-center gap-2 mt-2 text-gray-400">
              <FiClock className="text-blue-400" />
              <span className="font-semibold">
                {formatTime(timeRemaining)}
              </span>{" "}
              remaining
            </div>
          </div>
          <div className="bg-gray-700 px-6 py-3 rounded-xl flex items-center gap-3">
            <span className="font-semibold text-purple-400">
              Question {currentQuestionIndex + 1} of{" "}
              {quizData?.questions.length}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="h-3 bg-gray-700 rounded-full mb-8">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-300"
            style={{
              width: `${
                ((currentQuestionIndex + 1) / quizData?.questions.length) * 100
              }%`,
            }}
          />
        </div>

        {/* Main Quiz Content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Question Content */}
          <div className="lg:col-span-2 bg-gray-800 p-8 rounded-2xl shadow-xl">
            {/* Question Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-3 text-purple-400">
                <BiTime className="text-xl" />
                <span className="font-semibold">
                  {formatTime(timeSpent[currentQuestion._id] || 0)}
                </span>
              </div>
            </div>

            {/* Question Statement */}
            <h2 className="text-2xl font-semibold mb-2 leading-relaxed">
              {currentQuestion.text}
            </h2>

            {/* Options */}
            <div className="space-y-2 mb-12">
              {shuffledOptions.map(({ option, originalIndex }) => {
                const isSelected =
                  Array.isArray(selectedAnswers) &&
                  selectedAnswers.some(
                    (ans) =>
                      ans.question._id === currentQuestion._id &&
                      ans.selectedOption === originalIndex // Use original index
                  );

                return (
                  <button
                    key={originalIndex}
                    onClick={() =>
                      handleAnswerSelect(currentQuestion._id, originalIndex)
                    }
                    className={`w-full text-left p-3 rounded-xl transition-all flex items-center gap-4 ${
                      isSelected
                        ? "bg-blue-600/30 border-2 border-blue-500"
                        : "bg-gray-700 hover:bg-gray-600 border-2 border-transparent"
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        isSelected ? "bg-blue-500" : "bg-gray-600"
                      }`}
                    >
                      {isSelected && <FiCheck className="text-white text-lg" />}
                    </div>
                    <span className="text-lg">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation Controls */}
            <div className="flex justify-between items-center">
              <button
                onClick={() =>
                  setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))
                }
                disabled={currentQuestionIndex === 0}
                className="bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-xl flex items-center gap-2 disabled:opacity-50"
              >
                <FiChevronLeft /> Previous
              </button>

              {currentQuestionIndex === quizData.questions.length - 1 ? (
                <button
                  onClick={handleQuizSubmit}
                  className="bg-green-600 hover:bg-green-700 px-8 py-3 rounded-xl flex items-center gap-2"
                >
                  Submit <FiCheck />
                </button>
              ) : (
                <button
                  onClick={() => setCurrentQuestionIndex((prev) => prev + 1)}
                  className="bg-blue-600 hover:bg-blue-700 px-8 py-3 rounded-xl flex items-center gap-2"
                >
                  Next <FiChevronRight />
                </button>
              )}
            </div>
          </div>

          {/* Question Navigation */}
          <div className="lg:col-span-1 bg-gray-800 p-6 rounded-2xl shadow-xl">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
              <BiCodeBlock /> Questions
            </h2>
            <div className="grid grid-cols-4 gap-3">
              {quizData.questions.map((q, index) => (
                <button
                  key={q._id}
                  onClick={() => setCurrentQuestionIndex(index)}
                  className={`relative p-3 rounded-xl flex flex-col items-center justify-center transition-all ${
                    currentQuestionIndex === index
                      ? "bg-blue-600 text-white scale-105"
                      : Array.isArray(selectedAnswers) &&
                        selectedAnswers.some(
                          (ans) => ans.question._id === q._id
                        )
                      ? "bg-green-600/30 text-green-400"
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  <span className="text-sm font-medium">{index + 1}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MainQuiz;

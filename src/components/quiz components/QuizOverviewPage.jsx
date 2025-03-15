import React, { useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import useMutationToast from "../../hooks/useMutationToast";
import AddQuizQuestion from "../../pages/quiz/AddQuizQuetion";
import {
  useDeleteQuizMutation,
  useEditQuizDataMutation,
  useQuizDataQuery
} from "../../redux/api/api";
import ConfirmationDeleteModal from "../../shared/ConfirmationDeleteModal";
import ChallengeHeader from "../CreateChallenge/ChallengeHeader ";
import LeaderboardPanel from "../CreateChallenge/LeaderboardPanel";
import LoadingSpinner from "../LoadingSpinner";
import QuizProblemList from "./QuizProblemList";

function QuizOverviewPage() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showQuestionList, setShowQuestionList] = useState(false);
  const [copied, setCopied] = useState(false);

  const { quizID } = useSelector((state) => state.auth);

  const { data, isLoading: isQuizLoading } = useQuizDataQuery(quizID);
  const quizData = data?.quiz;

  // Mutation hooks for editing and deleting quizzes and questions
  const [editQuiz, editStatus] = useEditQuizDataMutation();
  const [deleteQuiz, deleteStatus] = useDeleteQuizMutation();

  // Custom hook for handling mutation responses
  useMutationToast({
    ...editStatus,
    successMessage: editStatus.data?.message || "Quiz updated successfully",
  });
  useMutationToast({
    ...deleteStatus,
    successMessage:
      deleteStatus.data?.message || "Challenge deleted successfully",
  });
  

  // Close edit mode after a successful edit
  useEffect(() => {
    if (editStatus.isSuccess) {
      setIsEditing(false);
    }
  }, [editStatus.isSuccess]);

  // Navigate to dashboard after successful deletion of challenge
  useEffect(() => {
    if (deleteStatus.isSuccess) {
      navigate("/quiz/batch");
    }
  }, [deleteStatus.isSuccess]);

  // Clipboard copy function
  const handleCopy = async () => {
    await navigator.clipboard.writeText(quizData.key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };


  // Show the modal for adding a new problem
  const handleAddNewProblem = () => {
    setShowQuestionList(true);
  };

  // Function to handle time conversion to UTC
  const convertToUTC = (localDateTime) => {
    const date = new Date(localDateTime);
    return date.toISOString(); // Converts to ISO string in UTC format
  };

  // Handle challenge data editing
  const handleEditQuizData = async (e) => {
    e.preventDefault();
    const updatedQuizData = {
      name: e.target.title.value,
      description: e.target.description.value,
      startTime: convertToUTC(e.target.startTime.value),
      endTime: convertToUTC(e.target.endTime.value),
    };
    await editQuiz({ id: quizID, data: updatedQuizData });
  };

  // Handle challenge deletion
  const handleDeleteQuiz = async () => {
    await deleteQuiz(quizID);
  };


  // Loading spinner if challenge data is still loading
  if (isQuizLoading || !quizData) {
    return <LoadingSpinner />;
  }

  return (
    <div className="flex flex-col md:flex-row sm:p-4 lg:p-8 bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen">
      {/* Left Side: Challenge Header and Section */}
      <div className="w-full md:w-1/3 p-4">
        {/* Header */}
        <ChallengeHeader
          challengeData={quizData}
          isEditing={isEditing}
          setIsEditing={setIsEditing}
          setIsModalOpen={setIsModalOpen}
          handleEditChallengeData={handleEditQuizData}
          handleCopy={handleCopy}
          copied={copied}
          showKey={false}
        />

        {/* Leaderboard and Participation Panel */}
        <LeaderboardPanel
          isChallengeLoading={isQuizLoading}
          quizData={quizData}
          type={"quiz"}
        />
      </div>

      {/* Right Side: Problem List */}
      <div className="w-full md:w-2/3 p-4">
        <QuizProblemList questions={quizData?.questions} />
      </div>

      {/* Modal for Delete Confirmation */}
      <ConfirmationDeleteModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleDeleteQuiz}
        title="Delete Quiz"
        message="Are you sure you want to delete this quiz? This action cannot be undone."
      />

      {/* Floating Add Problem Button */}
      <button
        onClick={handleAddNewProblem}
        className="fixed bottom-4 right-4 md:bottom-8 md:right-8 bg-indigo-600 text-white py-3 px-4 rounded-full shadow-lg hover:bg-indigo-700 transition duration-300 flex items-center gap-2"
      >
        <FaPlus />
        Add Question
      </button>

      {/* Conditionally render AddQuizQuestion */}
      {showQuestionList && (
        <AddQuizQuestion
          onClose={() => setShowQuestionList(false)}
        />
      )}
    </div>
  );
}

export default QuizOverviewPage;

/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { FaSyncAlt, FaTrophy, FaFilePdf } from "react-icons/fa";
import { useSelector } from "react-redux";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  useCalculateLeaderboardMutation,
  useGetLeaderboardQuery,
  useGetQuizLeaderboardQuery,
} from "../../redux/api/api";
import useMutationToast from "../../hooks/useMutationToast";

const LeaderboardPanel = ({ type }) => {
  const { challengeID, quizID } = useSelector((state) => state.auth);
  const [leaderboardParticipants, setLeaderboardParticipants] = useState([]);

  // Fetch the leaderboard based on type
  const {
    data: challengeLeaderboardData,
    isLoading: isChallengeLeaderboardLoading,
  } = useGetLeaderboardQuery(challengeID, { skip: type !== "challenge" });

  // Fetch the quiz leaderboard data with refetch capability
  const {
    data: quizLeaderboardData,
    isLoading: isQuizLeaderboardLoading,
    refetch: refetchQuizLeaderboard,
  } = useGetQuizLeaderboardQuery(quizID, { skip: type !== "quiz" });
  

  // Update leaderboard state when data is fetched
  useEffect(() => {
    if (type === "challenge" && challengeLeaderboardData?.leaderboard) {
      setLeaderboardParticipants(
        challengeLeaderboardData.leaderboard.participants || []
      );
    }
    if (type === "quiz" && quizLeaderboardData?.leaderboard) {
      setLeaderboardParticipants(quizLeaderboardData.leaderboard || []);
    }
  }, [type, challengeLeaderboardData, quizLeaderboardData]);

  // Handle leaderboard calculation
  const [calculateLeaderboard, calculateLeaderboardStatus] =
    useCalculateLeaderboardMutation();

  useMutationToast({
    ...calculateLeaderboardStatus,
    loadingMessage: "Leaderboard is being calculated, please wait...",
    successMessage: calculateLeaderboardStatus.data?.message,
  });

  // Refresh leaderboard function
  const onRefresh = async () => {
    try {
      if (type === "challenge") {
        const response = await calculateLeaderboard(challengeID);
        if (response?.data?.leaderboard) {
          setLeaderboardParticipants(
            response.data.leaderboard.participants || []
          );
        }
      } else if (type === "quiz") {
        await refetchQuizLeaderboard();
      }
    } catch (error) {
      console.error("Error refreshing leaderboard:", error);
    }
  };

  // ✅ Export leaderboard to PDF
  const exportToPDF = () => {
    if (!leaderboardParticipants.length) {
      alert("No leaderboard data to export!");
      return;
    }

    const doc = new jsPDF();

    // Ensure title and description are valid strings
    const title =
      type === "challenge"
        ? challengeLeaderboardData?.leaderboard?.challenge?.title ||
          "Challenge Leaderboard"
        : quizLeaderboardData?.leaderboard[0]?.quiz?.name || "Quiz Leaderboard";

    const description =
      type === "challenge"
        ? challengeLeaderboardData?.leaderboard?.challenge?.description ||
          "No description available."
        : quizLeaderboardData?.leaderboard[0]?.quiz?.description ||
          "No description available.";

    // Add "Leaderboard" heading
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Leaderboard", 105, 10, { align: "center" });

    // Add title below "Leaderboard"
    doc.setFontSize(16);
    doc.setFont("helvetica", "normal");
    doc.text(String(title), 105, 20, { align: "center" });

    // Add description (if available)
    if (description) {
      doc.setFontSize(12);
      doc.text(String(description), 14, 30, { maxWidth: 180 });
    }

    // Adjust table Y position based on description length
    const tableYPosition = description ? 45 : 35;

    // Prepare table data
    const tableData = leaderboardParticipants.map((participant, idx) => [
      idx + 1,
      participant.user?.username || "Unknown",
      participant.totalScore || 0,
    ]);

    // Add table to PDF
    autoTable(doc, {
      startY: tableYPosition,
      head: [["Rank", "Name", "Points"]],
      body: tableData,
    });

    // Save PDF
    doc.save(`${title.replace(/[^a-zA-Z0-9]/g, "_")}.pdf`); // Replace special chars
  };

  return (
    <section className="w-full p-6 bg-gray-50 rounded-lg shadow-xl">
      {/* Header Section with Actions */}
      <div className="flex flex-wrap justify-between items-center gap-y-3 mb-4">
        <h2 className="text-2xl font-bold text-indigo-700 flex items-center gap-2 w-full sm:w-auto justify-center sm:justify-start">
          <FaTrophy className="text-yellow-500 animate-bounce" />
          Leaderboard
        </h2>

        <div className="flex flex-wrap gap-3 justify-center sm:justify-end w-full sm:w-auto">
          {/* Refresh Button */}
          <button
            onClick={onRefresh}
            disabled={calculateLeaderboardStatus.isLoading}
            className="bg-indigo-600 text-white px-4 py-2 w-full sm:w-auto rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105 focus:outline-none flex items-center gap-2 justify-center"
          >
            <FaSyncAlt
              className={`w-5 h-5 ${
                calculateLeaderboardStatus.isLoading ? "animate-spin" : ""
              }`}
            />
            <span>Refresh</span>
          </button>

          {/* Export to PDF */}
          <button
            onClick={exportToPDF}
            className="bg-red-600 text-white px-4 py-2 w-full sm:w-auto rounded-lg shadow-md hover:bg-red-700 transition transform hover:scale-105 focus:outline-none flex items-center gap-2 justify-center"
          >
            <FaFilePdf className="w-5 h-5" />
            <span>PDF</span>
          </button>
        </div>
      </div>

      {/* Leaderboard Table */}
      <div className="p-4 bg-white rounded-lg shadow-lg overflow-hidden">
        {isChallengeLeaderboardLoading || isQuizLeaderboardLoading ? (
          <div className="text-center text-indigo-600">Loading...</div>
        ) : leaderboardParticipants.length > 0 ? (
          <div className="overflow-auto max-h-[400px] relative">
            <table className="w-full table-auto text-sm rounded-lg shadow-lg">
              <thead className="bg-indigo-600 text-white text-left sticky top-0 z-5">
                <tr>
                  <th className="px-6 py-3 text-center">Rank</th>
                  <th className="px-6 py-3">Name</th>
                  <th className="px-6 py-3 text-right">Points</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {leaderboardParticipants.map((participant, idx) => (
                  <tr
                    key={idx}
                    className={`${
                      idx % 2 === 0 ? "bg-indigo-50" : "bg-white"
                    } hover:bg-indigo-100 transition duration-200`}
                  >
                    <td className="px-6 py-3 text-center">{idx + 1}</td>
                    <td className="px-6 py-3">{participant.user?.username}</td>
                    <td className="px-6 py-3 text-right">
                      {participant.totalScore || 0} pts
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center text-indigo-600">
            No leaderboard data available.
          </div>
        )}
      </div>
    </section>
  );
};

export default LeaderboardPanel;

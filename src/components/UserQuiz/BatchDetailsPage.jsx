import moment from "moment";
import React from "react";
import { FaBell, FaCalendar, FaCode, FaUsers } from "react-icons/fa";

const BatchDetailsPage = () => {
  // Dummy data
  const batchDetails = {
    name: "Web Development Fundamentals",
    code: "WEB123",
    startDate: "2024-03-01",
    mentor: "John Doe",
    students: 45,
    description:
      "Comprehensive course covering modern web development technologies and practices.",
  };

  const quizzes = [
    {
      id: 1,
      title: "HTML/CSS Basics",
      date: "2024-03-10",
      duration: "30 mins",
      status: "Ongoing",
      score: "-",
    },
    {
      id: 2,
      title: "JavaScript Fundamentals",
      date: "2024-03-17",
      duration: "45 mins",
      status: "Upcoming",
      score: "-",
    },
    {
      id: 3,
      title: "React Basics",
      date: "2024-03-24",
      duration: "60 mins",
      status: "Upcoming",
      score: "-",
    },
    {
      id: 4,
      title: "HTML/CSS Basics",
      date: "2024-03-10",
      duration: "30 mins",
      status: "Completed",
      score: 85,
    },
  ];

  const notifications = [
    {
      id: 1,
      title: "New Quiz Added",
      message: "HTML/CSS Basics quiz now available",
      timestamp: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "Reminder",
      message: "JavaScript Fundamentals quiz starts tomorrow",
      timestamp: "1 day ago",
      read: true,
    },
    {
      id: 3,
      title: "Result Published",
      message: "Introduction to Web quiz results available",
      timestamp: "3 days ago",
      read: true,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          {/* Batch Details Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              {batchDetails.name}
            </h1>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <FaCode className="text-indigo-600" />
                <span className="text-gray-600">Code: {batchDetails.code}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FaCalendar className="text-indigo-600" />
                <span className="text-gray-600">
                  Start Date: {batchDetails.startDate}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FaUsers className="text-indigo-600" />
                <span className="text-gray-600">
                  Students: {batchDetails.students}
                </span>
              </div>
            </div>
            <div className="mt-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Description
              </h2>
              <p className="text-gray-600">{batchDetails.description}</p>
            </div>
          </div>

          {/* Batch Quizzes Section */}
          <div className="bg-white rounded-2xl shadow-sm p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              Batch Quizzes
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Ongoing Quizzes */}
              <div className="border-l-4 border-green-500">
                <div className="bg-green-50 px-4 py-2">
                  <h3 className="font-semibold text-green-800">
                    Ongoing Quizzes
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  {quizzes
                    .filter((quiz) => quiz.status === "Ongoing")
                    .map((quiz) => (
                      <div
                        key={quiz.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {quiz.date} • {quiz.duration}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="px-2 py-1 text-xs bg-green-100 text-green-800 rounded-full">
                            {quiz.status}
                          </span>
                          <button className="text-sm text-indigo-600 hover:text-indigo-800">
                            Start Now →
                          </button>
                        </div>
                      </div>
                    ))}
                  {quizzes.filter((quiz) => quiz.status === "Ongoing")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No ongoing quizzes
                    </p>
                  )}
                </div>
              </div>

              {/* Upcoming Quizzes */}
              <div className="border-l-4 border-blue-500">
                <div className="bg-blue-50 px-4 py-2">
                  <h3 className="font-semibold text-blue-800">
                    Upcoming Quizzes
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  {quizzes
                    .filter((quiz) => quiz.status === "Upcoming")
                    .map((quiz) => (
                      <div
                        key={quiz.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {quiz.title}
                        </h3>
                        <p className="text-gray-600 text-sm mt-1">
                          {quiz.date} • {quiz.duration}
                        </p>
                        <div className="mt-3 flex items-center justify-between">
                          <span className="px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded-full">
                            {quiz.status}
                          </span>
                          <span className="text-sm text-gray-500">
                            Starts in {moment(quiz.date).fromNow(true)}
                          </span>
                        </div>
                      </div>
                    ))}
                  {quizzes.filter((quiz) => quiz.status === "Upcoming")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No upcoming quizzes
                    </p>
                  )}
                </div>
              </div>

              {/* Completed Quizzes */}
              <div className="border-l-4 border-purple-500">
                <div className="bg-purple-50 px-4 py-2">
                  <h3 className="font-semibold text-purple-800">
                    Completed Quizzes
                  </h3>
                </div>
                <div className="space-y-4 p-4">
                  {quizzes
                    .filter((quiz) => quiz.status === "Completed")
                    .map((quiz) => (
                      <div
                        key={quiz.id}
                        className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
                      >
                        <h3 className="font-semibold text-gray-800">
                          {quiz.title}
                        </h3>
                        <div className="mt-2 flex items-center justify-between">
                          <div>
                            <p className="text-gray-600 text-sm">Score</p>
                            <div className="text-lg font-bold text-purple-600">
                              {quiz.score}/100
                            </div>
                          </div>
                          <button className="text-sm text-indigo-600 hover:text-indigo-800">
                            View Results →
                          </button>
                        </div>
                        <p className="text-gray-500 text-xs mt-2">
                          Completed on {moment(quiz.date).format("MMM D, YYYY")}
                        </p>
                      </div>
                    ))}
                  {quizzes.filter((quiz) => quiz.status === "Completed")
                    .length === 0 && (
                    <p className="text-gray-500 text-sm text-center py-4">
                      No completed quizzes
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Sidebar */}
        <div className="bg-white rounded-2xl shadow-sm p-6 h-fit lg:sticky lg:top-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
            <FaBell className="text-indigo-600 mr-2" />
            Notifications
          </h2>
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 rounded-lg ${
                  !notification.read
                    ? "bg-indigo-50 border border-indigo-200"
                    : "bg-gray-50"
                }`}
              >
                <div className="flex items-start space-x-3">
                  <div
                    className={`mt-1 w-2 h-2 rounded-full ${
                      !notification.read ? "bg-indigo-600" : "bg-gray-400"
                    }`}
                  />
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      {notification.title}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {notification.message}
                    </p>
                    <p className="text-gray-400 text-xs mt-1">
                      {notification.timestamp}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BatchDetailsPage;

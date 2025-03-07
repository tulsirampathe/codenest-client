import { useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import AddQuizQuestion from "../../pages/quiz/AddQuizQuetion";

export default function QuizProblemList() {
  const [questionsList, setQuestionsList] = useState([
    {
      question: "What is the capital of France?",
      options: ["Berlin", "Madrid", "Paris", "Rome"],
      correctAnswer: 2,
    },
    {
      question:
        "Which planet is known as the Red Planet? It has a thin atmosphere composed mostly of carbon dioxide?",
      options: ["Earth", "Mars", "Jupiter", "Venus"],
      correctAnswer: 1,
    },
    {
      question: "Who developed the theory of relativity?",
      options: ["Newton", "Einstein", "Tesla", "Galileo"],
      correctAnswer: 1,
    },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [editData, setEditData] = useState(null);

  const handleAddOrUpdateQuestion = (newQuestion) => {
    if (editData) {
      const updatedQuestions = questionsList.map((q) =>
        q.question === editData.question ? newQuestion : q
      );
      setQuestionsList(updatedQuestions);
    } else {
      setQuestionsList([...questionsList, newQuestion]);
    }
    setEditData(null);
    setShowForm(false);
  };

  const handleEdit = (question) => {
    setEditData(question);
    setShowForm(true);
  };

  const handleDelete = (index) => {
    setQuestionsList(questionsList.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen">
      <h2 className="text-2xl font-bold mb-4 text-indigo-700">
        Added Questions
      </h2>

      {/* Grid layout with uniform height cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {questionsList.map((q, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300 p-6 border-l-4 border-indigo-500 flex flex-col justify-between"
          >
            {/* Question */}
            <h2 className="text-lg font-semibold text-gray-800 line-clamp-2">
              Q{index + 1}: {q.question}
            </h2>

            <div className="grid grid-cols-2 gap-2 text-gray-600 mt-4">
              {q.options.map((opt, i) => (
                <div
                  key={i}
                  className={`p-3 border rounded-md text-center font-medium ${
                    q.correctAnswer === i
                      ? "bg-green-100 text-green-700 border-green-500 font-bold"
                      : "border-gray-300"
                  }`}
                >
                  {opt}
                </div>
              ))}
            </div>

            {/* Action Buttons - Always at the Bottom */}
            <div className="flex justify-between items-center mt-4">
              <button className="flex items-center gap-2 text-indigo-600 hover:text-indigo-800 font-semibold transition" onClick={() => handleEdit(q)}>
                <FaEdit />
                <span>Edit</span>
              </button>

              <button className="flex items-center gap-2 text-red-600 hover:text-red-800 font-semibold transition" onClick={() => handleDelete(index)}>
                <FaTrash />
                <span>Delete</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <AddQuizQuestion
          onSubmit={handleAddOrUpdateQuestion}
          onClose={() => setShowForm(false)}
          editData={editData}
        />
      )}
    </div>
  );
}

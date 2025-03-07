/* eslint-disable react/prop-types */
import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddQuizQuestion({ onSubmit, editData, onClose }) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState(["", "", "", ""]);
  const [correctAnswer, setCorrectAnswer] = useState(null);
  
  const isEditMode = Boolean(editData); // Checks if we are editing

  useEffect(() => {
    if (isEditMode) {
      setQuestion(editData.question || "");
      setOptions(editData.options || ["", "", "", ""]);
      setCorrectAnswer(editData.correctAnswer ?? null);
    } else {
      setQuestion("");
      setOptions(["", "", "", ""]);
      setCorrectAnswer(null);
    }
  }, [editData]);

  const handleSubmit = () => {
    if (!question.trim() || options.some((opt) => !opt.trim()) || correctAnswer === null) {
      alert("Please fill all fields and select the correct answer.");
      return;
    }

    console.log(question, options, "correct : ", correctAnswer);
    
    
    onSubmit({ question, options, correctAnswer });

    // Reset form after submission
    setQuestion("");
    setOptions(["", "", "", ""]);
    setCorrectAnswer(null);
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50">
      <div className="bg-white shadow-lg p-6 rounded-xl border w-full max-w-lg relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <X size={24} />
        </button>

        <h2 className="text-2xl font-semibold mb-4 text-blue-600 text-center">
          {isEditMode ? "Edit MCQ" : "Add MCQ"}
        </h2>

        {/* Question Input */}
        <textarea
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Enter question..."
          className="w-full p-3 border rounded mb-4 focus:ring focus:ring-blue-300"
        />

        {/* Options Input */}
        {options.map((opt, i) => (
          <div key={i} className="flex items-center gap-2 mb-2">
            <input
              type="radio"
              name="correct"
              checked={correctAnswer === i}
              onChange={() => setCorrectAnswer(i)}
              className="cursor-pointer"
            />
            <input
              value={opt}
              onChange={(e) => {
                const newOptions = [...options];
                newOptions[i] = e.target.value;
                setOptions(newOptions);
              }}
              placeholder={`Option ${String.fromCharCode(65 + i)}`}
              className="w-full p-2 border rounded focus:ring focus:ring-blue-300"
            />
          </div>
        ))}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          className="w-full mt-4 bg-blue-600 text-white p-3 rounded hover:bg-blue-700 transition-all"
        >
          {isEditMode ? "Update" : "Save"}
        </button>
      </div>
    </div>
  );
}

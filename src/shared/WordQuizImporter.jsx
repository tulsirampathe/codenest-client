/* eslint-disable react/prop-types */
import { useEffect, useRef, useState } from "react";
import mammoth from "mammoth";
import { useSelector } from "react-redux";
import { useAddMultipleQuestionToQuizMutation } from "../redux/api/api";
import useMutationToast from "../hooks/useMutationToast";
import { useNavigate } from "react-router-dom";

const WordQuizImporter = () => {
  const [parsedQuestions, setParsedQuestions] = useState([]);
  const [error, setError] = useState("");
  const fileInputRef = useRef(null); // Add ref

  const navigate = useNavigate();

  const { quizID } = useSelector((state) => state.auth);

  const [addMultipleQuestionToQuiz, QuestionsStatus] =
    useAddMultipleQuestionToQuizMutation();

  useMutationToast({
    ...QuestionsStatus,
    successMessage: "New questions are added successfully!",
  });

  useEffect(() => {
    if (QuestionsStatus?.isSuccess) {
      navigate("/quiz/overview");
    }
  }, [QuestionsStatus?.isSuccess]);

  const parseHtmlContent = (html) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/html");
    const tables = doc.querySelectorAll("table");
    const questions = [];

    tables.forEach((table) => {
      const question = {
        text: "",
        options: [],
        correctAnswerIndex: -1,
        explanation: "",
        marks: 0,
      };

      const rows = table.querySelectorAll("tr");
      rows.forEach((row) => {
        const cells = row.querySelectorAll("td");
        if (cells.length >= 3) {
          const type = cells[0].textContent.trim();
          const content = cells[1].textContent.trim();
          const correctness = cells[2]?.textContent.trim().toLowerCase();

          switch (type) {
            case "Question":
              question.text = content;
              break;
            case "Option A":
            case "Option B":
            case "Option C":
            case "Option D":
              const index = type.charCodeAt(7) - 65; // Get A(0)-D(3)
              question.options[index] = content;
              if (correctness === "correct") {
                question.correctAnswerIndex = index;
              }
              break;
            case "Solution":
              question.explanation = content;
              break;
            case "Marks":
              question.marks = parseInt(content) || 0;
              break;
          }
        }
      });

      // Validate the question
      if (
        question.text &&
        question.options.length === 4 &&
        question.correctAnswerIndex !== -1
      ) {
        questions.push(question);
      }
    });

    return questions;
  };

  const handleFileUpload = async (file) => {
    try {
      // Reset previous state
      setParsedQuestions([]);
      setError("");

      const result = await mammoth.convertToHtml({ arrayBuffer: file });
      const questions = parseHtmlContent(result.value);

      if (questions.length === 0) {
        setError("No valid questions found. Please check the table format.");
        return;
      }

      setParsedQuestions(questions);
    } catch (err) {
      setError("Error parsing Word document. Please check the file format.");
    } finally {
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleQuestionChange = (qIndex, field, value) => {
    const updatedQuestions = parsedQuestions.map((q, index) => {
      if (index === qIndex) {
        return { ...q, [field]: value };
      }
      return q;
    });
    setParsedQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const updatedQuestions = parsedQuestions.map((q, index) => {
      if (index === qIndex) {
        const newOptions = [...q.options];
        newOptions[optIndex] = value;
        return { ...q, options: newOptions };
      }
      return q;
    });
    setParsedQuestions(updatedQuestions);
  };

  const handleSolutionChange = (qIndex, value) => {
    const updatedQuestions = parsedQuestions.map((q, index) => {
      if (index === qIndex) {
        return { ...q, explanation: value };
      }
      return q;
    });
    setParsedQuestions(updatedQuestions);
  };

  const handleMarksChange = (qIndex, value) => {
    const updatedQuestions = parsedQuestions.map((q, index) => {
      if (index === qIndex) {
        return { ...q, marks: Math.max(0, parseInt(value) || 0) };
      }
      return q;
    });
    setParsedQuestions(updatedQuestions);
  };

  const handleCorrectAnswerChange = (qIndex, value) => {
    const updatedQuestions = parsedQuestions.map((q, index) => {
      if (index === qIndex) {
        return { ...q, correctAnswerIndex: parseInt(value) };
      }
      return q;
    });
    setParsedQuestions(updatedQuestions);
  };

  const validateQuestions = () => {
    return parsedQuestions.every(
      (q) =>
        q.text.trim() &&
        q.options.length === 4 &&
        q.options.every((opt) => opt.trim()) &&
        q.correctAnswerIndex >= 0 &&
        q.marks > 0
    );
  };

  const onImport = (questions) => {
    addMultipleQuestionToQuiz({ quizId: quizID, questions });
  };

  return (
    <div className="max-w-3xl mt-10 mx-auto p-6 bg-white rounded-lg shadow-md">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Upload Formatted Word Document (.docx)
        </label>

        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center px-4 py-6 bg-white text-blue rounded-lg shadow tracking-wide uppercase border border-blue cursor-pointer hover:bg-blue-100 hover:text-blue-900">
            <svg
              className="w-8 h-8"
              fill="currentColor"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <path d="M16.88 9.1A4 4 0 0 1 16 17H5a5 5 0 0 1-1-9.9V7a3 3 0 0 1 4.52-2.59A4.98 4.98 0 0 1 17 8c0 .38-.04.74-.12 1.1zM11 11h3l-4-4-4 4h3v3h2v-3z" />
            </svg>
            <span className="mt-2 text-base leading-normal">Select a file</span>
            <input
              type="file"
              className="hidden"
              accept=".docx"
              onChange={(e) => handleFileUpload(e.target.files[0])}
              ref={fileInputRef}
            />
          </label>
        </div>

        {error && <div className="mt-2 text-red-600 text-sm">{error}</div>}

        {parsedQuestions.length == 0 && (
          <div className="mt-4 text-sm text-gray-500">
            <p>Required table format:</p>
            <table className="mt-2 border-collapse w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="border p-2">Question Type</th>
                  <th className="border p-2">Content</th>
                  <th className="border p-2">Correctness</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Question</td>
                  <td className="border p-2">Your question text</td>
                  <td className="border p-2"></td>
                </tr>
                {[...Array(4)].map((_, i) => (
                  <tr key={i}>
                    <td className="border p-2">
                      Option {String.fromCharCode(65 + i)}
                    </td>
                    <td className="border p-2">Option text</td>
                    <td className="border p-2">correct/incorrect</td>
                  </tr>
                ))}
                <tr>
                  <td className="border p-2">Solution</td>
                  <td className="border p-2">Explanation</td>
                  <td className="border p-2"></td>
                </tr>
                <tr>
                  <td className="border p-2">Marks</td>
                  <td className="border p-2">Number</td>
                  <td className="border p-2"></td>
                </tr>
              </tbody>
            </table>

            {/* Download button for Word format */}
            <div className="mt-4">
              <a
                href="/Quiz_Quesion_Template.docx"
                download="Quiz_Quesion_Template.docx"
                className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
              >
                Download Word Format
              </a>
            </div>
          </div>
        )}
      </div>

      {parsedQuestions.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-4">
            Edit Questions ({parsedQuestions.length} questions found)
          </h3>

          <div className="space-y-6">
            {parsedQuestions.map((q, qIndex) => (
              <div key={qIndex} className="p-4 bg-gray-50 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div className="flex-1 mr-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Question
                    </label>
                    <input
                      type="text"
                      value={q.text}
                      onChange={(e) =>
                        handleQuestionChange(qIndex, "text", e.target.value)
                      }
                      className="font-semibold text-gray-800 bg-white border-b-2 border-gray-300 focus:border-blue-500 w-full p-2 rounded-t"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Marks
                    </label>
                    <input
                      type="number"
                      value={q.marks}
                      onChange={(e) =>
                        handleMarksChange(qIndex, e.target.value)
                      }
                      className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm w-20"
                      min="1"
                    />
                  </div>
                </div>

                <div className="mt-4">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Options (Click ✓ to mark correct answer)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {q.options.map((option, optIndex) => (
                      <div
                        key={optIndex}
                        className={`p-3 rounded-md ${
                          optIndex === q.correctAnswer
                            ? "bg-green-100 border-green-300"
                            : "bg-white border-gray-200"
                        } border flex items-center`}
                      >
                        <span className="font-medium mr-2 w-6">
                          {String.fromCharCode(65 + optIndex)})
                        </span>
                        <input
                          type="text"
                          value={option}
                          onChange={(e) =>
                            handleOptionChange(qIndex, optIndex, e.target.value)
                          }
                          className="flex-1 bg-transparent focus:outline-none"
                        />
                        <button
                          onClick={() =>
                            handleCorrectAnswerChange(qIndex, optIndex)
                          }
                          className={`ml-2 px-2 py-1 rounded ${
                            optIndex === q.correctAnswerIndex
                              ? "bg-green-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          ✓
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Solution Explanation
                  </label>
                  <textarea
                    value={q.explanation}
                    onChange={(e) =>
                      handleSolutionChange(qIndex, e.target.value)
                    }
                    className="w-full p-3 text-sm bg-white rounded-md border border-gray-200 focus:border-blue-500"
                    placeholder="Add detailed solution explanation..."
                    rows="3"
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="mt-6 flex justify-between items-center">
            <div className="text-sm text-red-600">
              {!validateQuestions() &&
                "Please fill all required fields and ensure each question has a correct answer"}
            </div>
            <button
              onClick={() => onImport(parsedQuestions)}
              disabled={!validateQuestions()}
              className={`px-6 py-2 rounded-md ${
                validateQuestions()
                  ? "bg-blue-500 text-white hover:bg-blue-600"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              } transition-colors`}
            >
              Confirm Import
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WordQuizImporter;

import React from "react";

const About = () => {
  return (
    <div className="min-h-screen pt-24 pb-12 px-6 sm:px-12 bg-gray-950 text-gray-200 font-inter">
      {/* Hero Section */}
      <section className="text-center mb-16">
        <h1 className="text-4xl sm:text-6xl font-extrabold bg-gradient-to-r from-cyan-400 via-indigo-500 to-purple-600 bg-clip-text text-transparent mb-4">
          About CodeNest
        </h1>
        <p className="text-lg sm:text-xl max-w-3xl mx-auto text-gray-400">
          A modern, free-to-use coding and assessment platform tailored for colleges. Built to simplify the way educators conduct coding contests and quizzes, and help students sharpen their skills in an engaging environment.
        </p>
      </section>

      {/* Why We Built CodeNest */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold text-center mb-6">Why CodeNest?</h2>
        <p className="text-gray-400 max-w-4xl mx-auto text-center text-lg leading-relaxed">
          Students often lack affordable, curriculum-integrated platforms to practice coding and test conceptual understanding. At the same time, teachers face challenges in organizing contests and quizzes while tracking student performance effectively. <span className="text-cyan-400 font-medium">CodeNest bridges this gap</span> with a dedicated solution for both.
        </p>
      </section>

      {/* What We Offer */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold text-center mb-10">What CodeNest Offers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-cyan-500 transition">
            <h3 className="text-2xl font-semibold text-cyan-400 mb-3">💻 For Students</h3>
            <ul className="text-gray-400 list-disc list-inside space-y-2">
              <li>Participate in real-time coding contests</li>
              <li>Access quizzes within your batch</li>
              <li>Get ranked and track your coding growth</li>
              <li>Solve challenges using an intuitive code editor</li>
            </ul>
          </div>

          <div className="bg-gray-900 p-6 rounded-xl border border-gray-800 hover:border-yellow-500 transition">
            <h3 className="text-2xl font-semibold text-yellow-400 mb-3">🧑‍🏫 For Educators</h3>
            <ul className="text-gray-400 list-disc list-inside space-y-2">
              <li>Create and manage coding contests & test cases</li>
              <li>Assign quizzes to batches of students</li>
              <li>Monitor student performance with leaderboards</li>
              <li>Use a dedicated platform without any cost</li>
            </ul>
          </div>
        </div>
      </section>

      {/* Platform Highlights */}
      <section className="mb-20">
        <h2 className="text-3xl font-semibold text-center mb-10">Why Choose CodeNest?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:shadow-md transition">
            <h3 className="text-xl font-medium text-teal-300 mb-2">✅ Completely Free</h3>
            <p className="text-gray-400">Unlike other platforms, CodeNest is 100% free for both students and teachers.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:shadow-md transition">
            <h3 className="text-xl font-medium text-indigo-300 mb-2">🎯 Academic-Focused</h3>
            <p className="text-gray-400">Designed specifically for college use with batch-wise assessments and user-friendly tools.</p>
          </div>
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700 hover:shadow-md transition">
            <h3 className="text-xl font-medium text-purple-300 mb-2">🚀 Modern Experience</h3>
            <p className="text-gray-400">Fast, responsive UI with an interactive code editor and smooth navigation.</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;

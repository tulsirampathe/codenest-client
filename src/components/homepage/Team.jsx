import React from "react";
import pawanImg from "../../assets/ram.jpeg";
import tulsiImg from "../../assets/tulsi.jpeg";
import ujjwalImg from "../../assets/ujjwal.jpeg";

const Team = () => {
  const teamMembers = [
    { name: "Pawan Tiwari", img: pawanImg, work: "Frontend" },
    { name: "Tulsiram Pathe", img: tulsiImg, work: "Backend" },
    { name: "Ujjwal Pateliya", img: ujjwalImg, work: "Team Spirit" },
  ];

  return (
    <div className="relative bg-gray-900 py-20 overflow-hidden">
      <h2 className="relative text-center text-4xl font-bold text-white mb-6 z-10">
        Meet the Team
      </h2>

      <div className="flex justify-center gap-12 z-10 relative">
        {teamMembers.map((member, index) => (
          <div
            key={index}
            className="relative bg-white p-8 w-72 h-96 shadow-xl rounded-lg transform transition-all duration-500 ease-in-out hover:scale-105 hover:shadow-2xl text-center group"
          >
            {/* Sweating Effect */}
            <div className="absolute top-0 left-0 right-0 bottom-0 bg-gradient-to-t from-transparent to-blue-300 opacity-10 group-hover:opacity-30 transition-opacity"></div>
            <img
              src={member.img}
              alt={member.name}
              className="w-36 h-36 rounded-full mx-auto mb-6 object-cover"
            />
            <h3 className="text-2xl font-semibold text-gray-800 mb-2">
              {member.name}
            </h3>
            <p className="text-gray-500">{member.work}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Team;

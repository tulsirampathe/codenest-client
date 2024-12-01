import React from "react";
import { Outlet } from "react-router-dom";
import HomeNavbar from "../homepage/HomeNavbar";
import Features from "../homepage/Features";
import Footer from "../homepage/Footer";
import Team from "../homepage/Team";

function NotProtectedLayout() {
  return (
    <div className="not-protected-layout bg-gray-50">
      {/* Navbar Section */}
      <div className="fixed top-0 left-0 w-full z-50">
        <HomeNavbar />
      </div>

      {/* Main Content Section */}
      <div className="pt-[4rem]">
        <Outlet />
      </div>

      {/* Additional Sections */}
      <Features />
      <Team />
      <Footer />
    </div>
  );
}

export default NotProtectedLayout;

import React from "react";
// import "../assets/styles/Homepage.css";
import Navbar from "../components/common/Navbar";

const Homepage = () => {
  return (
    <div className="container">
      <Navbar />
      <main>
        <h2>Welcome to My Project</h2>
        <p>This is the homepage.</p>
      </main>
    </div>
  );
};

export default Homepage;

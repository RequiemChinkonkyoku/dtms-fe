import React from "react";
import Navbar from "../components/common/Navbar";

const Homepage = () => {
  return (
    <div>
      {" "}
      <Navbar />
      <div className="container">
        <main>
          <h2>Welcome to My Project</h2>
          <p>This is the homepage.</p>
        </main>
      </div>
    </div>
  );
};

export default Homepage;

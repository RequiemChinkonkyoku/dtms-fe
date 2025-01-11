// Loader.jsx
import React from "react";
import { useLoading } from "../../../contexts/LoadingContext";
import "../../css/loader.css";

const Loader = () => {
  const { loading } = useLoading();

  if (!loading) return null;

  return (
    <div className="loader-overlay">
      <div className="card-loader">
        <div className="loader">
          <p>loading</p>
          <div className="words-loader">
            <span className="word-loader">buttons</span>
            <span className="word-loader">forms</span>
            <span className="word-loader">switches</span>
            <span className="word-loader">cards</span>
            <span className="word-loader">buttons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

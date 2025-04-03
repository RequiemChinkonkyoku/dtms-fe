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
            <span className="word-loader text-warning">buttons</span>
            <span className="word-loader text-primary">forms</span>
            <span className="word-loader text-info">switches</span>
            <span className="word-loader text-rose">cards</span>
            <span className="word-loader text-danger">buttons</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Loader;

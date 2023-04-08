import React from "react";
import "../styles/LoadingOverlay.css";

const LoadingOverlay = (props) => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">{props.message}</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;

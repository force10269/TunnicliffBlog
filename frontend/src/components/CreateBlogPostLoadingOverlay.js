import React from "react";
import "../styles/LoadingOverlay.css";

const CreateBlogPostLoadingOverlay = () => {

  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Creating blog post...</p>
      </div>
    </div>
  );
};

export default CreateBlogPostLoadingOverlay;

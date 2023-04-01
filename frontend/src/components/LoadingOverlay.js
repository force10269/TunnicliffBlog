import React from 'react';
import '../styles/LoadingOverlay.css';

const LoadingOverlay = () => {
  return (
    <div className="loading-overlay">
      <div className="loading-spinner-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading...</p>
      </div>
    </div>
  );
};

export default LoadingOverlay;
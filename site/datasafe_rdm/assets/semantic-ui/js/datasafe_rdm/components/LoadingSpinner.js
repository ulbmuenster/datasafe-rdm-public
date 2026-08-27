import React from "react";

const LoadingSpinner = () => {
  return (
    <div style={{
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      minHeight: "50vh", // Changed from height to minHeight,
      zIndex: "1",
    }}>
      <div className="ui active centered inline loader">
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
};

export default LoadingSpinner;

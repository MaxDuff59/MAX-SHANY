import React from "react";
import "./LoadingPage.css";

export default function LoadingPage() {
  return (
    <div className="loading-screen" role="status" aria-label="Chargement de Max & Shany">
      <div className="loading-content">
        <span className="loading-name loading-name--max">Max</span>
        <span className="loading-amp">&amp;</span>
        <span className="loading-name loading-name--shany">Shany</span>
      </div>
      <div className="loading-thread" aria-hidden="true"></div>
    </div>
  );
}

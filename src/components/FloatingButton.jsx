import React from "react";
import "./FloatingButton.css";

const FloatingButton = ({ onClick, icon = "bi bi-arrow-up", text }) => {
  return (
    <button className="floating-btn" onClick={onClick}>
      <i className={icon}></i>
      {text && <span className="btn-text ms-2">{text}</span>}
    </button>
  );
};

export default FloatingButton;

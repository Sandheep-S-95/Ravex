import React, { useState } from "react";
import "./Switch.css";
import PropTypes from "prop-types"; // Import PropTypes

const Switch = ({ onToggle }) => {
  const [isChecked, setIsChecked] = useState(false);

  const handleToggle = () => {
    setIsChecked(!isChecked);
    onToggle(!isChecked); // Pass the new state to the parent
  };

  return (
    <div className="flex items-center">
      <input
        className="react-switch-checkbox"
        id={`react-switch-new`}
        type="checkbox"
        checked={isChecked}
        onChange={handleToggle}
      />
      <label
        className={`react-switch-label ${isChecked ? "bg-green-500" : "bg-red-500"}`}
        htmlFor={`react-switch-new`}
        aria-label="Toggle switch" // Add accessible text for screen readers
      >
        <span className="react-switch-button" />
      </label>
    </div>
  );
};

// Add PropTypes validation
Switch.propTypes = {
  onToggle: PropTypes.func.isRequired,
};

export default Switch;
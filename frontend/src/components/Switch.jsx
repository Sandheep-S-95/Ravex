import React, { useState } from "react";
import "./Switch.css";

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
      >
        <span className="react-switch-button" />
      </label>
    </div>
  );
};

export default Switch;
import PropTypes from "prop-types"; // Import PropTypes

const SelectButton = ({ children, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`border border-yellow-400 rounded-md py-2 px-5 font-montserrat transition-colors duration-200 w-[22%] ${
        selected
          ? "bg-yellow-400 text-black font-bold"
          : "text-white font-medium hover:bg-yellow-400 hover:text-black"
      }`}
    >
      {children}
    </button>
  );
};

// Add PropTypes validation
SelectButton.propTypes = {
  children: PropTypes.node.isRequired, // Renderable content, required
  selected: PropTypes.bool.isRequired, // Boolean, required
  onClick: PropTypes.func.isRequired,  // Function, required
};

export default SelectButton;
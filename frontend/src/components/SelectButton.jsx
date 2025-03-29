const SelectButton = ({ children, selected, onClick }) => {
    return (
      <span
        onClick={onClick}
        className={`border border-yellow-400 rounded-md py-2 px-5 font-montserrat cursor-pointer transition-colors duration-200 w-[22%] ${
          selected
            ? "bg-yellow-400 text-black font-bold"
            : "text-white font-medium hover:bg-yellow-400 hover:text-black"
        }`}
      >
        {children}
      </span>
    );
  };
  
  export default SelectButton;
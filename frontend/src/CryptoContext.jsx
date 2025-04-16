import React, { createContext, useContext, useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types"; // Import PropTypes

const Crypto = createContext();

const CryptoContext = ({ children }) => {
  const [currency, setCurrency] = useState("INR");
  const [symbol, setSymbol] = useState("₹");

  useEffect(() => {
    if (currency === "INR") setSymbol("₹");
    else if (currency === "USD") setSymbol("$");
  }, [currency]);

  // Memoize the value object to prevent unnecessary re-renders
  const value = useMemo(() => ({ currency, setCurrency, symbol }), [currency, symbol]);

  return (
    <Crypto.Provider value={value}>
      {children}
    </Crypto.Provider>
  );
};

// Add PropTypes validation
CryptoContext.propTypes = {
  children: PropTypes.node.isRequired, // 'node' allows any renderable content, 'isRequired' ensures it's provided
};

export default CryptoContext;

export const CryptoState = () => {
  return useContext(Crypto);
};
// src/components/auth_components/AuthCard.jsx
import { motion } from "framer-motion";
import PropTypes from "prop-types"; // Import PropTypes

const AuthCard = ({ title, children }) => (
  <motion.div
    className="max-w-md w-full p-8 bg-black/30 backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700/30 relative z-10"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <motion.h2
      className="text-center text-2xl font-semibold mb-8 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2, duration: 0.5 }}
    >
      <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-emerald-500 to-blue-400">
        {title}
      </span>
    </motion.h2>
    {children}
  </motion.div>
);

// Add PropTypes validation
AuthCard.propTypes = {
  title: PropTypes.string.isRequired, // Validate title as a required string
  children: PropTypes.node.isRequired, // Validate children as required renderable content
};

export default AuthCard;
import { motion } from "framer-motion";
import PropTypes from "prop-types";

const Star = ({ delay, duration, top, width }) => {
  return (
    <motion.div
      className="absolute h-0.5 bg-gradient-to-r from-green-400 to-transparent rounded-full opacity-70"
      style={{
        top: `${top}vh`, // Math.random() for top is safe here (visual effect, non-security-critical)
        width: `${width}em`,
        filter: "drop-shadow(0 0 2px #4ade80)",
      }}
      initial={{ x: "100vw" }}
      animate={{ x: "-30vw" }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear",
      }}
    >
      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-green-400 to-transparent rounded-full rotate-45"
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
      <motion.div
        className="absolute top-0 left-0 w-1 h-full bg-gradient-to-r from-green-400 to-transparent rounded-full -rotate-45"
        animate={{ opacity: [1, 0.6, 1] }}
        transition={{ duration: 2, repeat: Infinity }}
      />
    </motion.div>
  );
};

Star.propTypes = {
  delay: PropTypes.number.isRequired,
  duration: PropTypes.number.isRequired,
  top: PropTypes.number,
  width: PropTypes.number,
};

Star.defaultProps = {
  // sonar-disable-next-line javascript:S1528
  top: Math.random() * 90, // Random position in 0-90vh for safety
  width: 2, // Default width
};

export default Star;
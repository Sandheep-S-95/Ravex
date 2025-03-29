// src/ResetPassword.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/auth_components/InputField";

// Create a Star component with Framer Motion
const Star = ({ delay, duration, top, width }) => {
  return (
    <motion.div
      className="absolute h-0.5 bg-gradient-to-r from-green-400 to-transparent rounded-full opacity-70"
      style={{ 
        top: `${top}vh`,
        width: `${width}em`,
        filter: "drop-shadow(0 0 2px #4ade80)"
      }}
      initial={{ x: "100vw" }}
      animate={{ 
        x: "-30vw",
      }}
      transition={{
        duration: duration,
        delay: delay,
        repeat: Infinity,
        repeatType: "loop",
        ease: "linear"
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

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);

  // Generate stars on component mount
  useEffect(() => {
    const generateStars = () => {
      const newStars = [];
      for (let i = 0; i < 50; i++) {
        newStars.push({
          id: i,
          top: Math.random() * 100,
          delay: Math.random() * 10,
          duration: Math.random() * 6 + 6,
          width: Math.random() * 7.5 + 5
        });
      }
      setStars(newStars);
    };

    generateStars();
  }, []);

  const handleResetRequest = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await axios.post(
        "http://localhost:8001/auth/reset-password",
        { email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.detail || "Failed to send reset email. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] p-4 overflow-hidden relative">
      {/* Stars container */}
      <div className="fixed top-0 left-0 w-full h-screen -rotate-45 overflow-hidden pointer-events-none">
        {stars.map((star) => (
          <Star 
            key={star.id} 
            top={star.top} 
            delay={star.delay} 
            duration={star.duration} 
            width={star.width}
          />
        ))}
      </div>

      {/* Reset Password Card */}
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
            Reset Your Password
          </span>
        </motion.h2>

        {error && (
          <motion.div 
            className="bg-red-500/20 text-red-400 p-3 mb-6 rounded-lg border border-red-500/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            {error}
          </motion.div>
        )}

        {success ? (
          <motion.div 
            className="bg-green-500/20 text-green-400 p-3 mb-6 rounded-lg border border-green-500/50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.4 }}
          >
            Password reset email sent. Check your inbox.
          </motion.div>
        ) : (
          <motion.form 
            onSubmit={handleResetRequest} 
            className="space-y-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.4 }}
            >
              <label className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <InputField
                type="email"
                placeholder="Enter your email"
                icon="mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-gray-900/60 text-white border-gray-700"
              />
            </motion.div>

            <motion.button
              type="submit"
              className="w-full py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-emerald-500/20 transition duration-300 disabled:opacity-50"
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.98 }}
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.4 }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <motion.div 
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                  />
                  <span className="ml-2">Sending...</span>
                </div>
              ) : (
                "Send Reset Email"
              )}
            </motion.button>
          </motion.form>
        )}

        <motion.p 
          className="mt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7, duration: 0.5 }}
        >
          Back to{" "}
          <Link
            to="/login"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
          >
            Log in
          </Link>
        </motion.p>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
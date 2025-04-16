// src/pages/auth_pages/ResetPassword.jsx
import { useState } from "react"; // Removed useEffect since StarBackground handles it
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/auth_components/InputField";
import StarBackground from "../../components/auth_components/StarBackground";
import AuthCard from "../../components/auth_components/AuthCard";

const ResetPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

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
      <StarBackground />
      <AuthCard title="Reset Your Password">
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
              <label htmlFor="reset-email" className="block text-sm font-medium text-gray-300 mb-1">
                Email Address
              </label>
              <InputField
                id="reset-email"
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
      </AuthCard>
    </div>
  );
};

export default ResetPassword;
// src/pages/auth_pages/SignUp.jsx
import { useState } from "react"; // Removed useEffect since StarBackground handles it
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/auth_components/InputField";
import StarBackground from "../../components/auth_components/StarBackground";
import AuthCard from "../../components/auth_components/AuthCard"; // Assuming you created this as suggested

const SignUp = () => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await axios.post(
        "http://localhost:8001/auth/signup",
        { firstName, lastName, email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      // Handle successful sign-up (e.g., redirect)
    } catch (err) {
      setError(err.response?.data?.detail || "Sign up failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] p-4 overflow-hidden relative">
      <StarBackground /> {/* Reuses star animation logic */}
      <AuthCard title="Create Your Account">
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
        <motion.form
          onSubmit={handleSignUp}
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
            <label htmlFor="signup-firstname" className="block text-sm font-medium text-gray-300 mb-1">
              First Name
            </label>
            <InputField
              id="signup-firstname"
              type="text"
              placeholder="Enter your first name"
              icon="user"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <label htmlFor="signup-lastname" className="block text-sm font-medium text-gray-300 mb-1">
              Last Name
            </label>
            <InputField
              id="signup-lastname"
              type="text"
              placeholder="Enter your last name"
              icon="user"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <label htmlFor="signup-email" className="block text-sm font-medium text-gray-300 mb-1">
              Email Address
            </label>
            <InputField
              id="signup-email"
              type="email"
              placeholder="Enter your email"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <label htmlFor="signup-password" className="block text-sm font-medium text-gray-300 mb-1">
              Password
            </label>
            <InputField
              id="signup-password"
              type="password"
              placeholder="Enter your password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            {loading ? (
              <div className="flex items-center justify-center">
                <motion.div
                  className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                />
                <span className="ml-2">Signing Up...</span>
              </div>
            ) : (
              "Sign Up"
            )}
          </motion.button>
        </motion.form>
        <motion.p
          className="mt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.5 }}
        >
          Already have an account?{" "}
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

export default SignUp;
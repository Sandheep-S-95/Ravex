// src/pages/auth_pages/Login.jsx
import { useState } from "react"; // Removed useEffect since StarBackground handles it
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import InputField from "../../components/auth_components/InputField";
import SocialLogin from "../../components/auth_components/SocialLogin";
import StarBackground from "../../components/auth_components/StarBackground";
import AuthCard from "../../components/auth_components/AuthCard";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await axios.post(
        "http://localhost:8001/auth/login",
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );

      if (!response.data || response.status !== 200) {
        const errorData = response.data || { detail: "Login failed" };
        console.error("Login failed:", errorData.detail);
        setError(errorData.detail);
        setLoading(false);
        return;
      }

      const data = response.data; // Axios automatically parses JSON
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      await fetchUser();
      console.log("Login successful, navigating to transactions page");
      navigate("/"); // Redirect to transactions page
    } catch (error) {
      console.error("An error occurred:", error.response?.data?.detail || error.message);
      setError(error.response?.data?.detail || "An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-[#0d1d31] to-[#0c0d13] p-4 overflow-hidden relative">
      <StarBackground />
      <AuthCard title="Login to RAVEX">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <SocialLogin />
        </motion.div>
        <motion.div
          className="relative my-8 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span className="relative z-10 px-4 bg-transparent text-gray-300 font-medium">
            or
          </span>
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-700/50"></div>
          </div>
        </motion.div>
        <motion.form
          className="space-y-6"
          onSubmit={handleSubmit}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          >
            <InputField
              type="email"
              placeholder="Email address"
              icon="mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <InputField
              type="password"
              placeholder="Password"
              icon="lock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>
          {error && (
            <motion.p
              className="text-red-400 text-center text-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {error}
            </motion.p>
          )}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <Link
              to="/reset-password"
              className="block text-emerald-400 hover:text-emerald-300 text-sm transition-colors duration-300"
            >
              Forgot password?
            </Link>
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
                <span className="ml-2">Logging In...</span>
              </div>
            ) : (
              "Log In"
            )}
          </motion.button>
        </motion.form>
        <motion.p
          className="mt-8 text-center text-gray-400"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
        >
          Don't have an account?{" "}
          <Link
            to="/signup"
            className="text-emerald-400 hover:text-emerald-300 font-medium transition-colors duration-300"
          >
            Sign up
          </Link>
        </motion.p>
      </AuthCard>
    </div>
  );
};

export default Login;
// src/pages/auth_pages/Login.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SocialLogin from "../../components/auth_components/SocialLogin";
import InputField from "../../components/auth_components/InputField";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const navigate = useNavigate();
  const { fetchUser } = useAuth();

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:8001/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Login failed:", errorData.detail);
        setError(errorData.detail);
        setLoading(false);
        return;
      }

      const data = await response.json();
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);

      await fetchUser();
      console.log("Login successful, navigating to transactions page");
      navigate("/transactions"); // Redirect to transactions page instead of homepage
    } catch (error) {
      console.error("An error occurred:", error);
      setError("An error occurred. Please try again.");
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

      {/* Login Card */}
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
            Login to RAVEX
          </span>
        </motion.h2>

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
      </motion.div>
    </div>
  );
};

export default Login;
// src/Signup.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import SocialLogin from "../../components/auth_components/SocialLogin";
import InputField from "../../components/auth_components/InputField";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

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

const Signup = () => {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stars, setStars] = useState([]);
  const navigate = useNavigate();

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

  const handleChange = (e) => {
    console.log("Input changed:", {
      name: e.target.name,
      value: e.target.value,
      currentFormData: formData,
    });
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    console.log("Form data before validation:", formData);

    if (!formData.first_name || !formData.last_name || !formData.email || !formData.password) {
      setError("All fields are required.");
      console.log("Validation failed. Form data:", formData);
      setLoading(false);
      return;
    }
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setLoading(false);
      return;
    }
    if (formData.password.length < 8) {
      setError("Password must be at least 8 characters long.");
      setLoading(false);
      return;
    }

    console.log("Sending data:", formData);

    try {
      const response = await axios.post("http://localhost:8001/auth/signup", formData, {
        headers: { "Content-Type": "application/json" },
      });
      console.log("Signup successful:", response.data);
      localStorage.setItem("access_token", response.data.access_token);
      localStorage.setItem("refresh_token", response.data.refresh_token);
      navigate("/login");
    } catch (err) {
      const errorDetail = err.response?.data?.detail;
      console.error("Full error response:", err.response);
      if (Array.isArray(errorDetail)) {
        setError(errorDetail.map((e) => `${e.loc.join(".")}: ${e.msg}`).join(", "));
      } else {
        setError(errorDetail || "Signup failed. Please try again.");
      }
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

      {/* Signup Card */}
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
            Sign Up for RAVEX
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
              type="text"
              placeholder="First name"
              icon="person"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.4 }}
          >
            <InputField
              type="text"
              placeholder="Last name"
              icon="person"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          >
            <InputField
              type="email"
              placeholder="Email address"
              icon="mail"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="bg-gray-900/60 text-white border-gray-700"
            />
          </motion.div>

          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.4 }}
          >
            <InputField
              type="password"
              placeholder="Password"
              icon="lock"
              name="password"
              value={formData.password}
              onChange={handleChange}
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

          <motion.button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white font-medium rounded-full hover:shadow-lg hover:shadow-emerald-500/20 transition duration-300 disabled:opacity-50"
            disabled={loading}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 1, duration: 0.4 }}
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
          transition={{ delay: 1.1, duration: 0.5 }}
        >
          Already have an account?{" "}
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

export default Signup;
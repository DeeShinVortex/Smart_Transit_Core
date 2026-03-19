import React, { useState } from "react";
import { FaBus, FaMapMarkerAlt, FaClock, FaBell } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import useAuthStore from "../hooks/useAuth";

const features = [
  { icon: FaMapMarkerAlt, text: "Real-time tracking", color: "text-ios-blue", bg: "bg-ios-blue/10" },
  { icon: FaClock, text: "Live ETA updates", color: "text-ios-green", bg: "bg-ios-green/10" },
  { icon: FaBell, text: "Smart transit alerts", color: "text-ios-orange", bg: "bg-ios-orange/10" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.2 },
  },
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login, register, loading, error, clearError } = useAuthStore();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      await login(username, password);
    } else {
      await register(username, email, password);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    clearError();
  };

  return (
    <div className="min-h-screen bg-[#F2F2F7] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Decorative background blur elements */}
      <div className="absolute top-[-10%] left-[-10%] w-64 h-64 bg-ios-blue/20 rounded-full blur-[80px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-64 h-64 bg-ios-green/20 rounded-full blur-[80px]" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-sm z-10 flex flex-col items-center"
      >
        {/* Logo */}
        <motion.div variants={itemVariants} className="mb-8 flex flex-col items-center">
          <motion.div 
            whileHover={{ scale: 1.05, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            className="w-20 h-20 bg-white rounded-[2rem] shadow-ios flex items-center justify-center mb-4 border border-white/60"
          >
            <FaBus size={32} className="text-ios-blue drop-shadow-sm" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">OmniRoute</h1>
          <p className="text-ios-gray font-medium text-sm mt-1 tracking-wide uppercase">Vadodara Transit</p>
        </motion.div>

        {/* Features */}
        <motion.div variants={itemVariants} className="flex items-start justify-center gap-4 mb-8 w-full">
          {features.map(({ icon: Icon, text, color, bg }) => (
            <div key={text} className="flex flex-col items-center gap-2 flex-1">
              <div className={`w-12 h-12 ${bg} rounded-2xl flex items-center justify-center shadow-sm`}>
                <Icon size={20} className={color} />
              </div>
              <span className="text-[10px] text-ios-gray font-semibold text-center leading-tight">
                {text}
              </span>
            </div>
          ))}
        </motion.div>

        {/* Form card */}
        <motion.div 
          variants={itemVariants}
          className="bg-white/70 backdrop-blur-ios border border-white/80 rounded-[2rem] p-6 w-full shadow-ios"
        >
          <div className="mb-6 text-center">
            <h2 className="text-gray-900 font-bold text-xl tracking-tight">
              {isLogin ? "Welcome Back" : "Create Account"}
            </h2>
            <p className="text-ios-gray text-xs mt-1 font-medium">
              {isLogin ? "Sign in to track your ride" : "Get started with OmniRoute"}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="w-full bg-white/50 border border-ios-gray5 text-gray-900 placeholder-ios-gray2 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue/50 transition-all font-medium shadow-sm"
              />
            </div>

            <AnimatePresence mode="popLayout">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ opacity: { duration: 0.2 } }}
                >
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-white/50 border border-ios-gray5 text-gray-900 placeholder-ios-gray2 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue/50 transition-all font-medium shadow-sm"
                  />
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full bg-white/50 border border-ios-gray5 text-gray-900 placeholder-ios-gray2 rounded-2xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-ios-blue/50 focus:border-ios-blue/50 transition-all font-medium shadow-sm"
              />
            </div>

            <AnimatePresence>
              {error && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="bg-ios-red/10 border border-ios-red/20 text-ios-red font-medium text-xs rounded-xl p-3 text-center"
                >
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-ios-blue text-white py-3.5 rounded-2xl font-bold text-sm tracking-wide disabled:opacity-50 transition-all shadow-md shadow-ios-blue/30 mt-2"
            >
              {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
            </motion.button>
          </form>

          <p className="text-center text-xs text-ios-gray font-medium mt-6">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button 
              onClick={toggleMode} 
              className="text-ios-blue font-bold px-2 py-1 rounded-lg hover:bg-ios-blue/10 transition-colors"
            >
              {isLogin ? "Sign Up" : "Sign In"}
            </button>
          </p>
        </motion.div>

        <motion.p variants={itemVariants} className="text-[11px] text-ios-gray font-medium mt-8 bg-black/5 px-3 py-1.5 rounded-full border border-black/5 backdrop-blur-sm">
          Demo: <strong className="text-gray-700">demo</strong> / <strong className="text-gray-700">demo123</strong>
        </motion.p>
      </motion.div>
    </div>
  );
}

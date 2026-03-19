import React, { useState } from "react";
import { FaBus, FaMapMarkerAlt, FaClock, FaBell } from "react-icons/fa";
import useAuthStore from "../hooks/useAuth";

const features = [
  { icon: FaMapMarkerAlt, text: "Real-time bus tracking", color: "text-blue-400" },
  { icon: FaClock, text: "Live ETA to your stop", color: "text-emerald-400" },
  { icon: FaBell, text: "Smart alerts & notifications", color: "text-amber-400" },
];

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
    <div className="min-h-screen bg-gradient-to-b from-[#0F1B33] to-[#1B2A4A] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-6 flex flex-col items-center">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-3 shadow-lg">
          <FaBus size={26} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">OmniRoute</h1>
        <p className="text-gray-400 text-sm mt-1">Vadodara Transit Tracker</p>
      </div>

      {/* Features */}
      <div className="flex items-center gap-4 mb-6">
        {features.map(({ icon: Icon, text, color }) => (
          <div key={text} className="flex flex-col items-center gap-1.5">
            <div className="w-10 h-10 bg-white bg-opacity-5 rounded-xl flex items-center justify-center">
              <Icon size={16} className={color} />
            </div>
            <span className="text-[10px] text-gray-400 text-center leading-tight max-w-[70px]">
              {text}
            </span>
          </div>
        ))}
      </div>

      {/* Form card */}
      <div className="bg-white bg-opacity-5 backdrop-blur-sm border border-white border-opacity-10 rounded-2xl p-6 w-full max-w-sm">
        <h2 className="text-white font-semibold text-lg mb-4 text-center">
          {isLogin ? "Welcome back" : "Create account"}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-3">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            className="w-full bg-white bg-opacity-5 border border-white border-opacity-10 text-white placeholder-gray-500 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          />

          {error && (
            <div className="bg-red-500 bg-opacity-10 border border-red-500 border-opacity-20 text-red-300 text-xs rounded-xl p-3" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-xl font-semibold text-sm hover:from-blue-600 hover:to-blue-700 disabled:opacity-50 transition-all shadow-lg"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleMode} className="text-blue-400 font-semibold hover:text-blue-300 transition-colors">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>

      <p className="text-[10px] text-gray-600 mt-6">
        Demo: username <span className="text-gray-400">demo</span> / password <span className="text-gray-400">demo123</span>
      </p>
    </div>
  );
}

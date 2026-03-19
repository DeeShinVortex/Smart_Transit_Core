import React, { useState } from "react";
import { FaBus } from "react-icons/fa";
import useAuthStore from "../hooks/useAuth";

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
    <div className="min-h-screen bg-[#1B2A4A] flex flex-col items-center justify-center p-6">
      {/* Logo */}
      <div className="mb-8 flex flex-col items-center">
        <div className="w-16 h-16 bg-blue-500 rounded-2xl flex items-center justify-center mb-3">
          <FaBus size={28} className="text-white" />
        </div>
        <h1 className="text-2xl font-bold text-white">Transit Tracker</h1>
        <p className="text-gray-400 text-sm mt-1">Track your bus in real time</p>
      </div>

      {/* Form card */}
      <div className="bg-white/10 backdrop-blur rounded-2xl p-6 w-full max-w-sm">
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
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {!isLogin && (
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          )}

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={8}
            className="w-full bg-white/10 border border-white/20 text-white placeholder-gray-400 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          {error && (
            <div className="bg-red-500/20 text-red-300 text-xs rounded-xl p-3" role="alert">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-500 text-white py-3 rounded-xl font-semibold text-sm hover:bg-blue-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "Please wait..." : isLogin ? "Sign In" : "Create Account"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-4">
          {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
          <button onClick={toggleMode} className="text-blue-400 font-semibold">
            {isLogin ? "Sign up" : "Sign in"}
          </button>
        </p>
      </div>
    </div>
  );
}

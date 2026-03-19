import React from "react";
import { IoChevronForward, IoLogOutOutline } from "react-icons/io5";
import { FaUserCircle, FaRoute, FaStar, FaBell, FaShieldAlt } from "react-icons/fa";
import useAuthStore from "../hooks/useAuth";

const menuItems = [
  { icon: FaRoute, label: "My Routes", color: "text-blue-500" },
  { icon: FaStar, label: "Favorites", color: "text-yellow-500" },
  { icon: FaBell, label: "Notifications", color: "text-emerald-500" },
  { icon: FaShieldAlt, label: "Privacy & Security", color: "text-purple-500" },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();

  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-5 text-center">Profile</h1>

      {/* Avatar + name */}
      <div className="flex flex-col items-center mb-6">
        <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mb-3">
          <FaUserCircle size={64} className="text-gray-400" />
        </div>
        <p className="font-bold text-gray-800 text-lg">{user?.username || "User"}</p>
        <p className="text-gray-400 text-sm">{user?.email || ""}</p>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {menuItems.map(({ icon: Icon, label, color }, i) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 ${
              i < menuItems.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <Icon size={18} className={color} />
            <span className="flex-1 text-sm font-medium text-gray-700">{label}</span>
            <IoChevronForward size={16} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-white rounded-2xl shadow-sm flex items-center gap-3 px-4 py-3.5 hover:bg-red-50"
      >
        <IoLogOutOutline size={18} className="text-red-500" />
        <span className="text-sm font-medium text-red-500">Sign Out</span>
      </button>
    </div>
  );
}

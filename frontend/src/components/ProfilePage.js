import React from "react";
import {
  IoChevronForward,
  IoLogOutOutline,
  IoMoonOutline,
  IoHelpCircleOutline,
} from "react-icons/io5";
import { FaRoute, FaStar, FaBell, FaShieldAlt, FaBus } from "react-icons/fa";
import useAuthStore from "../hooks/useAuth";
import useTrackingStore from "../store";

const menuItems = [
  { icon: FaRoute, label: "My Routes", color: "text-blue-500", bg: "bg-blue-50" },
  { icon: FaStar, label: "Favorites", color: "text-amber-500", bg: "bg-amber-50" },
  { icon: FaBell, label: "Notifications", color: "text-emerald-500", bg: "bg-emerald-50" },
  { icon: FaShieldAlt, label: "Privacy", color: "text-purple-500", bg: "bg-purple-50" },
  { icon: IoMoonOutline, label: "Dark Mode", color: "text-indigo-500", bg: "bg-indigo-50" },
  { icon: IoHelpCircleOutline, label: "Help & Support", color: "text-gray-500", bg: "bg-gray-100" },
];

export default function ProfilePage() {
  const { user, logout } = useAuthStore();
  const routes = useTrackingStore((s) => s.routes) || [];
  const buses = useTrackingStore((s) => s.buses);

  const initial = (user?.username || "U").charAt(0).toUpperCase();

  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      {/* Profile header */}
      <div className="bg-[#1B2A4A] rounded-2xl p-6 mb-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center">
            <span className="text-2xl font-bold text-blue-300">{initial}</span>
          </div>
          <div>
            <p className="font-bold text-white text-lg">
              {user?.username || "User"}
            </p>
            <p className="text-gray-400 text-sm">{user?.email || ""}</p>
            <span className="inline-block mt-1 px-2.5 py-0.5 bg-blue-500 bg-opacity-20 text-blue-300 text-[10px] font-semibold rounded-full uppercase">
              {user?.role || "rider"}
            </span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center justify-around mt-5 pt-4 border-t border-white border-opacity-10">
          <div className="text-center">
            <p className="text-white font-bold text-lg">{routes.length}</p>
            <p className="text-gray-400 text-[10px] uppercase tracking-wide">Routes</p>
          </div>
          <div className="w-px h-8 bg-white bg-opacity-10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              {Object.keys(buses).length}
            </p>
            <p className="text-gray-400 text-[10px] uppercase tracking-wide">Live Buses</p>
          </div>
          <div className="w-px h-8 bg-white bg-opacity-10" />
          <div className="text-center">
            <p className="text-white font-bold text-lg">
              {user?.favorite_routes?.length || 0}
            </p>
            <p className="text-gray-400 text-[10px] uppercase tracking-wide">Favorites</p>
          </div>
        </div>
      </div>

      {/* Menu */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden mb-4">
        {menuItems.map(({ icon: Icon, label, color, bg }, i) => (
          <button
            key={label}
            className={`w-full flex items-center gap-3 px-4 py-3.5 text-left hover:bg-gray-50 transition-colors ${
              i < menuItems.length - 1 ? "border-b border-gray-50" : ""
            }`}
          >
            <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center`}>
              <Icon size={14} className={color} />
            </div>
            <span className="flex-1 text-sm font-medium text-gray-700">
              {label}
            </span>
            <IoChevronForward size={14} className="text-gray-300" />
          </button>
        ))}
      </div>

      {/* Logout */}
      <button
        onClick={logout}
        className="w-full bg-white rounded-2xl shadow-sm flex items-center gap-3 px-4 py-3.5 hover:bg-red-50 transition-colors"
      >
        <div className="w-8 h-8 bg-red-50 rounded-lg flex items-center justify-center">
          <IoLogOutOutline size={14} className="text-red-500" />
        </div>
        <span className="text-sm font-medium text-red-500">Sign Out</span>
      </button>

      <p className="text-center text-[10px] text-gray-300 mt-4">
        OmniRoute v1.0 · Vadodara Transit
      </p>
    </div>
  );
}

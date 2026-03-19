import React from "react";
import { FaBus, FaRoute } from "react-icons/fa";
import { IoTimeOutline, IoChatbubbleEllipsesOutline, IoPersonOutline } from "react-icons/io5";

const tabs = [
  { id: "mybus", label: "Live Map", icon: FaBus },
  { id: "routes", label: "Routes", icon: FaRoute },
  { id: "history", label: "History", icon: IoTimeOutline },
  { id: "messages", label: "Alerts", icon: IoChatbubbleEllipsesOutline },
  { id: "profile", label: "Profile", icon: IoPersonOutline },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white bg-opacity-95 backdrop-blur-lg border-t border-gray-200 safe-bottom">
      <div className="flex items-center justify-around py-1.5 px-1">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 ${
                active
                  ? "text-blue-600 bg-blue-50"
                  : "text-gray-400 hover:text-gray-600"
              }`}
              aria-label={label}
            >
              <Icon size={20} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

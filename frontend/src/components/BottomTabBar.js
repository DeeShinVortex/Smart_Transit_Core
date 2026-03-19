import React from "react";
import { FaBus } from "react-icons/fa";
import { IoTimeOutline, IoChatbubbleEllipsesOutline, IoPersonOutline } from "react-icons/io5";

const tabs = [
  { id: "mybus", label: "My Bus", icon: FaBus },
  { id: "history", label: "History", icon: IoTimeOutline },
  { id: "messages", label: "Messages", icon: IoChatbubbleEllipsesOutline },
  { id: "profile", label: "Profile", icon: IoPersonOutline },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <div className="absolute bottom-0 left-0 right-0 z-20 bg-white border-t border-gray-100 safe-bottom">
      <div className="flex items-center justify-around py-2 px-2">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <button
              key={id}
              onClick={() => onTabChange(id)}
              className={`flex flex-col items-center gap-0.5 px-4 py-1.5 rounded-xl transition-colors ${
                active ? "text-blue-600" : "text-gray-400"
              }`}
              aria-label={label}
            >
              <Icon size={22} />
              <span className="text-[10px] font-semibold">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

import React from "react";
import { FaBus, FaRoute } from "react-icons/fa";
import { IoTimeOutline, IoChatbubbleEllipsesOutline, IoPersonOutline } from "react-icons/io5";
import { motion } from "framer-motion";

const tabs = [
  { id: "mybus", label: "Live Map", icon: FaBus },
  { id: "routes", label: "Routes", icon: FaRoute },
  { id: "history", label: "History", icon: IoTimeOutline },
  { id: "messages", label: "Alerts", icon: IoChatbubbleEllipsesOutline },
  { id: "profile", label: "Profile", icon: IoPersonOutline },
];

export default function BottomTabBar({ activeTab, onTabChange }) {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute bottom-4 left-4 right-4 z-20 bg-white/80 backdrop-blur-ios rounded-3xl shadow-ios border border-white/50 safe-bottom"
    >
      <div className="flex items-center justify-around py-2 px-2 relative">
        {tabs.map(({ id, label, icon: Icon }) => {
          const active = activeTab === id;
          return (
            <motion.button
              whileTap={{ scale: 0.9 }}
              key={id}
              onClick={() => onTabChange(id)}
              className={`relative flex flex-col items-center gap-1 px-3 py-2 rounded-2xl transition-colors duration-300 ${
                active
                  ? "text-ios-blue"
                  : "text-ios-gray hover:text-black"
              }`}
              aria-label={label}
            >
              {active && (
                <motion.div
                  layoutId="activeTabBadge"
                  className="absolute inset-0 bg-ios-blue/10 rounded-2xl z-0"
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              )}
              <Icon size={22} className={`z-10 ${active ? "drop-shadow-sm" : ""}`} />
              <span className="text-[10px] font-semibold tracking-wide z-10">{label}</span>
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
}

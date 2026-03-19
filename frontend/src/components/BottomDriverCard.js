import React from "react";
import { IoCallOutline, IoChatbubbleOutline } from "react-icons/io5";
import { FaUserCircle } from "react-icons/fa";
import useTrackingStore from "../store";

const DRIVERS = {
  "BUS-42": { name: "Todd Cooper", color: "bg-blue-500" },
  "BUS-77": { name: "Maria Santos", color: "bg-purple-500" },
  "BUS-13": { name: "James Wilson", color: "bg-emerald-500" },
};

export default function BottomDriverCard() {
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const buses = useTrackingStore((s) => s.buses);
  const activeBus = selectedBusId
    ? buses[selectedBusId]
    : Object.values(buses)[0];

  if (!activeBus) return null;

  const driver = DRIVERS[activeBus.vehicle_id] || { name: "Driver", color: "bg-gray-500" };

  return (
    <div className="absolute bottom-20 left-0 right-0 z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-full ${driver.color} flex items-center justify-center`}>
              <FaUserCircle size={28} className="text-white/80" />
            </div>
            <div>
              <p className="text-gray-400 text-xs">Bus Driver</p>
              <p className="text-gray-900 font-bold text-base">{driver.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="w-11 h-11 bg-[#1B2A4A] rounded-full flex items-center justify-center active:scale-95 transition-transform" aria-label="Call driver">
              <IoCallOutline size={18} className="text-white" />
            </button>
            <button className="w-11 h-11 bg-[#1B2A4A] rounded-full flex items-center justify-center active:scale-95 transition-transform" aria-label="Message driver">
              <IoChatbubbleOutline size={18} className="text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

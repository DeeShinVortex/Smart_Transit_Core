import React, { useEffect, useState } from "react";
import { IoSettingsOutline, IoNotificationsOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import useTrackingStore from "../store";
import { fetchBusETA } from "../services/api";

function ProgressBar({ progress }) {
  return (
    <div className="w-full h-2 bg-white/20 rounded-full overflow-hidden mt-2">
      <div
        className="h-full bg-emerald-400 rounded-full transition-all duration-500"
        style={{ width: `${Math.min(100, Math.max(5, progress))}%` }}
      />
    </div>
  );
}

export default function TopStatusCard() {
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const buses = useTrackingStore((s) => s.buses);
  const [eta, setEta] = useState(null);

  // Live bus: either selected or first available
  const activeBus = selectedBusId
    ? buses[selectedBusId]
    : Object.values(buses)[0];

  const activeId = activeBus?.vehicle_id;

  useEffect(() => {
    if (!activeId) return;
    setEta(null);
    fetchBusETA(activeId).then(setEta).catch(() => setEta(null));

    const interval = setInterval(() => {
      fetchBusETA(activeId).then(setEta).catch(() => {});
    }, 10000);
    return () => clearInterval(interval);
  }, [activeId]);

  const etaMin = eta?.next_stop?.eta_minutes || "--";
  const progress = eta?.next_stop
    ? Math.max(10, 100 - eta.next_stop.eta_minutes * 10)
    : 50;

  const occupancyLabel = { empty: "Available", half: "Onboard", crowded: "Full" };
  const occupancyColor = { empty: "bg-emerald-500", half: "bg-orange-500", crowded: "bg-red-500" };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 safe-top">
      <div className="flex items-center justify-between mb-3">
        <button className="w-10 h-10 bg-gray-200/80 backdrop-blur-sm rounded-xl flex items-center justify-center" aria-label="Settings">
          <IoSettingsOutline size={20} className="text-gray-700" />
        </button>
        <h1 className="text-lg font-bold text-gray-800">My Bus</h1>
        <button className="w-10 h-10 bg-gray-200/80 backdrop-blur-sm rounded-xl flex items-center justify-center" aria-label="Notifications">
          <IoNotificationsOutline size={20} className="text-gray-700" />
        </button>
      </div>

      {activeBus ? (
        <div className="bg-[#1B2A4A] rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-400 flex items-center justify-center">
                <FaBus size={22} className="text-white" />
              </div>
              <div>
                <p className="text-white font-semibold text-base">
                  {activeBus.vehicle_id}
                </p>
                <p className="text-gray-400 text-sm">
                  {eta?.next_stop?.stop_name || "En route"}
                </p>
              </div>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${occupancyColor[activeBus.occupancy] || "bg-emerald-500"}`}>
              {occupancyLabel[activeBus.occupancy] || "Active"}
            </span>
          </div>

          <ProgressBar progress={progress} />

          <div className="flex items-center justify-between mt-3">
            <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
              {etaMin} min
            </span>
            <div className="flex items-center gap-4 text-gray-400 text-xs">
              <span className="flex items-center gap-1">
                <FaBus size={11} />
                Bus #{activeBus.vehicle_id.replace(/\D/g, "") || "—"}
              </span>
              <span>
                {Math.round(activeBus.speed || 0)} km/h
              </span>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-[#1B2A4A] rounded-2xl p-4 shadow-xl">
          <p className="text-gray-400 text-center text-sm">
            No active bus — tap one on the map
          </p>
        </div>
      )}
    </div>
  );
}

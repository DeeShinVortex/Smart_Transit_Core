import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import { motion } from "framer-motion";
import useTrackingStore from "../store";
import { fetchBusETA } from "../services/api";

function ProgressDots({ progress }) {
  const total = 8;
  const filled = Math.max(1, Math.round((progress / 100) * total));
  return (
    <div className="flex items-center gap-1 mt-2">
      {Array.from({ length: total }).map((_, i) => (
        <div
          key={i}
          className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${
            i < filled ? "bg-ios-green" : "bg-ios-gray5"
          }`}
        />
      ))}
    </div>
  );
}

export default function TopStatusCard() {
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const buses = useTrackingStore((s) => s.buses);
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const routes = useTrackingStore((s) => s.routes) || [];
  const [eta, setEta] = useState(null);

  const activeBus = selectedBusId
    ? buses[selectedBusId]
    : Object.values(buses)[0];

  const activeId = activeBus?.vehicle_id;
  const detail = busDetails.find((b) => b.bus_id === activeId);
  const routeInfo = detail?.current_trip
    ? routes.find((r) => r.id === detail.current_trip.route)
    : null;

  useEffect(() => {
    if (!activeId) return;
    setEta(null);
    fetchBusETA(activeId).then(setEta).catch(() => setEta(null));
    const interval = setInterval(() => {
      fetchBusETA(activeId).then(setEta).catch(() => {});
    }, 8000);
    return () => clearInterval(interval);
  }, [activeId]);

  const etaMin = eta?.next_stop?.eta_minutes || "--";
  const progress = eta?.next_stop
    ? Math.max(10, 100 - eta.next_stop.eta_minutes * 10)
    : 50;

  const occupancyLabel = { empty: "Available", half: "Moderate", crowded: "Crowded" };
  const occupancyColor = {
    empty: "bg-ios-green text-white",
    half: "bg-ios-orange text-white",
    crowded: "bg-ios-red text-white",
  };

  return (
    <motion.div 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className="absolute top-0 left-0 right-0 z-10 p-4 safe-top"
    >
      <div className="flex items-center justify-between mb-3 px-1">
        <div className="flex items-center gap-2">
          <img src="/logon.png" alt="OmniRoute" className="w-8 h-8 rounded-xl shadow-glass object-contain" />
          <span className="text-sm font-bold text-gray-900 tracking-tight">OmniRoute</span>
        </div>
        <div className="flex items-center gap-1.5 bg-white/60 backdrop-blur-md px-2.5 py-1 rounded-full shadow-sm border border-white/50">
          <span className="w-2 h-2 rounded-full bg-ios-green animate-pulse" />
          <span className="text-xs text-ios-gray font-semibold">
            {Object.keys(buses).length} live
          </span>
        </div>
      </div>

      {activeBus ? (
        <motion.div 
          layout
          className="bg-white/80 backdrop-blur-ios border border-white/60 rounded-3xl p-5 shadow-ios"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shadow-glass-sm"
                style={{
                  backgroundColor: routeInfo?.color
                    ? routeInfo.color + "20"
                    : "#007AFF20",
                }}
              >
                <FaBus
                  size={20}
                  style={{ color: routeInfo?.color || "#007AFF" }}
                />
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base tracking-tight">
                  {detail?.label || activeBus.vehicle_id}
                  {detail?.plate_number && (
                    <span className="text-ios-gray font-medium text-xs ml-1.5">
                      {detail.plate_number}
                    </span>
                  )}
                </p>
                <p className="text-ios-gray text-xs mt-0.5 font-medium">
                  {routeInfo?.name || "En route"}
                </p>
              </div>
            </div>
            <span
              className={`px-3 py-1.5 rounded-xl text-[10px] uppercase tracking-wider font-bold shadow-sm ${
                occupancyColor[activeBus.occupancy] || "bg-ios-green text-white"
              }`}
            >
              {occupancyLabel[activeBus.occupancy] || "Active"}
            </span>
          </div>

          <div className="mt-4">
            <ProgressDots progress={progress} />
          </div>

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <span className="bg-ios-green/10 text-ios-green text-sm font-bold px-3 py-1 rounded-xl border border-ios-green/20">
                {etaMin} min
              </span>
              {eta?.next_stop?.stop_name && (
                <span className="flex items-center gap-1 text-ios-gray font-medium text-xs bg-ios-gray6 px-2.5 py-1 rounded-lg">
                  <IoLocationSharp size={12} className="text-ios-gray2" />
                  <span className="truncate max-w-[120px]">{eta.next_stop.stop_name}</span>
                </span>
              )}
            </div>
            <span className="text-ios-gray font-semibold text-xs tracking-tight bg-ios-gray6 px-2.5 py-1 rounded-lg">
              {Math.round(activeBus.speed || 0)} km/h
            </span>
          </div>
        </motion.div>
      ) : (
        <div className="bg-white/80 backdrop-blur-ios border border-white/60 rounded-3xl p-5 shadow-ios">
          <p className="text-ios-gray font-medium text-center text-sm py-2">
            Waiting for bus data...
          </p>
        </div>
      )}
    </motion.div>
  );
}

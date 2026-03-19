import React, { useEffect, useState } from "react";
import { IoLocationSharp } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
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
            i < filled ? "bg-emerald-400" : "bg-white bg-opacity-20"
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
    empty: "bg-emerald-500 bg-opacity-90",
    half: "bg-amber-500 bg-opacity-90",
    crowded: "bg-red-500 bg-opacity-90",
  };

  return (
    <div className="absolute top-0 left-0 right-0 z-10 p-4 safe-top">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
            <FaBus size={14} className="text-white" />
          </div>
          <span className="text-sm font-bold text-gray-800">OmniRoute</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs text-gray-500 font-medium">
            {Object.keys(buses).length} buses live
          </span>
        </div>
      </div>

      {activeBus ? (
        <div className="bg-[#1B2A4A] rounded-2xl p-4 shadow-xl">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center"
                style={{
                  backgroundColor: routeInfo?.color
                    ? routeInfo.color + "30"
                    : "#FFD43B30",
                }}
              >
                <FaBus
                  size={18}
                  style={{ color: routeInfo?.color || "#FFD43B" }}
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">
                  {detail?.label || activeBus.vehicle_id}
                  {detail?.plate_number && (
                    <span className="text-gray-400 font-normal text-xs ml-1.5">
                      {detail.plate_number}
                    </span>
                  )}
                </p>
                <p className="text-gray-400 text-xs mt-0.5">
                  {routeInfo?.name || "En route"}
                </p>
              </div>
            </div>
            <span
              className={`px-2.5 py-1 rounded-lg text-[10px] font-bold text-white ${
                occupancyColor[activeBus.occupancy] || "bg-emerald-500 bg-opacity-90"
              }`}
            >
              {occupancyLabel[activeBus.occupancy] || "Active"}
            </span>
          </div>

          <ProgressDots progress={progress} />

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <span className="bg-emerald-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
                {etaMin} min
              </span>
              {eta?.next_stop?.stop_name && (
                <span className="flex items-center gap-1 text-gray-400 text-xs">
                  <IoLocationSharp size={11} />
                  {eta.next_stop.stop_name}
                </span>
              )}
            </div>
            <span className="text-gray-500 text-xs">
              {Math.round(activeBus.speed || 0)} km/h
            </span>
          </div>

          {detail?.driver_name && (
            <div className="mt-3 pt-3 border-t border-white border-opacity-10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-blue-500 bg-opacity-30 flex items-center justify-center">
                  <span className="text-xs text-blue-300 font-bold">
                    {detail.driver_name.charAt(0)}
                  </span>
                </div>
                <div>
                  <p className="text-white text-xs font-medium">
                    {detail.driver_name}
                  </p>
                  <p className="text-gray-500 text-[10px]">Driver</p>
                </div>
              </div>
              <span className="text-gray-500 text-[10px]">
                {detail.capacity} seats
              </span>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-[#1B2A4A] rounded-2xl p-5 shadow-xl">
          <p className="text-gray-400 text-center text-sm">
            Waiting for bus data...
          </p>
        </div>
      )}
    </div>
  );
}

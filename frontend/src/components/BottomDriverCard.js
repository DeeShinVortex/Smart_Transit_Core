import React from "react";
import { IoCallOutline, IoChatbubbleOutline, IoNavigateOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import useTrackingStore from "../store";

export default function BottomDriverCard() {
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const buses = useTrackingStore((s) => s.buses);
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const routes = useTrackingStore((s) => s.routes) || [];

  const activeBus = selectedBusId
    ? buses[selectedBusId]
    : Object.values(buses)[0];

  if (!activeBus) return null;

  const detail = busDetails.find((b) => b.bus_id === activeBus.vehicle_id);
  const routeInfo = detail?.current_trip
    ? routes.find((r) => r.id === detail.current_trip.route)
    : null;

  const driverName = detail?.driver_name || "Driver";
  const driverInitial = driverName.charAt(0);
  const driverPhone = detail?.driver_phone || "";

  // Get next few stops from the trip
  const tripStops = detail?.current_trip?.trip_stops || [];
  const nextStops = tripStops.slice(0, 3);

  return (
    <div className="absolute bottom-16 left-0 right-0 z-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Driver row */}
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className="w-11 h-11 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: routeInfo?.color
                  ? routeInfo.color + "20"
                  : "#3B82F620",
              }}
            >
              <span
                className="text-base font-bold"
                style={{ color: routeInfo?.color || "#3B82F6" }}
              >
                {driverInitial}
              </span>
            </div>
            <div>
              <p className="text-gray-800 font-bold text-sm">{driverName}</p>
              <p className="text-gray-400 text-xs">
                {detail?.label || activeBus.vehicle_id}
                {detail?.plate_number && ` · ${detail.plate_number}`}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {driverPhone && (
              <a
                href={`tel:${driverPhone}`}
                className="w-10 h-10 bg-emerald-50 rounded-full flex items-center justify-center"
                aria-label="Call driver"
              >
                <IoCallOutline size={17} className="text-emerald-600" />
              </a>
            )}
            <button
              className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center"
              aria-label="Navigate"
            >
              <IoNavigateOutline size={17} className="text-blue-600" />
            </button>
          </div>
        </div>

        {/* Upcoming stops */}
        {nextStops.length > 0 && (
          <div className="px-4 pb-3 flex items-center gap-2 overflow-x-auto">
            {nextStops.map((ts, i) => (
              <div
                key={ts.id}
                className="flex items-center gap-1.5 flex-shrink-0"
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{
                    backgroundColor: routeInfo?.color || "#3B82F6",
                    opacity: 1 - i * 0.25,
                  }}
                />
                <span className="text-[11px] text-gray-500 whitespace-nowrap">
                  {ts.stop?.name || `Stop ${ts.sequence}`}
                </span>
                {i < nextStops.length - 1 && (
                  <span className="text-gray-300 text-[10px] mx-0.5">→</span>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import React from "react";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import useTrackingStore from "../store";

export default function HistoryPage() {
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const routes = useTrackingStore((s) => s.routes) || [];
  const buses = useTrackingStore((s) => s.buses);

  // Build trip history from bus details + live data
  const trips = busDetails.map((bus) => {
    const route = routes.find(
      (r) => bus.current_trip && r.id === bus.current_trip.route
    );
    const live = buses[bus.bus_id];
    const stopsCount = bus.current_trip?.trip_stops?.length || 0;
    return {
      id: bus.bus_id,
      label: bus.label,
      plate: bus.plate_number,
      driver: bus.driver_name,
      routeName: route?.name || "Unknown Route",
      routeColor: route?.color || "#3B82F6",
      stops: stopsCount,
      speed: live ? Math.round(live.speed || 0) : null,
      occupancy: live?.occupancy || bus.occupancy,
      isLive: !!live,
    };
  });

  const occLabels = { empty: "Available", half: "Moderate", crowded: "Crowded" };
  const occColors = {
    empty: "bg-emerald-100 text-emerald-700",
    half: "bg-amber-100 text-amber-700",
    crowded: "bg-red-100 text-red-700",
  };

  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">
        Active Trips
      </h1>
      <p className="text-xs text-gray-400 text-center mb-5">
        {trips.filter((t) => t.isLive).length} buses currently running
      </p>

      <div className="space-y-3">
        {trips.map((trip) => (
          <div
            key={trip.id}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex items-start gap-3">
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: trip.routeColor + "20" }}
              >
                <FaBus size={18} style={{ color: trip.routeColor }} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-bold text-gray-800 text-sm">
                    {trip.label}
                  </p>
                  {trip.isLive && (
                    <div className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      <span className="text-[10px] text-emerald-600 font-semibold">
                        LIVE
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-400 mt-0.5">
                  {trip.routeName}
                </p>

                <div className="flex items-center gap-3 mt-2">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FaMapMarkerAlt size={9} className="text-orange-400" />
                    {trip.stops} stops
                  </span>
                  {trip.speed !== null && (
                    <span className="text-xs text-gray-500">
                      {trip.speed} km/h
                    </span>
                  )}
                  <span className="text-xs text-gray-400">
                    {trip.plate}
                  </span>
                </div>

                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-400">
                    {trip.driver}
                  </span>
                  <span
                    className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                      occColors[trip.occupancy] || occColors.empty
                    }`}
                  >
                    {occLabels[trip.occupancy] || trip.occupancy}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

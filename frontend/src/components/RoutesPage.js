import React, { useState } from "react";
import { FaBus, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { IoChevronDown, IoChevronUp } from "react-icons/io5";
import useTrackingStore from "../store";

function RouteCard({ route, busDetails, buses }) {
  const [expanded, setExpanded] = useState(false);

  const routeBuses = busDetails.filter(
    (b) => b.current_trip && b.current_trip.route === route.id
  );

  const activeBusCount = routeBuses.filter((b) =>
    buses[b.bus_id]
  ).length;

  return (
    <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-3 text-left"
      >
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ backgroundColor: route.color + "20" }}
        >
          <FaBus size={20} style={{ color: route.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-800 text-sm">{route.name}</p>
          <p className="text-gray-400 text-xs truncate mt-0.5">
            {route.description}
          </p>
          <div className="flex items-center gap-3 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FaMapMarkerAlt size={10} className="text-orange-400" />
              {(route.stops || []).length} stops
            </span>
            <span className="flex items-center gap-1 text-xs text-gray-500">
              <FaBus size={10} style={{ color: route.color }} />
              {activeBusCount} live
            </span>
          </div>
        </div>
        <div className="flex-shrink-0 text-gray-300">
          {expanded ? <IoChevronUp size={18} /> : <IoChevronDown size={18} />}
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 space-y-3">
          {/* Stops */}
          <div className="bg-gray-50 rounded-xl p-3">
            <p className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wide">
              Stops
            </p>
            <div className="space-y-1.5">
              {(route.stops || []).map((stop, i) => (
                <div key={stop.stop_id} className="flex items-center gap-2">
                  <div className="flex flex-col items-center">
                    <div
                      className="w-2.5 h-2.5 rounded-full border-2"
                      style={{ borderColor: route.color, backgroundColor: i === 0 || i === route.stops.length - 1 ? route.color : "white" }}
                    />
                    {i < route.stops.length - 1 && (
                      <div className="w-0.5 h-4" style={{ backgroundColor: route.color + "40" }} />
                    )}
                  </div>
                  <span className="text-xs text-gray-700">{stop.name}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Buses on this route */}
          {routeBuses.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Buses
              </p>
              {routeBuses.map((bus) => {
                const live = buses[bus.bus_id];
                const occColors = {
                  empty: "bg-emerald-100 text-emerald-700",
                  half: "bg-amber-100 text-amber-700",
                  crowded: "bg-red-100 text-red-700",
                };
                const occLabels = { empty: "Available", half: "Half-full", crowded: "Full" };
                const occ = live?.occupancy || bus.occupancy;
                return (
                  <div
                    key={bus.bus_id}
                    className="flex items-center gap-3 bg-gray-50 rounded-xl p-3"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                      <FaBus size={16} className="text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-gray-800">
                        {bus.label}
                        <span className="text-gray-400 font-normal ml-1.5 text-xs">
                          {bus.plate_number}
                        </span>
                      </p>
                      <p className="text-xs text-gray-400">
                        {bus.driver_name} · {bus.capacity} seats
                      </p>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      {live && (
                        <span className="text-xs text-gray-500">
                          {Math.round(live.speed || 0)} km/h
                        </span>
                      )}
                      <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${occColors[occ] || occColors.empty}`}>
                        {occLabels[occ] || occ}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function RoutesPage() {
  const routes = useTrackingStore((s) => s.routes) || [];
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const buses = useTrackingStore((s) => s.buses);

  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">Routes</h1>
      <p className="text-xs text-gray-400 text-center mb-5">
        {routes.length} routes · {Object.keys(buses).length} buses live
      </p>
      <div className="space-y-3">
        {routes.map((route) => (
          <RouteCard
            key={route.id}
            route={route}
            busDetails={busDetails}
            buses={buses}
          />
        ))}
      </div>
    </div>
  );
}

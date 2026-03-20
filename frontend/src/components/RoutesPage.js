import React, { useState } from "react";
import { FaBus, FaMapMarkerAlt, FaClock } from "react-icons/fa";
import { IoChevronDown, IoChevronUp, IoCompass } from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";
import useTrackingStore from "../store";
import RouteFinder from "./RouteFinder";

const listVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 300, damping: 24 },
  },
};

function RouteCard({ route, busDetails, buses }) {
  const [expanded, setExpanded] = useState(false);

  const routeBuses = busDetails.filter(
    (b) => b.current_trip && b.current_trip.route === route.id
  );

  const activeBusCount = routeBuses.filter((b) =>
    buses[b.bus_id]
  ).length;

  return (
    <motion.div 
      variants={itemVariants}
      layout
      className="bg-white/80 backdrop-blur-ios rounded-[1.5rem] shadow-sm border border-white/60 overflow-hidden"
    >
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full p-4 flex items-center gap-4 text-left focus:outline-none"
      >
        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-glass-sm"
          style={{ backgroundColor: route.color + "15" }}
        >
          <FaBus size={22} style={{ color: route.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base tracking-tight">{route.name}</p>
          <p className="text-ios-gray font-medium text-xs truncate mt-0.5">
            {route.description}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <span className="flex items-center gap-1 text-[11px] font-semibold text-ios-gray bg-ios-gray6 px-2 py-0.5 rounded-md">
              <FaMapMarkerAlt size={10} className="text-ios-orange" />
              {(route.stops || []).length} stops
            </span>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-ios-gray bg-ios-gray6 px-2 py-0.5 rounded-md">
              <FaBus size={10} style={{ color: route.color }} />
              {activeBusCount} live
            </span>
          </div>
        </div>
        <motion.div 
          animate={{ rotate: expanded ? 180 : 0 }} 
          transition={{ type: "spring", stiffness: 200, damping: 20 }}
          className="flex-shrink-0 w-8 h-8 rounded-full bg-ios-gray6 flex items-center justify-center text-ios-gray"
        >
          <IoChevronDown size={18} />
        </motion.div>
      </button>

      <AnimatePresence>
        {expanded && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 space-y-4 pt-2 border-t border-black/5 mx-4">
              {/* Stops */}
              <div className="bg-ios-bg rounded-2xl p-4 shadow-inner border border-black/5">
                <p className="text-[10px] font-bold text-ios-gray mb-3 uppercase tracking-wider">
                  Route Stops
                </p>
                <div className="space-y-2">
                  {(route.stops || []).map((stop, i) => (
                    <div key={stop.stop_id} className="flex items-start gap-3">
                      <div className="flex flex-col items-center mt-1">
                        <div
                          className="w-3 h-3 rounded-full border-[3px] shadow-sm"
                          style={{ borderColor: route.color, backgroundColor: i === 0 || i === route.stops.length - 1 ? route.color : "white" }}
                        />
                        {i < route.stops.length - 1 && (
                          <div className="w-[2px] h-6 rounded-full mt-1" style={{ backgroundColor: route.color + "30" }} />
                        )}
                      </div>
                      <span className="text-sm font-medium text-gray-800 leading-tight">{stop.name}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Buses on this route */}
              {routeBuses.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[10px] font-bold text-ios-gray uppercase tracking-wider mb-2 ml-1">
                    Active Buses
                  </p>
                  {routeBuses.map((bus) => {
                    const live = buses[bus.bus_id];
                    const occColors = {
                      empty: "bg-ios-green/10 text-ios-green",
                      half: "bg-ios-orange/10 text-ios-orange",
                      crowded: "bg-ios-red/10 text-ios-red",
                    };
                    const occLabels = { empty: "Available", half: "Moderate", crowded: "Crowded" };
                    const occ = live?.occupancy || bus.occupancy;
                    return (
                      <div
                        key={bus.bus_id}
                        className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-sm border border-ios-gray6"
                      >
                        <div className="w-10 h-10 rounded-xl bg-ios-blue/10 flex items-center justify-center shadow-inner">
                          <FaBus size={18} className="text-ios-blue" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 tracking-tight">
                            {bus.label}
                            <span className="text-ios-gray font-medium ml-1.5 text-[11px]">
                              {bus.plate_number}
                            </span>
                          </p>
                          <p className="text-[11px] font-medium text-ios-gray mt-0.5">
                            {bus.driver_name} · {bus.capacity} seats
                          </p>
                        </div>
                        <div className="flex flex-col items-end gap-1.5">
                          {live && (
                            <span className="text-[10px] font-semibold text-ios-gray bg-ios-gray6 px-2 py-0.5 rounded-md">
                              {Math.round(live.speed || 0)} km/h
                            </span>
                          )}
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${occColors[occ] || occColors.empty}`}>
                            {occLabels[occ] || occ}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function RoutesPage() {
  const routes = useTrackingStore((s) => s.routes) || [];
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const buses = useTrackingStore((s) => s.buses);
  const [view, setView] = useState("all"); // "all" | "find"

  return (
    <div className="h-full bg-ios-bg pt-10 pb-28 px-4 overflow-y-auto hide-scrollbar">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 300, damping: 24 }}
        className="mb-5 px-2"
      >
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Routes</h1>
        <p className="text-sm font-medium text-ios-gray mt-1">
          {routes.length} active routes · {Object.keys(buses).length} buses live
        </p>

        {/* Toggle */}
        <div className="flex mt-4 bg-white/60 backdrop-blur-ios rounded-2xl p-1 border border-white/50 shadow-sm">
          {[
            { id: "all", label: "All Routes" },
            { id: "find", label: "Find Route" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setView(tab.id)}
              className={`flex-1 py-2 rounded-xl text-xs font-bold tracking-tight transition-all ${
                view === tab.id
                  ? "bg-white text-ios-blue shadow-sm"
                  : "text-ios-gray"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </motion.div>

      <AnimatePresence mode="wait">
        {view === "find" ? (
          <motion.div
            key="find"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
          >
            <RouteFinder />
          </motion.div>
        ) : (
          <motion.div
            key="all"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ type: "spring", stiffness: 300, damping: 26 }}
            variants={listVariants}
            className="space-y-4"
          >
            {routes.map((route) => (
              <RouteCard
                key={route.id}
                route={route}
                busDetails={busDetails}
                buses={buses}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

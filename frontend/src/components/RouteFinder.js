import React, { useEffect, useState } from "react";
import { IoSwapVertical, IoSearch, IoLocationSharp, IoNavigate } from "react-icons/io5";
import { FaBus, FaMapMarkerAlt } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { fetchStopsList, findRoutes } from "../services/api";
import useTrackingStore from "../store";

function StopDropdown({ label, icon: Icon, stops, value, onChange, color }) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const selected = stops.find((s) => s.id === value);
  const filtered = stops.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 bg-white/80 backdrop-blur-ios border border-white/60 rounded-2xl px-4 py-3.5 shadow-sm text-left"
      >
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
          <Icon size={16} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-ios-gray uppercase tracking-wider">{label}</p>
          <p className={`text-sm font-semibold truncate mt-0.5 ${selected ? "text-gray-900" : "text-ios-gray2"}`}>
            {selected ? selected.name : "Select a stop"}
          </p>
        </div>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="absolute left-0 right-0 top-full mt-2 bg-white/95 backdrop-blur-ios rounded-2xl shadow-ios border border-white/60 z-50 max-h-60 overflow-hidden"
          >
            <div className="p-2 border-b border-black/5">
              <div className="flex items-center gap-2 bg-ios-gray6 rounded-xl px-3 py-2">
                <IoSearch size={14} className="text-ios-gray" />
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search stops..."
                  className="bg-transparent text-sm font-medium text-gray-900 placeholder-ios-gray outline-none flex-1"
                  autoFocus
                />
              </div>
            </div>
            <div className="overflow-y-auto max-h-48 p-1">
              {filtered.map((stop) => (
                <button
                  key={stop.id}
                  onClick={() => { onChange(stop.id); setOpen(false); setSearch(""); }}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-colors ${
                    value === stop.id ? "bg-ios-blue/10" : "hover:bg-ios-gray6"
                  }`}
                >
                  <IoLocationSharp size={14} className={value === stop.id ? "text-ios-blue" : "text-ios-gray"} />
                  <span className={`text-sm font-medium ${value === stop.id ? "text-ios-blue" : "text-gray-800"}`}>
                    {stop.name}
                  </span>
                </button>
              ))}
              {filtered.length === 0 && (
                <p className="text-center text-ios-gray text-xs py-4 font-medium">No stops found</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ResultCard({ route, buses, busDetails }) {
  const routeBuses = (busDetails || []).filter(
    (b) => b.current_trip && b.current_trip.route === route.id
  );
  const liveCount = routeBuses.filter((b) => buses[b.bus_id]).length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-ios border border-white/60 rounded-2xl p-4 shadow-sm"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-12 h-12 rounded-2xl flex items-center justify-center shadow-glass-sm"
          style={{ backgroundColor: route.color + "15" }}
        >
          <FaBus size={20} style={{ color: route.color }} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-gray-900 text-base tracking-tight">{route.name}</p>
          <p className="text-ios-gray font-medium text-xs truncate mt-0.5">{route.description}</p>
        </div>
        <div className="flex flex-col items-end gap-1">
          <span className="flex items-center gap-1 text-[11px] font-semibold text-ios-gray bg-ios-gray6 px-2 py-0.5 rounded-md">
            <FaMapMarkerAlt size={10} className="text-ios-orange" />
            {(route.stops || []).length} stops
          </span>
          <span className="flex items-center gap-1 text-[11px] font-semibold bg-ios-green/10 text-ios-green px-2 py-0.5 rounded-md">
            <FaBus size={10} />
            {liveCount} live
          </span>
        </div>
      </div>

      {/* Stop timeline */}
      <div className="mt-3 pt-3 border-t border-black/5">
        <div className="flex items-center gap-2 overflow-x-auto hide-scrollbar pb-1">
          {(route.stops || []).map((stop, i) => (
            <React.Fragment key={stop.stop_id}>
              <span className="text-[10px] font-semibold text-ios-gray whitespace-nowrap">{stop.name}</span>
              {i < route.stops.length - 1 && (
                <div className="w-3 h-[2px] rounded-full flex-shrink-0" style={{ backgroundColor: route.color + "40" }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

export default function RouteFinder() {
  const [stops, setStops] = useState([]);
  const [origin, setOrigin] = useState(null);
  const [destination, setDestination] = useState(null);
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const buses = useTrackingStore((s) => s.buses);
  const busDetails = useTrackingStore((s) => s.busDetails) || [];

  useEffect(() => {
    fetchStopsList().then(setStops).catch(() => {});
  }, []);

  const handleSearch = async () => {
    if (!origin || !destination) return;
    setLoading(true);
    try {
      const data = await findRoutes(origin, destination);
      setResults(Array.isArray(data) ? data : []);
    } catch {
      setResults([]);
    }
    setLoading(false);
  };

  const handleSwap = () => {
    setOrigin(destination);
    setDestination(origin);
    setResults(null);
  };

  return (
    <div className="space-y-3">
      <div className="relative space-y-2">
        <StopDropdown
          label="From"
          icon={IoNavigate}
          stops={stops}
          value={origin}
          onChange={(v) => { setOrigin(v); setResults(null); }}
          color="bg-ios-green/10 text-ios-green"
        />
        <button
          onClick={handleSwap}
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 w-9 h-9 bg-white rounded-xl shadow-ios border border-white/60 flex items-center justify-center"
        >
          <IoSwapVertical size={18} className="text-ios-blue" />
        </button>
        <StopDropdown
          label="To"
          icon={IoLocationSharp}
          stops={stops}
          value={destination}
          onChange={(v) => { setDestination(v); setResults(null); }}
          color="bg-ios-red/10 text-ios-red"
        />
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={handleSearch}
        disabled={!origin || !destination || origin === destination || loading}
        className={`w-full py-3.5 rounded-2xl font-bold text-sm tracking-tight shadow-sm transition-all ${
          origin && destination && origin !== destination
            ? "bg-ios-blue text-white shadow-ios"
            : "bg-ios-gray5 text-ios-gray cursor-not-allowed"
        }`}
      >
        {loading ? "Searching..." : "Find Routes"}
      </motion.button>

      <AnimatePresence mode="wait">
        {results !== null && (
          <motion.div
            key="results"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="space-y-3"
          >
            {results.length > 0 ? (
              <>
                <p className="text-[10px] font-bold text-ios-gray uppercase tracking-wider px-1">
                  {results.length} route{results.length > 1 ? "s" : ""} found
                </p>
                {results.map((route) => (
                  <ResultCard key={route.id} route={route} buses={buses} busDetails={busDetails} />
                ))}
              </>
            ) : (
              <div className="bg-white/80 backdrop-blur-ios rounded-2xl p-6 text-center border border-white/60 shadow-sm">
                <p className="text-ios-gray font-semibold text-sm">No direct routes found</p>
                <p className="text-ios-gray2 text-xs mt-1">Try different stops</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
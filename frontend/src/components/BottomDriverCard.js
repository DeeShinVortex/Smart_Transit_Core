import React from "react";
import { IoCallOutline, IoChatbubbleOutline, IoNavigateOutline } from "react-icons/io5";
import { FaBus } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
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

  const tripStops = detail?.current_trip?.trip_stops || [];
  const nextStops = tripStops.slice(0, 3);

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 150, opacity: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 25 }}
        className="absolute bottom-32 left-4 right-4 z-10"
      >
        <div className="bg-white/90 backdrop-blur-ios rounded-3xl shadow-ios overflow-hidden border border-white/60">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center shadow-glass-sm"
                style={{
                  backgroundColor: routeInfo?.color
                    ? routeInfo.color + "20"
                    : "#007AFF20",
                }}
              >
                <span
                  className="text-lg font-bold"
                  style={{ color: routeInfo?.color || "#007AFF" }}
                >
                  {driverInitial}
                </span>
              </div>
              <div>
                <p className="text-gray-900 font-bold text-base tracking-tight">{driverName}</p>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <span className="text-ios-gray text-xs font-medium">
                    {detail?.label || activeBus.vehicle_id}
                  </span>
                  {detail?.plate_number && (
                    <>
                      <span className="w-1 h-1 rounded-full bg-ios-gray3" />
                      <span className="text-ios-gray text-xs font-medium">{detail.plate_number}</span>
                    </>
                  )}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {driverPhone && (
                <motion.a
                  whileTap={{ scale: 0.9 }}
                  href={`tel:${driverPhone}`}
                  className="w-10 h-10 bg-ios-green/10 rounded-full flex items-center justify-center"
                  aria-label="Call driver"
                >
                  <IoCallOutline size={18} className="text-ios-green" />
                </motion.a>
              )}
              <motion.button
                whileTap={{ scale: 0.9 }}
                className="w-10 h-10 bg-ios-blue/10 rounded-full flex items-center justify-center"
                aria-label="Navigate"
              >
                <IoNavigateOutline size={18} className="text-ios-blue" />
              </motion.button>
            </div>
          </div>

          {nextStops.length > 0 && (
            <div className="px-5 pb-4 pt-1 flex items-center gap-2 overflow-x-auto hide-scrollbar">
              {nextStops.map((ts, i) => (
                <div
                  key={ts.id}
                  className="flex items-center gap-1.5 flex-shrink-0"
                >
                  <div
                    className="w-2 h-2 rounded-full shadow-sm"
                    style={{
                      backgroundColor: routeInfo?.color || "#007AFF",
                      opacity: 1 - i * 0.25,
                    }}
                  />
                  <span className="text-xs font-medium text-ios-gray whitespace-nowrap">
                    {ts.stop?.name || `Stop ${ts.sequence}`}
                  </span>
                  {i < nextStops.length - 1 && (
                    <span className="text-ios-gray3 text-[10px] mx-1">/</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

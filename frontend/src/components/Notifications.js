import React, { useEffect, useState } from "react";
import useTrackingStore from "../store";

export default function Notifications() {
  const buses = useTrackingStore((s) => s.buses);
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    // Check for buses that just appeared (new vehicle_id)
    const newAlerts = [];
    Object.values(buses).forEach((bus) => {
      if (bus.speed !== undefined && bus.speed < 2 && bus.occupancy === "crowded") {
        newAlerts.push({
          id: `${bus.vehicle_id}-${Date.now()}`,
          message: `${bus.vehicle_id} is crowded and stopped`,
          type: "warning",
        });
      }
    });

    if (newAlerts.length > 0) {
      setAlerts((prev) => [...newAlerts, ...prev].slice(0, 5));
    }
  }, [buses]);

  // Auto-dismiss after 8 seconds
  useEffect(() => {
    if (alerts.length === 0) return;
    const timer = setTimeout(() => {
      setAlerts((prev) => prev.slice(0, -1));
    }, 8000);
    return () => clearTimeout(timer);
  }, [alerts]);

  if (alerts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-sm">
      {alerts.map((alert) => (
        <div
          key={alert.id}
          role="alert"
          className={`rounded-lg shadow-lg p-4 text-sm animate-slide-in ${
            alert.type === "warning"
              ? "bg-yellow-50 text-yellow-800 border border-yellow-200"
              : "bg-blue-50 text-blue-800 border border-blue-200"
          }`}
        >
          <div className="flex items-center justify-between">
            <span>{alert.message}</span>
            <button
              onClick={() => setAlerts((prev) => prev.filter((a) => a.id !== alert.id))}
              className="ml-3 text-gray-400 hover:text-gray-600"
              aria-label="Dismiss notification"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

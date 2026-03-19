import React, { useEffect, useState } from "react";
import { FaBus, FaExclamationTriangle, FaInfoCircle, FaCheckCircle } from "react-icons/fa";
import useTrackingStore from "../store";

function getAlerts(buses, busDetails, routes) {
  const alerts = [];
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  Object.values(buses).forEach((bus) => {
    const detail = busDetails.find((b) => b.bus_id === bus.vehicle_id);
    const route = detail?.current_trip
      ? routes.find((r) => r.id === detail.current_trip.route)
      : null;
    const label = detail?.label || bus.vehicle_id;
    const routeName = route?.name || "";

    if (bus.occupancy === "crowded") {
      alerts.push({
        id: `crowded-${bus.vehicle_id}`,
        icon: FaExclamationTriangle,
        iconColor: "text-red-500",
        bgColor: "bg-red-50",
        borderColor: "border-red-200",
        title: `${label} is crowded`,
        message: `${routeName} — consider waiting for the next bus.`,
        time: timeStr,
        priority: 3,
      });
    }

    if (bus.speed !== undefined && bus.speed < 3) {
      alerts.push({
        id: `stopped-${bus.vehicle_id}`,
        icon: FaInfoCircle,
        iconColor: "text-amber-500",
        bgColor: "bg-amber-50",
        borderColor: "border-amber-200",
        title: `${label} is stopped`,
        message: `Currently at ${Math.round(bus.speed)} km/h on ${routeName}.`,
        time: timeStr,
        priority: 2,
      });
    }

    if (bus.speed > 35) {
      alerts.push({
        id: `fast-${bus.vehicle_id}`,
        icon: FaCheckCircle,
        iconColor: "text-emerald-500",
        bgColor: "bg-emerald-50",
        borderColor: "border-emerald-200",
        title: `${label} moving well`,
        message: `${Math.round(bus.speed)} km/h on ${routeName}. On schedule.`,
        time: timeStr,
        priority: 1,
      });
    }
  });

  // Sort by priority (highest first)
  alerts.sort((a, b) => b.priority - a.priority);
  return alerts;
}

export default function MessagesPage() {
  const buses = useTrackingStore((s) => s.buses);
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const routes = useTrackingStore((s) => s.routes) || [];
  const [alerts, setAlerts] = useState([]);

  useEffect(() => {
    const newAlerts = getAlerts(buses, busDetails, routes);
    setAlerts(newAlerts);
  }, [buses, busDetails, routes]);

  return (
    <div className="h-full bg-gray-50 pt-6 pb-24 px-4 overflow-y-auto">
      <h1 className="text-xl font-bold text-gray-800 mb-1 text-center">
        Live Alerts
      </h1>
      <p className="text-xs text-gray-400 text-center mb-5">
        Real-time bus status updates
      </p>

      {alerts.length === 0 ? (
        <div className="text-center py-12">
          <FaCheckCircle size={32} className="text-emerald-300 mx-auto mb-3" />
          <p className="text-gray-400 text-sm">All buses running smoothly</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {alerts.map((alert) => {
            const Icon = alert.icon;
            return (
              <div
                key={alert.id}
                className={`${alert.bgColor} border ${alert.borderColor} rounded-xl p-3.5 flex items-start gap-3`}
              >
                <Icon size={16} className={`${alert.iconColor} mt-0.5 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold text-gray-800">
                      {alert.title}
                    </p>
                    <span className="text-[10px] text-gray-400 flex-shrink-0 ml-2">
                      {alert.time}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5">{alert.message}</p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

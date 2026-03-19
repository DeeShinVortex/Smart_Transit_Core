import React, { useEffect, useState } from "react";
import useTrackingStore from "../store";
import { fetchBusETA } from "../services/api";
import LoadingSpinner from "./LoadingSpinner";

function OccupancyBadge({ level }) {
  const colors = {
    empty: "bg-green-100 text-green-800",
    half: "bg-yellow-100 text-yellow-800",
    crowded: "bg-red-100 text-red-800",
  };
  const labels = { empty: "Empty", half: "Half-full", crowded: "Crowded" };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${colors[level] || colors.empty}`}>
      {labels[level] || level}
    </span>
  );
}

export default function Dashboard() {
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);
  const buses = useTrackingStore((s) => s.buses);
  const selectedBus = selectedBusId ? buses[selectedBusId] : null;
  const [eta, setEta] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!selectedBus) { setEta(null); return; }
    setLoading(true);
    fetchBusETA(selectedBus.vehicle_id)
      .then(setEta)
      .catch(() => setEta(null))
      .finally(() => setLoading(false));

    const interval = setInterval(() => {
      fetchBusETA(selectedBus.vehicle_id).then(setEta).catch(() => {});
    }, 15000);
    return () => clearInterval(interval);
  }, [selectedBus?.vehicle_id]);

  if (!selectedBus) {
    return (
      <div className="bg-white rounded-lg shadow-lg p-6 text-center text-gray-400">
        Tap a bus on the map to see details
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-gray-800">{selectedBus.vehicle_id}</h2>
        <OccupancyBadge level={selectedBus.occupancy} />
      </div>
      <div className="text-sm text-gray-500">Speed: {selectedBus.speed ?? 0} km/h</div>
      {loading && <LoadingSpinner message="Calculating ETA..." />}
      {eta?.next_stop && (
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-sm text-blue-600 font-medium">Next Stop</p>
          <p className="text-xl font-bold text-blue-900">{eta.next_stop.stop_name}</p>
          <p className="text-2xl font-bold text-blue-700 mt-1">{eta.next_stop.eta_minutes} min</p>
          <p className="text-xs text-blue-400">{eta.next_stop.distance_m}m away</p>
        </div>
      )}
      {eta?.error && <p className="text-sm text-red-500">{eta.error}</p>}
    </div>
  );
}

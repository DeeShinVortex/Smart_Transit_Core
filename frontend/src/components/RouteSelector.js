import React from "react";
import useTrackingStore from "../store";
import FavoriteButton from "./FavoriteButton";

export default function RouteSelector() {
  const routes = useTrackingStore((s) => s.routes) || [];
  const selectedRoute = useTrackingStore((s) => s.selectedRoute);
  const setSelectedRoute = useTrackingStore((s) => s.setSelectedRoute);

  return (
    <div className="bg-white rounded-lg shadow-lg p-4">
      <label htmlFor="route-select" className="block text-sm font-medium text-gray-700 mb-2">
        Filter by Route
      </label>
      <div className="flex items-center gap-2">
        <select
          id="route-select"
          value={selectedRoute || ""}
          onChange={(e) => setSelectedRoute(e.target.value ? Number(e.target.value) : null)}
          className="flex-1 border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">All Routes</option>
          {routes.map((route) => (
            <option key={route.id} value={route.id}>
              {route.name}
            </option>
          ))}
        </select>
        {selectedRoute && <FavoriteButton routeId={selectedRoute} />}
      </div>
    </div>
  );
}

import React from "react";
import { Marker, Popup } from "react-leaflet";
import useTrackingStore from "../store";
import { stopIcon } from "./BusIcon";

export default function StopMarkers() {
  const routes = useTrackingStore((s) => s.routes) || [];

  // Deduplicate stops and track which routes they belong to
  const stopsMap = {};
  routes.forEach((route) => {
    (route.stops || []).forEach((stop) => {
      if (!stopsMap[stop.stop_id]) {
        stopsMap[stop.stop_id] = { ...stop, routes: [] };
      }
      stopsMap[stop.stop_id].routes.push({
        name: route.name,
        color: route.color,
      });
    });
  });

  return (
    <>
      {Object.values(stopsMap).map((stop) => (
        <Marker
          key={stop.stop_id}
          position={[stop.latitude, stop.longitude]}
          icon={stopIcon}
        >
          <Popup>
            <div className="min-w-[120px]">
              <p className="font-bold text-sm text-gray-800">{stop.name}</p>
              <div className="mt-1.5 space-y-1">
                {stop.routes.map((r, i) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full"
                      style={{ backgroundColor: r.color }}
                    />
                    <span className="text-[11px] text-gray-500">{r.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

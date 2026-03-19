import React from "react";
import { Marker, Popup } from "react-leaflet";
import useTrackingStore from "../store";
import { stopIcon } from "./BusIcon";

export default function StopMarkers() {
  const routes = useTrackingStore((s) => s.routes) || [];

  const stopsMap = {};
  routes.forEach((route) => {
    (route.stops || []).forEach((stop) => {
      stopsMap[stop.stop_id] = stop;
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
            <strong>{stop.name}</strong>
          </Popup>
        </Marker>
      ))}
    </>
  );
}

import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import useTrackingStore from "../store";
import { busIcon, userIcon } from "./BusIcon";
import SmoothMarker from "./SmoothMarker";
import StopMarkers from "./StopMarkers";

const DEFAULT_CENTER = [40.7128, -74.006];

function UserLocation() {
  const [position, setPosition] = useState(null);
  const map = useMap();

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => {
        const coords = [pos.coords.latitude, pos.coords.longitude];
        setPosition(coords);
      },
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, [map]);

  if (!position) return null;
  return (
    <Marker position={position} icon={userIcon}>
      <Popup>You are here</Popup>
    </Marker>
  );
}

function BusMarkers() {
  const buses = useTrackingStore((s) => s.buses);
  const setSelectedBus = useTrackingStore((s) => s.setSelectedBus);

  return (
    <>
      {Object.entries(buses).map(([id, bus]) => (
        <SmoothMarker
          key={id}
          position={[bus.latitude, bus.longitude]}
          icon={busIcon}
          onClick={() => setSelectedBus(bus)}
        >
          <Popup>
            <strong>{bus.vehicle_id}</strong>
            <br />
            Speed: {bus.speed ?? 0} km/h
            <br />
            Occupancy: {bus.occupancy ?? "unknown"}
          </Popup>
        </SmoothMarker>
      ))}
    </>
  );
}

function RouteLayers() {
  const routes = useTrackingStore((s) => s.routes) || [];
  const selectedRoute = useTrackingStore((s) => s.selectedRoute);

  const visible = selectedRoute
    ? routes.filter((r) => r.id === selectedRoute)
    : routes;

  return (
    <>
      {visible
        .filter((r) => r.geojson)
        .map((route) => (
          <GeoJSON
            key={`${route.id}-${selectedRoute}`}
            data={route.geojson}
            style={{ color: route.color || "#3B82F6", weight: 4, opacity: 0.7 }}
          />
        ))}
    </>
  );
}

export default function Map() {
  return (
    <div className="rounded-lg overflow-hidden shadow-lg h-[75vh]">
      <MapContainer center={DEFAULT_CENTER} zoom={13} className="h-full w-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <RouteLayers />
        <StopMarkers />
        <BusMarkers />
        <UserLocation />
      </MapContainer>
    </div>
  );
}

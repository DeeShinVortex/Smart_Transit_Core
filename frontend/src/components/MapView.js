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
import { FiPlus, FiMinus } from "react-icons/fi";

const DEFAULT_CENTER = [22.3072, 73.1812]; // Vadodara, Gujarat, India

function UserLocation() {
  const [position, setPosition] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    const watcher = navigator.geolocation.watchPosition(
      (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
      () => {},
      { enableHighAccuracy: true }
    );
    return () => navigator.geolocation.clearWatch(watcher);
  }, []);

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
  const selectedBusId = useTrackingStore((s) => s.selectedBusId);

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
            <div className="text-center">
              <strong>{bus.vehicle_id}</strong>
              <br />
              <span className="text-xs">{Math.round(bus.speed || 0)} km/h</span>
              {selectedBusId === id && (
                <div className="text-xs text-blue-600 font-semibold mt-1">● Active</div>
              )}
            </div>
          </Popup>
        </SmoothMarker>
      ))}
    </>
  );
}

function RouteLayers() {
  const routes = useTrackingStore((s) => s.routes) || [];
  return (
    <>
      {routes
        .filter((r) => r.geojson)
        .map((route) => (
          <React.Fragment key={route.id}>
            {/* Shadow/glow layer underneath */}
            <GeoJSON
              data={route.geojson}
              style={{
                color: route.color || "#2563EB",
                weight: 10,
                opacity: 0.15,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            {/* Main route line */}
            <GeoJSON
              data={route.geojson}
              style={{
                color: route.color || "#2563EB",
                weight: 5,
                opacity: 0.9,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </React.Fragment>
        ))}
    </>
  );
}

function ZoomControls() {
  const map = useMap();
  return (
    <div className="absolute right-4 z-[1000]" style={{ top: "55%" }}>
      <div className="flex flex-col gap-2">
        <button
          onClick={() => map.zoomIn()}
          className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          aria-label="Zoom in"
        >
          <FiPlus size={20} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-11 h-11 bg-white rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 active:bg-gray-100"
          aria-label="Zoom out"
        >
          <FiMinus size={20} />
        </button>
      </div>
    </div>
  );
}

export default function MapView() {
  return (
    <div className="absolute inset-0 z-0">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={14}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <RouteLayers />
        <StopMarkers />
        <BusMarkers />
        <UserLocation />
        <ZoomControls />
      </MapContainer>
    </div>
  );
}

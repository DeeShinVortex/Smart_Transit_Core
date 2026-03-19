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
import FollowCamera from "./FollowCamera";
import { FiPlus, FiMinus, FiCrosshair, FiNavigation } from "react-icons/fi";

const DEFAULT_CENTER = [22.3072, 73.1812];

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
      <Popup>
        <div className="text-center text-xs font-medium">You are here</div>
      </Popup>
    </Marker>
  );
}

function BusMarkers() {
  const buses = useTrackingStore((s) => s.buses);
  const setSelectedBus = useTrackingStore((s) => s.setSelectedBus);
  const busDetails = useTrackingStore((s) => s.busDetails) || [];
  const routes = useTrackingStore((s) => s.routes) || [];

  return (
    <>
      {Object.entries(buses).map(([id, bus]) => {
        const detail = busDetails.find((b) => b.bus_id === id);
        const route = detail?.current_trip
          ? routes.find((r) => r.id === detail.current_trip.route)
          : null;

        const occColors = { empty: "#10B981", half: "#F59E0B", crowded: "#EF4444" };
        const occLabels = { empty: "Available", half: "Moderate", crowded: "Crowded" };

        return (
          <SmoothMarker
            key={id}
            position={[bus.latitude, bus.longitude]}
            icon={busIcon}
            onClick={() => setSelectedBus(bus)}
          >
            <Popup>
              <div className="min-w-[140px]">
                <p className="font-bold text-sm text-gray-800">
                  {detail?.label || id}
                </p>
                {route && (
                  <p className="text-xs mt-0.5" style={{ color: route.color }}>
                    {route.name}
                  </p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <span className="text-xs text-gray-500">
                    {Math.round(bus.speed || 0)} km/h
                  </span>
                  <span
                    className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full text-white"
                    style={{ backgroundColor: occColors[bus.occupancy] || "#10B981" }}
                  >
                    {occLabels[bus.occupancy] || bus.occupancy}
                  </span>
                </div>
                {detail?.driver_name && (
                  <p className="text-[10px] text-gray-400 mt-1.5 pt-1.5 border-t border-gray-100">
                    {detail.driver_name}
                    {detail.plate_number && ` · ${detail.plate_number}`}
                  </p>
                )}
              </div>
            </Popup>
          </SmoothMarker>
        );
      })}
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
            <GeoJSON
              data={route.geojson}
              style={{
                color: route.color || "#2563EB",
                weight: 10,
                opacity: 0.12,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <GeoJSON
              data={route.geojson}
              style={{
                color: route.color || "#2563EB",
                weight: 4,
                opacity: 0.85,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
          </React.Fragment>
        ))}
    </>
  );
}

function MapControls() {
  const map = useMap();

  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { duration: 1.2 });
      },
      () => {},
      { enableHighAccuracy: true }
    );
  };

  return (
    <div className="absolute right-3 z-[1000]" style={{ top: "50%" }}>
      <div className="flex flex-col gap-1.5">
        <button
          onClick={() => map.zoomIn()}
          className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-white active:bg-gray-100 transition-colors"
          aria-label="Zoom in"
        >
          <FiPlus size={18} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-white active:bg-gray-100 transition-colors"
          aria-label="Zoom out"
        >
          <FiMinus size={18} />
        </button>
        <button
          onClick={() => map.flyTo(DEFAULT_CENTER, 13, { duration: 1 })}
          className="w-10 h-10 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl shadow-lg flex items-center justify-center text-gray-600 hover:bg-white active:bg-gray-100 transition-colors"
          aria-label="Reset view"
        >
          <FiCrosshair size={18} />
        </button>
        <button
          onClick={goToMyLocation}
          className="w-10 h-10 bg-blue-500 rounded-xl shadow-lg flex items-center justify-center text-white hover:bg-blue-600 active:bg-blue-700 transition-colors"
          aria-label="My location"
        >
          <FiNavigation size={18} />
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
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png" />
        <RouteLayers />
        <StopMarkers />
        <BusMarkers />
        <UserLocation />
        <FollowCamera />
        <MapControls />
      </MapContainer>
    </div>
  );
}

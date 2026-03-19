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
import { FiPlus, FiMinus, FiCrosshair, FiNavigation, FiMaximize, FiMinimize } from "react-icons/fi";
import { motion } from "framer-motion";

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
        <div className="text-center text-xs font-semibold px-1 py-0.5">You are here</div>
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

        const occColors = { empty: "#34C759", half: "#FF9500", crowded: "#FF3B30" };
        const occLabels = { empty: "Available", half: "Moderate", crowded: "Crowded" };

        return (
          <SmoothMarker
            key={id}
            position={[bus.latitude, bus.longitude]}
            icon={busIcon}
            onClick={() => setSelectedBus(bus)}
          >
            <Popup className="ios-popup">
              <div className="min-w-[150px] p-1">
                <p className="font-bold text-base text-gray-900 tracking-tight">
                  {detail?.label || id}
                </p>
                {route && (
                  <p className="text-[11px] font-semibold mt-0.5" style={{ color: route.color }}>
                    {route.name}
                  </p>
                )}
                <div className="flex items-center justify-between mt-3 mb-1">
                  <span className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
                    {Math.round(bus.speed || 0)} km/h
                  </span>
                  <span
                    className="text-[10px] font-bold px-2 py-0.5 rounded-md text-white shadow-sm"
                    style={{ backgroundColor: occColors[bus.occupancy] || "#34C759" }}
                  >
                    {occLabels[bus.occupancy] || bus.occupancy}
                  </span>
                </div>
                {detail?.driver_name && (
                  <p className="text-[10px] font-medium text-gray-500 mt-2 pt-2 border-t border-gray-100">
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
                color: route.color || "#007AFF",
                weight: 12,
                opacity: 0.15,
                lineCap: "round",
                lineJoin: "round",
              }}
            />
            <GeoJSON
              data={route.geojson}
              style={{
                color: route.color || "#007AFF",
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

function MapControls() {
  const map = useMap();
  const isMapOnly = useTrackingStore((s) => s.isMapOnly);
  const toggleMapOnly = useTrackingStore((s) => s.toggleMapOnly);

  const goToMyLocation = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        map.flyTo([pos.coords.latitude, pos.coords.longitude], 16, { duration: 0.5 });
      },
      (err) => console.warn("Location error:", err),
      { enableHighAccuracy: true, maximumAge: 10000 }
    );
  };

  return (
    <motion.div 
      initial={{ x: 50, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 260, damping: 20 }}
      className={`absolute right-4 z-[1000] transition-all duration-300 ${isMapOnly ? "top-4" : "top-[45%]"}`}
    >
      <div className="flex flex-col gap-2">
        <div className="flex flex-col bg-white/80 backdrop-blur-ios rounded-2xl shadow-ios border border-white/60 overflow-hidden">
          <motion.button
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={() => map.zoomIn()}
            className="w-11 h-11 flex items-center justify-center text-ios-gray hover:text-gray-900 transition-colors border-b border-gray-200/50"
            aria-label="Zoom in"
          >
            <FiPlus size={20} />
          </motion.button>
          <motion.button
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={() => map.zoomOut()}
            className="w-11 h-11 flex items-center justify-center text-ios-gray hover:text-gray-900 transition-colors"
            aria-label="Zoom out"
          >
            <FiMinus size={20} />
          </motion.button>
        </div>
        
        <div className="flex flex-col bg-white/80 backdrop-blur-ios rounded-2xl shadow-ios border border-white/60 overflow-hidden mt-2">
          <motion.button
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={goToMyLocation}
            className="w-11 h-11 flex items-center justify-center text-ios-blue hover:bg-ios-blue/5 transition-colors border-b border-gray-200/50"
            aria-label="My location"
          >
            <FiCrosshair size={20} />
          </motion.button>
          <motion.button
            whileTap={{ backgroundColor: "rgba(0,0,0,0.05)" }}
            onClick={toggleMapOnly}
            className="w-11 h-11 flex items-center justify-center text-gray-800 hover:bg-gray-100 transition-colors"
            aria-label="Toggle Fullscreen Map"
          >
            {isMapOnly ? <FiMinimize size={20} /> : <FiMaximize size={20} />}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default function MapView() {
  return (
    <div className="absolute inset-0 z-0 bg-ios-bg">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={13}
        className="h-full w-full"
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer 
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png" 
          maxZoom={19}
        />
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

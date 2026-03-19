import { useEffect, useRef } from "react";
import { Marker, Popup, useMap } from "react-leaflet";

/**
 * A marker that smoothly animates between positions
 * instead of teleporting when coordinates update.
 */
export default function SmoothMarker({ position, icon, children, onClick }) {
  const markerRef = useRef(null);
  const prevPos = useRef(position);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker) return;

    const [newLat, newLng] = position;
    const [oldLat, oldLng] = prevPos.current;

    if (newLat === oldLat && newLng === oldLng) return;

    // Animate over 1 second in 20 steps
    const steps = 20;
    const latStep = (newLat - oldLat) / steps;
    const lngStep = (newLng - oldLng) / steps;
    let step = 0;

    const interval = setInterval(() => {
      step++;
      const lat = oldLat + latStep * step;
      const lng = oldLng + lngStep * step;
      marker.setLatLng([lat, lng]);

      if (step >= steps) {
        clearInterval(interval);
        marker.setLatLng([newLat, newLng]);
      }
    }, 50);

    prevPos.current = position;

    return () => clearInterval(interval);
  }, [position]);

  return (
    <Marker
      ref={markerRef}
      position={prevPos.current}
      icon={icon}
      eventHandlers={onClick ? { click: onClick } : {}}
    >
      {children}
    </Marker>
  );
}

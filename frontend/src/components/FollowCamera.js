import { useEffect } from "react";
import { useMap } from "react-leaflet";
import useTrackingStore from "../store";

/**
 * When a bus is being tracked, smoothly pan the map
 * to keep it centered on every position update.
 */
export default function FollowCamera() {
  const map = useMap();
  const trackingBusId = useTrackingStore((s) => s.trackingBusId);
  const buses = useTrackingStore((s) => s.buses);

  const trackedBus = trackingBusId ? buses[trackingBusId] : null;

  useEffect(() => {
    if (!trackedBus) return;
    map.flyTo([trackedBus.latitude, trackedBus.longitude], map.getZoom(), {
      duration: 1,
    });
  }, [trackedBus?.latitude, trackedBus?.longitude, map, trackedBus]);

  return null;
}

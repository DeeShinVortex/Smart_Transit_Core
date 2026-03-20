import { useEffect, useRef, useCallback } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useTrackingStore from "../store";

const rawWsUrl = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws/tracking/";

function resolveWsUrl(url) {
  if (url.startsWith("ws://") || url.startsWith("wss://")) return url;
  // Relative path — build from current page location
  const proto = window.location.protocol === "https:" ? "wss:" : "ws:";
  const path = url.endsWith("/") ? url : url + "/";
  const wsPath = path.endsWith("tracking/") ? path : path + "tracking/";
  return `${proto}//${window.location.host}${wsPath}`;
}

const WS_URL = resolveWsUrl(rawWsUrl);

export default function useTracking() {
  const ws = useRef(null);
  const { setBuses, updateBus } = useTrackingStore();

  useEffect(() => {
    ws.current = new ReconnectingWebSocket(WS_URL);

    ws.current.onmessage = (e) => {
      const msg = JSON.parse(e.data);
      if (msg.type === "snapshot") {
        setBuses(msg.buses);
      } else if (msg.type === "update") {
        const bus = msg.bus;
        updateBus(bus.vehicle_id, bus);
      }
    };

    return () => ws.current?.close();
  }, [setBuses, updateBus]);

  const send = useCallback(
    (data) => ws.current?.send(JSON.stringify(data)),
    []
  );

  return { send };
}

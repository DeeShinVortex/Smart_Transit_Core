import { useEffect, useRef, useCallback } from "react";
import ReconnectingWebSocket from "reconnecting-websocket";
import useTrackingStore from "../store";

const WS_URL = process.env.REACT_APP_WS_URL || "ws://localhost:8000/ws/tracking/";

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

const API_BASE = process.env.REACT_APP_API_URL || "http://localhost:8000/api";

export async function fetchRoutes() {
  const res = await fetch(`${API_BASE}/transit/routes/`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchStops(routeId) {
  const res = await fetch(`${API_BASE}/transit/routes/${routeId}/stops/`);
  return res.json();
}

export async function fetchBuses() {
  const res = await fetch(`${API_BASE}/transit/buses/`);
  const data = await res.json();
  return Array.isArray(data) ? data : data.results || [];
}

export async function fetchBusesLive() {
  const res = await fetch(`${API_BASE}/transit/buses/live/`);
  return res.json();
}

export async function fetchLiveBuses() {
  const res = await fetch(`${API_BASE}/tracking/live/`);
  return res.json();
}

export async function fetchBusETA(busId) {
  const res = await fetch(`${API_BASE}/tracking/eta/${busId}/`);
  return res.json();
}

export async function fetchNearbyBuses(stopId) {
  const res = await fetch(`${API_BASE}/tracking/proximity/${stopId}/`);
  return res.json();
}

export async function toggleFavoriteRoute(routeId, token) {
  const res = await fetch(`${API_BASE}/accounts/favorites/${routeId}/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token ${token}`,
    },
  });
  return res.json();
}

"""ETA calculation service."""

import math


def haversine(lat1, lon1, lat2, lon2):
    """Distance in meters between two coordinates."""
    R = 6371000  # Earth radius in meters
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    dphi = math.radians(lat2 - lat1)
    dlambda = math.radians(lon2 - lon1)
    a = (
        math.sin(dphi / 2) ** 2
        + math.cos(phi1) * math.cos(phi2) * math.sin(dlambda / 2) ** 2
    )
    return R * 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))


def estimate_eta(bus_lat, bus_lon, stop_lat, stop_lon, speed_mps=None):
    """
    Estimate time of arrival in seconds.
    speed_mps: current speed in meters/second. Falls back to avg city bus speed.
    """
    distance = haversine(bus_lat, bus_lon, stop_lat, stop_lon)
    if speed_mps and speed_mps > 0.5:
        return distance / speed_mps
    # Default average city bus speed: ~20 km/h = 5.56 m/s
    return distance / 5.56


def get_next_stop_eta(bus_location, trip_stops):
    """
    Given a bus location dict and ordered trip_stops queryset,
    find the nearest upcoming stop and return ETA info.
    """
    bus_lat = bus_location["latitude"]
    bus_lon = bus_location["longitude"]
    speed = bus_location.get("speed", 0)
    # Convert km/h to m/s if speed seems to be in km/h
    speed_mps = speed / 3.6 if speed > 1 else None

    best = None
    for ts in trip_stops:
        dist = haversine(bus_lat, bus_lon, ts.stop.latitude, ts.stop.longitude)
        eta_sec = estimate_eta(
            bus_lat, bus_lon, ts.stop.latitude, ts.stop.longitude, speed_mps
        )
        entry = {
            "stop_id": ts.stop.stop_id,
            "stop_name": ts.stop.name,
            "distance_m": round(dist),
            "eta_seconds": round(eta_sec),
            "eta_minutes": round(eta_sec / 60, 1),
            "sequence": ts.sequence,
        }
        if best is None or dist < best["distance_m"]:
            best = entry

    return best

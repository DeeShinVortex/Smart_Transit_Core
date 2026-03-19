"""Proximity-based notifications — alerts when a bus is near a stop."""

from services.eta import haversine
from services.cache import get_all_bus_locations
from apps.transit.models import Stop


PROXIMITY_THRESHOLD_M = 200  # meters


def check_bus_proximity(stop_id):
    """
    Check if any active bus is within threshold distance of a stop.
    Returns list of nearby buses with distance info.
    """
    try:
        stop = Stop.objects.get(stop_id=stop_id)
    except Stop.DoesNotExist:
        return []

    locations = get_all_bus_locations()
    nearby = []

    for vid, loc in locations.items():
        dist = haversine(loc["latitude"], loc["longitude"], stop.latitude, stop.longitude)
        if dist <= PROXIMITY_THRESHOLD_M:
            nearby.append({
                "vehicle_id": vid,
                "distance_m": round(dist),
                "latitude": loc["latitude"],
                "longitude": loc["longitude"],
                "occupancy": loc.get("occupancy", "unknown"),
            })

    return nearby

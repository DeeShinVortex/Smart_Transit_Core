"""
Fetch road-following routes from OSRM (free, no API key needed).
Returns GeoJSON LineString that follows actual streets.
"""

import json
import urllib.request


OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"


def get_road_route(coordinates):
    """
    Given a list of (lat, lon) tuples, return a GeoJSON LineString
    that follows real roads between the points.
    
    OSRM expects lon,lat order in the URL.
    Returns GeoJSON with [lon, lat] coordinates.
    """
    # Build coordinate string: lon,lat;lon,lat;...
    coord_str = ";".join(f"{lon},{lat}" for lat, lon in coordinates)
    url = f"{OSRM_BASE}/{coord_str}?overview=full&geometries=geojson"

    try:
        req = urllib.request.Request(url, headers={"User-Agent": "TransitTracker/1.0"})
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())

        if data.get("code") != "Ok" or not data.get("routes"):
            return None

        # The geometry is already a GeoJSON LineString
        geometry = data["routes"][0]["geometry"]
        return geometry

    except Exception as e:
        print(f"OSRM routing failed: {e}")
        return None

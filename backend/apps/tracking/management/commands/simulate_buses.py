"""
Bus simulator — moves buses along their route's actual road geometry.
Posts updates to the GPS webhook so they flow through the Django server
process (works with InMemoryChannelLayer, no Redis needed).

Usage: python manage.py simulate_buses [--interval 3]
"""

import time
import random
import math
import urllib.request
import json
from django.core.management.base import BaseCommand

from apps.transit.models import Bus


API_URL = "http://127.0.0.1:8000/api/tracking/gps/"


def bearing(lat1, lon1, lat2, lon2):
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    return math.degrees(math.atan2(dlon, dlat)) % 360


class Command(BaseCommand):
    help = "Simulate buses moving along their route's road geometry"

    def add_arguments(self, parser):
        parser.add_argument(
            "--interval", type=float, default=3.0,
            help="Seconds between position updates (default: 3)",
        )

    def handle(self, *args, **options):
        interval = options["interval"]

        buses = Bus.objects.filter(
            is_active=True, current_trip__isnull=False
        ).select_related("current_trip__route")

        if not buses.exists():
            self.stderr.write(self.style.ERROR(
                "No active buses with trips. Run 'seed_demo' first."
            ))
            return

        # Build waypoints from route GeoJSON for each bus
        bus_paths = {}
        for bus in buses:
            route = bus.current_trip.route
            geojson = route.geojson

            if not geojson or "coordinates" not in geojson:
                self.stderr.write(f"  {bus.label}: no GeoJSON, skipping")
                continue

            coords = geojson["coordinates"]
            waypoints = [(c[1], c[0]) for c in coords]

            if len(waypoints) < 2:
                continue

            bus_paths[bus] = {
                "waypoints": waypoints,
                "index": 0,
                "forward": True,
            }
            self.stdout.write(
                f"  {bus.label}: {len(waypoints)} road waypoints on {route.name}"
            )

        if not bus_paths:
            self.stderr.write(self.style.ERROR("No valid bus paths."))
            return

        self.stdout.write(self.style.SUCCESS(
            f"\nSimulating {len(bus_paths)} buses every {interval}s..."
        ))
        self.stdout.write("Press Ctrl+C to stop.\n")

        occupancy_choices = ["empty", "half", "crowded"]

        try:
            while True:
                for bus, state in bus_paths.items():
                    wp = state["waypoints"]
                    idx = state["index"]
                    lat, lon = wp[idx]

                    nxt = idx + (1 if state["forward"] else -1)
                    nxt = max(0, min(nxt, len(wp) - 1))
                    hdg = bearing(lat, lon, wp[nxt][0], wp[nxt][1])

                    speed = random.uniform(15, 45)
                    occ = random.choice(occupancy_choices)

                    data = {
                        "vehicle_id": bus.bus_id,
                        "latitude": round(lat, 6),
                        "longitude": round(lon, 6),
                        "speed": round(speed, 1),
                        "heading": round(hdg, 1),
                        "occupancy": occ,
                    }

                    # POST to the GPS webhook — this writes to DB, cache,
                    # and broadcasts via WebSocket all in the server process
                    try:
                        payload = json.dumps(data).encode("utf-8")
                        req = urllib.request.Request(
                            API_URL,
                            data=payload,
                            headers={"Content-Type": "application/json"},
                            method="POST",
                        )
                        urllib.request.urlopen(req, timeout=5)
                    except Exception as e:
                        self.stderr.write(f"  POST failed for {bus.label}: {e}")

                    self.stdout.write(
                        f"  {bus.label}: ({data['latitude']}, {data['longitude']}) "
                        f"{data['speed']}km/h {occ}"
                    )

                    if state["forward"]:
                        state["index"] += 1
                        if state["index"] >= len(wp) - 1:
                            state["forward"] = False
                    else:
                        state["index"] -= 1
                        if state["index"] <= 0:
                            state["forward"] = True

                self.stdout.write("")
                time.sleep(interval)

        except KeyboardInterrupt:
            self.stdout.write(self.style.SUCCESS("\nSimulation stopped."))

"""Seed demo data — Vadodara, Gujarat with real road-following routes."""

import time
from django.core.management.base import BaseCommand
from apps.transit.models import Route, Stop, Trip, TripStop, Bus
from services.routing import get_road_route


DEMO_STOPS = [
    {"stop_id": "S1", "name": "Vadodara Railway Station", "lat": 22.3100, "lon": 73.1812},
    {"stop_id": "S2", "name": "Sayajigunj", "lat": 22.3145, "lon": 73.1870},
    {"stop_id": "S3", "name": "Alkapuri", "lat": 22.3060, "lon": 73.1750},
    {"stop_id": "S4", "name": "Race Course Circle", "lat": 22.3090, "lon": 73.1700},
    {"stop_id": "S5", "name": "Fatehgunj", "lat": 22.3220, "lon": 73.1830},
    {"stop_id": "S6", "name": "Manjalpur", "lat": 22.2780, "lon": 73.1920},
    {"stop_id": "S7", "name": "Akota", "lat": 22.2950, "lon": 73.1680},
    {"stop_id": "S8", "name": "Karelibaug", "lat": 22.3250, "lon": 73.2050},
]


class Command(BaseCommand):
    help = "Seed demo transit data for Vadodara with road-following routes"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Vadodara demo data...")

        # Create stops
        stops = {}
        for s in DEMO_STOPS:
            obj, _ = Stop.objects.update_or_create(
                stop_id=s["stop_id"],
                defaults={"name": s["name"], "latitude": s["lat"], "longitude": s["lon"]},
            )
            stops[s["stop_id"]] = obj

        # Route 1: City Center Loop — fetch real road geometry
        r1_coords = [(s["lat"], s["lon"]) for s in DEMO_STOPS[:4]]
        self.stdout.write("  Fetching road route for City Center Loop...")
        r1_geojson = get_road_route(r1_coords)
        if not r1_geojson:
            self.stdout.write(self.style.WARNING("  OSRM failed, using straight lines"))
            r1_geojson = {
                "type": "LineString",
                "coordinates": [[s["lon"], s["lat"]] for s in DEMO_STOPS[:4]],
            }

        r1, _ = Route.objects.update_or_create(
            route_id="R1",
            defaults={
                "name": "City Center Loop",
                "description": "Railway Station → Race Course via Sayajigunj & Alkapuri",
                "color": "#2563EB",
                "geojson": r1_geojson,
            },
        )
        for s in list(stops.values())[:4]:
            r1.stops.add(s)

        # Small delay to be polite to OSRM
        time.sleep(1)

        # Route 2: North-South Express
        r2_coords = [(s["lat"], s["lon"]) for s in DEMO_STOPS[4:]]
        self.stdout.write("  Fetching road route for North-South Express...")
        r2_geojson = get_road_route(r2_coords)
        if not r2_geojson:
            self.stdout.write(self.style.WARNING("  OSRM failed, using straight lines"))
            r2_geojson = {
                "type": "LineString",
                "coordinates": [[s["lon"], s["lat"]] for s in DEMO_STOPS[4:]],
            }

        r2, _ = Route.objects.update_or_create(
            route_id="R2",
            defaults={
                "name": "North-South Express",
                "description": "Fatehgunj → Akota via Manjalpur & Karelibaug",
                "color": "#EF4444",
                "geojson": r2_geojson,
            },
        )
        for s in list(stops.values())[4:]:
            r2.stops.add(s)

        # Trips
        t1, _ = Trip.objects.update_or_create(
            trip_id="T1", defaults={"route": r1, "direction": "outbound"}
        )
        for i, sid in enumerate(["S1", "S2", "S3", "S4"]):
            TripStop.objects.update_or_create(
                trip=t1, sequence=i + 1,
                defaults={
                    "stop": stops[sid],
                    "arrival_time": f"08:{i * 10:02d}:00",
                    "departure_time": f"08:{i * 10 + 1:02d}:00",
                },
            )

        t2, _ = Trip.objects.update_or_create(
            trip_id="T2", defaults={"route": r2, "direction": "outbound"}
        )
        for i, sid in enumerate(["S5", "S6", "S7", "S8"]):
            TripStop.objects.update_or_create(
                trip=t2, sequence=i + 1,
                defaults={
                    "stop": stops[sid],
                    "arrival_time": f"09:{i * 10:02d}:00",
                    "departure_time": f"09:{i * 10 + 1:02d}:00",
                },
            )

        # Buses
        Bus.objects.update_or_create(
            bus_id="BUS-42", defaults={"label": "Bus 42", "current_trip": t1, "occupancy": "half"}
        )
        Bus.objects.update_or_create(
            bus_id="BUS-77", defaults={"label": "Bus 77", "current_trip": t2, "occupancy": "empty"}
        )
        Bus.objects.update_or_create(
            bus_id="BUS-13", defaults={"label": "Bus 13", "current_trip": t1, "occupancy": "crowded"}
        )

        self.stdout.write(self.style.SUCCESS(
            "Seeded: 2 Vadodara routes (road-following), 8 stops, 2 trips, 3 buses"
        ))

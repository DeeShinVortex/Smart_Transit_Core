"""GTFS feed parser — imports routes, stops, and trips from GTFS zip files."""

import csv
import io
import zipfile
from apps.transit.models import Route, Stop, Trip, TripStop


def import_gtfs(zip_path):
    """
    Parse a GTFS zip file and populate the database.
    Expects standard GTFS files: routes.txt, stops.txt, trips.txt, stop_times.txt
    """
    with zipfile.ZipFile(zip_path, "r") as zf:
        routes_created = _import_routes(zf)
        stops_created = _import_stops(zf)
        trips_created = _import_trips(zf)
        stop_times_created = _import_stop_times(zf)

    return {
        "routes": routes_created,
        "stops": stops_created,
        "trips": trips_created,
        "stop_times": stop_times_created,
    }


def _read_csv(zf, filename):
    with zf.open(filename) as f:
        reader = csv.DictReader(io.TextIOWrapper(f, encoding="utf-8-sig"))
        return list(reader)


def _import_routes(zf):
    rows = _read_csv(zf, "routes.txt")
    count = 0
    for row in rows:
        _, created = Route.objects.update_or_create(
            route_id=row["route_id"],
            defaults={
                "name": row.get("route_long_name") or row.get("route_short_name", ""),
                "description": row.get("route_desc", ""),
                "color": f"#{row['route_color']}" if row.get("route_color") else "#3B82F6",
            },
        )
        if created:
            count += 1
    return count


def _import_stops(zf):
    rows = _read_csv(zf, "stops.txt")
    count = 0
    for row in rows:
        _, created = Stop.objects.update_or_create(
            stop_id=row["stop_id"],
            defaults={
                "name": row.get("stop_name", ""),
                "latitude": float(row["stop_lat"]),
                "longitude": float(row["stop_lon"]),
            },
        )
        if created:
            count += 1
    return count


def _import_trips(zf):
    rows = _read_csv(zf, "trips.txt")
    count = 0
    for row in rows:
        route = Route.objects.filter(route_id=row["route_id"]).first()
        if not route:
            continue
        direction = "inbound" if row.get("direction_id") == "1" else "outbound"
        _, created = Trip.objects.update_or_create(
            trip_id=row["trip_id"],
            defaults={"route": route, "direction": direction},
        )
        if created:
            count += 1
    return count


def _import_stop_times(zf):
    rows = _read_csv(zf, "stop_times.txt")
    count = 0
    for row in rows:
        trip = Trip.objects.filter(trip_id=row["trip_id"]).first()
        stop = Stop.objects.filter(stop_id=row["stop_id"]).first()
        if not trip or not stop:
            continue
        _, created = TripStop.objects.update_or_create(
            trip=trip,
            sequence=int(row["stop_sequence"]),
            defaults={
                "stop": stop,
                "arrival_time": row["arrival_time"],
                "departure_time": row["departure_time"],
            },
        )
        if created:
            count += 1
    return count

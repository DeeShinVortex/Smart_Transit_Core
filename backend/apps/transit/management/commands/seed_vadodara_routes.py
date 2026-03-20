"""Seed real Vadodara city bus routes with stops and waypoints."""

import time
from django.core.management.base import BaseCommand
from apps.transit.models import Route, Stop, Trip, TripStop, Bus
from services.routing import get_road_route


# All unique stops with real Vadodara coordinates
STOPS = {
    "tower":            {"name": "Tower",                "lat": 22.3073, "lon": 73.1918},
    "mandvi":           {"name": "Mandvi",               "lat": 22.3040, "lon": 73.1945},
    "raopura":          {"name": "Raopura",              "lat": 22.3095, "lon": 73.1890},
    "jubilee_garden":   {"name": "Jubilee Garden",       "lat": 22.3110, "lon": 73.1860},
    "panigate_tanki":   {"name": "Panigate Tanki",       "lat": 22.3005, "lon": 73.1980},
    "panigate":         {"name": "Panigate",             "lat": 22.3015, "lon": 73.1965},
    "bapod":            {"name": "Bapod",                "lat": 22.3350, "lon": 73.1620},
    "ajwa_garden":      {"name": "Ajwa Garden",          "lat": 22.3200, "lon": 73.1150},
    "fatehgunj":        {"name": "Fatehgunj",            "lat": 22.3220, "lon": 73.1830},
    "harni":            {"name": "Harni",                "lat": 22.3390, "lon": 73.1950},
    "kisanwadi":        {"name": "Kisanwadi",            "lat": 22.3280, "lon": 73.2100},
    "salatwada":        {"name": "Salatwada",            "lat": 22.3120, "lon": 73.1930},
    "nagarwada":        {"name": "Nagarwada",            "lat": 22.3150, "lon": 73.1960},
    "sangam":           {"name": "Sangam",               "lat": 22.3300, "lon": 73.2150},
    "karelibaug":       {"name": "Karelibaug",           "lat": 22.3250, "lon": 73.2050},
    "bright_school":    {"name": "Bright School",        "lat": 22.3270, "lon": 73.2080},
    "dabhoi_bypass":    {"name": "Dabhoi Bypass",        "lat": 22.2850, "lon": 73.1600},
    "chokhandi":        {"name": "Chokhandi",            "lat": 22.2920, "lon": 73.1780},
    "pratapnagar":      {"name": "Pratapnagar",          "lat": 22.2880, "lon": 73.1850},
    "somatalav":        {"name": "Somatalav",            "lat": 22.3400, "lon": 73.2200},
    "kaladarshan":      {"name": "Kaladarshan",          "lat": 22.3180, "lon": 73.2000},
    "vrundavan":        {"name": "Vrundavan",            "lat": 22.3300, "lon": 73.2100},
    "gidc_makarpura":   {"name": "GIDC Makarpura",       "lat": 22.2650, "lon": 73.1920},
    "jail_road":        {"name": "Jail Road",            "lat": 22.2950, "lon": 73.1900},
    "manjalpur_gam":    {"name": "Manjalpur Gam",        "lat": 22.2780, "lon": 73.1920},
    "tarsali":          {"name": "Tarsali",              "lat": 22.2700, "lon": 73.2050},
    "lalbaug":          {"name": "Lalbaug",              "lat": 22.2830, "lon": 73.1980},
    "maneja":           {"name": "Maneja",               "lat": 22.2600, "lon": 73.2100},
    "susen":            {"name": "Susen",                "lat": 22.2680, "lon": 73.2000},
    "nyaymandir":       {"name": "Nyaymandir",           "lat": 22.3050, "lon": 73.1910},
    "jambuva":          {"name": "Jambuva",              "lat": 22.2750, "lon": 73.1700},
    "kirtistambh":      {"name": "Kirtistambh",          "lat": 22.3065, "lon": 73.1905},
    "radhe_residency":  {"name": "Radhe Residency",      "lat": 22.2550, "lon": 73.2150},
    "tulsidham":        {"name": "Tulsidham",            "lat": 22.2620, "lon": 73.2080},
    "makarpura_gam":    {"name": "Makarpura Gam",        "lat": 22.2700, "lon": 73.1880},
    "sama":             {"name": "Sama",                 "lat": 22.3350, "lon": 73.2100},
    "nizampura":        {"name": "Nizampura",            "lat": 22.3200, "lon": 73.1950},
    "abhilasha":        {"name": "Abhilasha",            "lat": 22.3280, "lon": 73.2000},
    "chhani":           {"name": "Chhani",               "lat": 22.3550, "lon": 73.1750},
    "pandya_hotel":     {"name": "Pandya Hotel",         "lat": 22.3100, "lon": 73.1870},
    "navayard":         {"name": "Navayard",             "lat": 22.3130, "lon": 73.1850},
    "danteshwar":       {"name": "Danteshwar",           "lat": 22.2900, "lon": 73.1750},
    "bhayli":           {"name": "Bhayli / Vasna",       "lat": 22.2950, "lon": 73.1500},
    "shrenikpark":      {"name": "Shrenikpark",          "lat": 22.3000, "lon": 73.1600},
    "diwalipura":       {"name": "Diwalipura",           "lat": 22.3020, "lon": 73.1650},
}

# Driver names for each route
DRIVERS = {
    "1": ("Eldo", "9876543201"),
    "2": ("Abhijeet", "9876543202"),
    "3": ("Aditya", "9876543203"),
    "4B": ("Shyam", "9876543204"),
    "5": ("Hein", "9876543205"),
    "6": ("James", "9876543206"),
    "7": ("Dee", "9876543207"),
    "9A": ("Ravi", "9876543208"),
    "10": ("Kiran", "9876543209"),
    "11": ("Manoj", "9876543210"),
    "12": ("Suresh", "9876543211"),
    "13": ("Vikram", "9876543212"),
    "14": ("Arjun", "9876543213"),
    "15": ("Nikhil", "9876543214"),
    "16": ("Pranav", "9876543215"),
    "17": ("Rohit", "9876543216"),
    "18": ("Sanjay", "9876543217"),
    "19": ("Tushar", "9876543218"),
    "20": ("Yogesh", "9876543219"),
    "23": ("Zain", "9876543220"),
}

PLATE_NUMBERS = {
    "1": "GJ-06-AB-1001", "2": "GJ-06-CD-1002", "3": "GJ-06-EF-1003",
    "4B": "GJ-06-GH-1004", "5": "GJ-06-IJ-1005", "6": "GJ-06-KL-1006",
    "7": "GJ-06-MN-1007", "9A": "GJ-06-OP-1009", "10": "GJ-06-QR-1010",
    "11": "GJ-06-ST-1011", "12": "GJ-06-UV-1012", "13": "GJ-06-WX-1013",
    "14": "GJ-06-YZ-1014", "15": "GJ-06-AB-1015", "16": "GJ-06-CD-1016",
    "17": "GJ-06-EF-1017", "18": "GJ-06-GH-1018", "19": "GJ-06-IJ-1019",
    "20": "GJ-06-KL-1020", "23": "GJ-06-MN-1023",
}

OCCUPANCY_CYCLE = ["empty", "half", "crowded", "empty", "half"]
ROUTES = [
    ("VR1",  "1",  "Tower, Mandvi",         "#2563EB", ["raopura", "jubilee_garden", "tower", "mandvi"]),
    ("VR2",  "2",  "Panigate Tanki",        "#DC2626", ["mandvi", "panigate", "panigate_tanki"]),
    ("VR3",  "3",  "Bapod",                 "#059669", ["tower", "mandvi", "bapod"]),
    ("VR4B", "4B", "Ajwa Garden",           "#7C3AED", ["fatehgunj", "harni", "ajwa_garden"]),
    ("VR5",  "5",  "Kisanwadi",             "#D97706", ["salatwada", "nagarwada", "kisanwadi"]),
    ("VR6",  "6",  "Sangam",                "#0891B2", ["karelibaug", "bright_school", "sangam"]),
    ("VR7",  "7",  "Dabhoi Bypass",         "#BE185D", ["chokhandi", "pratapnagar", "dabhoi_bypass"]),
    ("VR9A", "9A", "Somatalav",             "#4F46E5", ["kaladarshan", "vrundavan", "somatalav"]),
    ("VR10", "10", "GIDC (Makarpura)",       "#15803D", ["jail_road", "manjalpur_gam", "gidc_makarpura"]),
    ("VR11", "11", "Tarsali",               "#B91C1C", ["jail_road", "lalbaug", "tarsali"]),
    ("VR12", "12", "Maneja (via Susen)",     "#1D4ED8", ["jail_road", "susen", "maneja"]),
    ("VR13", "13", "Maneja (via Nyaymandir)","#9333EA", ["tower", "nyaymandir", "maneja"]),
    ("VR14", "14", "Jambuva",               "#C2410C", ["jail_road", "kirtistambh", "jambuva"]),
    ("VR15", "15", "Harni",                 "#0D9488", ["salatwada", "nagarwada", "harni"]),
    ("VR16", "16", "Radhe Residency",       "#6D28D9", ["tulsidham", "radhe_residency"]),
    ("VR17", "17", "Makarpura Gam",         "#EA580C", ["nyaymandir", "pratapnagar", "makarpura_gam"]),
    ("VR18", "18", "Sama",                  "#2563EB", ["nizampura", "abhilasha", "sama"]),
    ("VR19", "19", "Chhani",                "#DC2626", ["pandya_hotel", "navayard", "chhani"]),
    ("VR20", "20", "Danteshwar",            "#059669", ["tower", "mandvi", "chokhandi", "danteshwar"]),
    ("VR23", "23", "Bhayli / Vasna",        "#D97706", ["shrenikpark", "diwalipura", "bhayli"]),
]


class Command(BaseCommand):
    help = "Seed real Vadodara city bus routes"

    def handle(self, *args, **options):
        self.stdout.write("Seeding Vadodara city bus routes...")

        # Create all stops
        stop_objs = {}
        for key, data in STOPS.items():
            obj, _ = Stop.objects.update_or_create(
                stop_id=f"VS_{key}",
                defaults={"name": data["name"], "latitude": data["lat"], "longitude": data["lon"]},
            )
            stop_objs[key] = obj

        route_count = 0
        for route_id, route_no, destination, color, stop_keys in ROUTES:
            # Build description from waypoints
            via = " → ".join(stop_objs[k].name for k in stop_keys)

            # Fetch road geometry
            coords = [(STOPS[k]["lat"], STOPS[k]["lon"]) for k in stop_keys]
            self.stdout.write(f"  Route {route_no}: {destination}...")
            geojson = get_road_route(coords)
            if not geojson:
                geojson = {
                    "type": "LineString",
                    "coordinates": [[STOPS[k]["lon"], STOPS[k]["lat"]] for k in stop_keys],
                }

            route, _ = Route.objects.update_or_create(
                route_id=route_id,
                defaults={
                    "name": f"Route {route_no} — {destination}",
                    "description": via,
                    "color": color,
                    "geojson": geojson,
                },
            )
            for key in stop_keys:
                route.stops.add(stop_objs[key])

            # Create a trip for each route
            trip, _ = Trip.objects.update_or_create(
                trip_id=f"VT_{route_id}",
                defaults={"route": route, "direction": "outbound"},
            )
            for i, key in enumerate(stop_keys):
                hour = 6 + (i * 12) // 60
                minute = (i * 12) % 60
                TripStop.objects.update_or_create(
                    trip=trip, sequence=i + 1,
                    defaults={
                        "stop": stop_objs[key],
                        "arrival_time": f"{hour:02d}:{minute:02d}:00",
                        "departure_time": f"{hour:02d}:{minute + 1:02d}:00",
                    },
                )

            # Create a bus for each route
            driver_name, driver_phone = DRIVERS.get(route_no, ("Driver", ""))
            plate = PLATE_NUMBERS.get(route_no, f"GJ-06-XX-{route_no.zfill(4)}")
            occ = OCCUPANCY_CYCLE[route_count % len(OCCUPANCY_CYCLE)]
            Bus.objects.update_or_create(
                bus_id=f"VBUS-{route_no}",
                defaults={
                    "label": f"Bus {route_no}",
                    "plate_number": plate,
                    "current_trip": trip,
                    "occupancy": occ,
                    "driver_name": driver_name,
                    "driver_phone": driver_phone,
                    "capacity": 40,
                },
            )

            route_count += 1
            time.sleep(0.3)  # Be polite to OSRM

        self.stdout.write(self.style.SUCCESS(
            f"Seeded: {route_count} Vadodara city routes, "
            f"{len(stop_objs)} stops, {route_count} trips, {route_count} buses"
        ))

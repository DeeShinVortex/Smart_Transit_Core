"""Management command to import GTFS data from a zip file."""

from django.core.management.base import BaseCommand
from services.gtfs import import_gtfs


class Command(BaseCommand):
    help = "Import transit data from a GTFS zip file"

    def add_arguments(self, parser):
        parser.add_argument("zip_path", type=str, help="Path to the GTFS zip file")

    def handle(self, *args, **options):
        path = options["zip_path"]
        self.stdout.write(f"Importing GTFS data from {path}...")

        try:
            result = import_gtfs(path)
        except FileNotFoundError:
            self.stderr.write(self.style.ERROR(f"File not found: {path}"))
            return
        except Exception as e:
            self.stderr.write(self.style.ERROR(f"Import failed: {e}"))
            return

        self.stdout.write(self.style.SUCCESS(
            f"Done — {result['routes']} routes, {result['stops']} stops, "
            f"{result['trips']} trips, {result['stop_times']} stop times"
        ))

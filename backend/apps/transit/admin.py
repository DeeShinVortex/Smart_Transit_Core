from django.contrib import admin
from .models import Route, Stop, Trip, TripStop, Bus


@admin.register(Route)
class RouteAdmin(admin.ModelAdmin):
    list_display = ["route_id", "name", "color"]
    search_fields = ["name", "route_id"]


@admin.register(Stop)
class StopAdmin(admin.ModelAdmin):
    list_display = ["stop_id", "name", "latitude", "longitude"]
    search_fields = ["name", "stop_id"]


@admin.register(Trip)
class TripAdmin(admin.ModelAdmin):
    list_display = ["trip_id", "route", "direction", "is_active"]
    list_filter = ["is_active", "direction"]


@admin.register(TripStop)
class TripStopAdmin(admin.ModelAdmin):
    list_display = ["trip", "stop", "sequence", "arrival_time"]
    list_filter = ["trip__route"]


@admin.register(Bus)
class BusAdmin(admin.ModelAdmin):
    list_display = ["bus_id", "label", "current_trip", "occupancy", "is_active"]
    list_filter = ["is_active", "occupancy"]

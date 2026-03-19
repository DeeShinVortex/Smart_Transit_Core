from rest_framework import serializers
from .models import Route, Stop, Trip, TripStop, Bus


class StopSerializer(serializers.ModelSerializer):
    class Meta:
        model = Stop
        fields = ["id", "stop_id", "name", "latitude", "longitude"]


class TripStopSerializer(serializers.ModelSerializer):
    stop = StopSerializer(read_only=True)

    class Meta:
        model = TripStop
        fields = ["id", "stop", "sequence", "arrival_time", "departure_time"]


class TripSerializer(serializers.ModelSerializer):
    trip_stops = TripStopSerializer(many=True, read_only=True)

    class Meta:
        model = Trip
        fields = ["id", "trip_id", "route", "direction", "is_active", "trip_stops"]


class BusSerializer(serializers.ModelSerializer):
    current_trip = TripSerializer(read_only=True)

    class Meta:
        model = Bus
        fields = ["id", "bus_id", "label", "current_trip", "occupancy", "is_active"]


class RouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = ["id", "route_id", "name", "description", "color", "geojson", "stops"]

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
    route_name = serializers.SerializerMethodField()

    class Meta:
        model = Bus
        fields = [
            "id", "bus_id", "label", "plate_number", "current_trip",
            "occupancy", "is_active", "driver_name", "driver_phone",
            "capacity", "route_name",
        ]

    def get_route_name(self, obj):
        if obj.current_trip and obj.current_trip.route:
            return obj.current_trip.route.name
        return None


class RouteSerializer(serializers.ModelSerializer):
    stops = StopSerializer(many=True, read_only=True)

    class Meta:
        model = Route
        fields = ["id", "route_id", "name", "description", "color", "geojson", "stops"]

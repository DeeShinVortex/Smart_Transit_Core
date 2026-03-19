from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Route, Stop, Trip, Bus
from .serializers import (
    RouteSerializer,
    StopSerializer,
    TripSerializer,
    BusSerializer,
)


class RouteViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Route.objects.prefetch_related("stops").all()
    serializer_class = RouteSerializer

    @action(detail=True, methods=["get"])
    def stops(self, request, pk=None):
        route = self.get_object()
        stops = route.stops.all()
        return Response(StopSerializer(stops, many=True).data)


class StopViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Stop.objects.all()
    serializer_class = StopSerializer


class TripViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Trip.objects.filter(is_active=True).prefetch_related(
        "trip_stops__stop"
    )
    serializer_class = TripSerializer


class BusViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Bus.objects.filter(is_active=True).select_related(
        "current_trip__route"
    )
    serializer_class = BusSerializer

    @action(detail=False, methods=["get"])
    def live(self, request):
        """All active buses with merged live location data."""
        from services.cache import get_all_bus_locations

        buses = self.get_queryset()
        locations = get_all_bus_locations()
        result = []
        for bus in buses:
            data = BusSerializer(bus).data
            loc = locations.get(bus.bus_id, {})
            data["latitude"] = loc.get("latitude")
            data["longitude"] = loc.get("longitude")
            data["speed"] = loc.get("speed", 0)
            data["heading"] = loc.get("heading", 0)
            data["live_occupancy"] = loc.get("occupancy", bus.occupancy)
            result.append(data)
        return Response(result)

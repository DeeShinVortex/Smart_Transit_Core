"""Tracking API — GPS webhook & live bus positions."""

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import VehicleLocation
from .serializers import LocationUpdateSerializer
from services.cache import set_bus_location, get_all_bus_locations, get_bus_location
from services.eta import get_next_stop_eta
from apps.transit.models import Bus

# Remove unused import warning — get_next_stop_eta used in BusETAView below


class GPSWebhookView(APIView):
    """
    Receives GPS data from buses (IoT devices).
    POST { vehicle_id, latitude, longitude, speed, heading, occupancy }
    """

    def post(self, request):
        serializer = LocationUpdateSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        data = serializer.validated_data
        vid = data["vehicle_id"]

        # Persist to DB (for history)
        VehicleLocation.objects.create(
            vehicle_id=vid,
            latitude=data["latitude"],
            longitude=data["longitude"],
            speed=data.get("speed", 0),
            heading=data.get("heading", 0),
        )

        # Cache in Redis (for real-time reads)
        cache_data = {
            "vehicle_id": vid,
            "latitude": data["latitude"],
            "longitude": data["longitude"],
            "speed": data.get("speed", 0),
            "heading": data.get("heading", 0),
            "occupancy": data.get("occupancy", "empty"),
        }
        set_bus_location(vid, cache_data)

        # Update bus occupancy in DB if bus exists
        Bus.objects.filter(bus_id=vid).update(occupancy=data.get("occupancy", "empty"))

        # Broadcast to WebSocket clients
        channel_layer = get_channel_layer()
        async_to_sync(channel_layer.group_send)(
            "tracking", {"type": "tracking.update", "data": cache_data}
        )

        return Response({"status": "ok"}, status=status.HTTP_200_OK)


class LiveBusesView(APIView):
    """Returns current positions of all active buses from Redis."""

    def get(self, request):
        locations = get_all_bus_locations()
        return Response(locations)


class BusETAView(APIView):
    """Returns ETA to next stop for a specific bus."""

    def get(self, request, bus_id):
        location = get_bus_location(bus_id)
        if not location:
            return Response(
                {"error": "Bus not found or inactive"},
                status=status.HTTP_404_NOT_FOUND,
            )

        try:
            bus = Bus.objects.select_related("current_trip").get(bus_id=bus_id)
        except Bus.DoesNotExist:
            return Response(
                {"error": "Bus not registered"}, status=status.HTTP_404_NOT_FOUND
            )

        if not bus.current_trip:
            return Response(
                {"error": "Bus has no active trip"}, status=status.HTTP_404_NOT_FOUND
            )

        trip_stops = bus.current_trip.trip_stops.select_related("stop").all()
        eta = get_next_stop_eta(location, trip_stops)

        return Response(
            {
                "bus_id": bus_id,
                "bus_label": bus.label,
                "occupancy": bus.occupancy,
                "next_stop": eta,
            }
        )


class StopProximityView(APIView):
    """Check if any buses are near a specific stop."""

    def get(self, request, stop_id):
        from .notifications import check_bus_proximity

        nearby = check_bus_proximity(stop_id)
        return Response({
            "stop_id": stop_id,
            "nearby_buses": nearby,
            "count": len(nearby),
        })

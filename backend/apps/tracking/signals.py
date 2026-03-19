"""Auto-update triggers for tracking events."""

from django.db.models.signals import post_save
from django.dispatch import receiver
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync

from .models import VehicleLocation
from services.cache import set_bus_location


@receiver(post_save, sender=VehicleLocation)
def broadcast_location_update(sender, instance, created, **kwargs):
    """When a new location is saved, push it to Redis and WebSocket."""
    if not created:
        return

    data = {
        "vehicle_id": instance.vehicle_id,
        "latitude": instance.latitude,
        "longitude": instance.longitude,
        "speed": instance.speed,
        "heading": instance.heading,
    }
    set_bus_location(instance.vehicle_id, data)

    channel_layer = get_channel_layer()
    async_to_sync(channel_layer.group_send)(
        "tracking", {"type": "tracking.update", "data": data}
    )

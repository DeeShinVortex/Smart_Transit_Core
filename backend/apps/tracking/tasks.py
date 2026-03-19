"""Background tasks for tracking — cleanup, reports, etc."""

from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from .models import VehicleLocation


@shared_task
def cleanup_old_locations(days=7):
    """Delete location history older than N days."""
    cutoff = timezone.now() - timedelta(days=days)
    count, _ = VehicleLocation.objects.filter(timestamp__lt=cutoff).delete()
    return f"Deleted {count} old location records"


@shared_task
def generate_daily_report():
    """Generate a summary of daily bus activity."""
    today = timezone.now().date()
    start = timezone.make_aware(timezone.datetime.combine(today, timezone.datetime.min.time()))
    end = start + timedelta(days=1)

    total_updates = VehicleLocation.objects.filter(
        timestamp__gte=start, timestamp__lt=end
    ).count()

    active_buses = (
        VehicleLocation.objects.filter(timestamp__gte=start, timestamp__lt=end)
        .values("vehicle_id")
        .distinct()
        .count()
    )

    return {
        "date": str(today),
        "total_location_updates": total_updates,
        "active_buses": active_buses,
    }

from django.db import models


class Route(models.Model):
    route_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=7, default="#3B82F6")  # hex color for map
    geojson = models.JSONField(
        blank=True, null=True, help_text="GeoJSON LineString for the route path"
    )

    def __str__(self):
        return self.name


class Stop(models.Model):
    stop_id = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    latitude = models.FloatField()
    longitude = models.FloatField()
    routes = models.ManyToManyField(Route, related_name="stops", blank=True)

    def __str__(self):
        return self.name


class Trip(models.Model):
    """A specific journey a bus makes along a route."""

    trip_id = models.CharField(max_length=100, unique=True)
    route = models.ForeignKey(Route, on_delete=models.CASCADE, related_name="trips")
    direction = models.CharField(
        max_length=20,
        choices=[("outbound", "Outbound"), ("inbound", "Inbound")],
        default="outbound",
    )
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.route.name} - {self.trip_id}"


class TripStop(models.Model):
    """Ordered stop within a trip."""

    trip = models.ForeignKey(Trip, on_delete=models.CASCADE, related_name="trip_stops")
    stop = models.ForeignKey(Stop, on_delete=models.CASCADE)
    sequence = models.PositiveIntegerField()
    arrival_time = models.TimeField()
    departure_time = models.TimeField()

    class Meta:
        ordering = ["sequence"]
        unique_together = ["trip", "sequence"]

    def __str__(self):
        return f"{self.trip} → {self.stop.name} (#{self.sequence})"


class Bus(models.Model):
    """Physical bus vehicle."""

    OCCUPANCY_CHOICES = [
        ("empty", "Empty"),
        ("half", "Half-full"),
        ("crowded", "Crowded"),
    ]

    bus_id = models.CharField(max_length=100, unique=True)
    label = models.CharField(max_length=50, help_text="e.g. Bus 42")
    plate_number = models.CharField(max_length=20, blank=True, default="")
    current_trip = models.ForeignKey(
        Trip, on_delete=models.SET_NULL, null=True, blank=True, related_name="buses"
    )
    occupancy = models.CharField(
        max_length=10, choices=OCCUPANCY_CHOICES, default="empty"
    )
    is_active = models.BooleanField(default=True)
    driver_name = models.CharField(max_length=100, blank=True, default="")
    driver_phone = models.CharField(max_length=20, blank=True, default="")
    driver_photo_url = models.URLField(blank=True, default="")
    capacity = models.PositiveIntegerField(default=40)

    def __str__(self):
        return self.label

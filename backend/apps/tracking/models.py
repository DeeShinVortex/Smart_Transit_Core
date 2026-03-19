from django.db import models


class VehicleLocation(models.Model):
    vehicle_id = models.CharField(max_length=100, db_index=True)
    latitude = models.FloatField()
    longitude = models.FloatField()
    speed = models.FloatField(default=0)
    heading = models.FloatField(default=0)
    timestamp = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ["-timestamp"]
        indexes = [
            models.Index(fields=["vehicle_id", "-timestamp"]),
        ]

    def __str__(self):
        return f"{self.vehicle_id} @ {self.latitude},{self.longitude}"

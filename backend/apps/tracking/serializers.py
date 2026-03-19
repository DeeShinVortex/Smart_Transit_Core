from rest_framework import serializers


class LocationUpdateSerializer(serializers.Serializer):
    vehicle_id = serializers.CharField(max_length=100)
    latitude = serializers.FloatField()
    longitude = serializers.FloatField()
    speed = serializers.FloatField(required=False, default=0)
    heading = serializers.FloatField(required=False, default=0)
    occupancy = serializers.ChoiceField(
        choices=["empty", "half", "crowded"], required=False, default="empty"
    )

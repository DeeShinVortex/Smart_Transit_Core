from django.contrib.auth.models import AbstractUser
from django.db import models


class User(AbstractUser):
    """Custom user model for transit tracker."""

    ROLE_CHOICES = [
        ("rider", "Rider"),
        ("operator", "Operator"),
        ("admin", "Admin"),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default="rider")
    favorite_routes = models.ManyToManyField(
        "transit.Route", blank=True, related_name="favorited_by"
    )

    def __str__(self):
        return f"{self.username} ({self.role})"

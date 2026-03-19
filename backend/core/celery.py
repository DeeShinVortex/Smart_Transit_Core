"""Celery configuration for the transit tracker project."""

import os
from celery import Celery

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

app = Celery("transit_tracker")
app.config_from_object("django.conf:settings", namespace="CELERY")
app.autodiscover_tasks()

from django.urls import path
from .views import GPSWebhookView, LiveBusesView, BusETAView, StopProximityView

urlpatterns = [
    path("gps/", GPSWebhookView.as_view(), name="gps-webhook"),
    path("live/", LiveBusesView.as_view(), name="live-buses"),
    path("eta/<str:bus_id>/", BusETAView.as_view(), name="bus-eta"),
    path("proximity/<str:stop_id>/", StopProximityView.as_view(), name="stop-proximity"),
]

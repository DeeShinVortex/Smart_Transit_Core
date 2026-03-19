from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import RouteViewSet, StopViewSet, TripViewSet, BusViewSet

router = DefaultRouter()
router.register("routes", RouteViewSet)
router.register("stops", StopViewSet)
router.register("trips", TripViewSet)
router.register("buses", BusViewSet)

urlpatterns = [
    path("", include(router.urls)),
]

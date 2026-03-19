from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/tracking/", include("apps.tracking.urls")),
    path("api/transit/", include("apps.transit.urls")),
    path("api/accounts/", include("apps.accounts.urls")),
]

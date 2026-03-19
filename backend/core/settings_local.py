"""
Local development settings — SQLite + in-memory channel layer.
No Postgres or Redis required.

Usage: set DJANGO_SETTINGS_MODULE=core.settings_local
"""

from .settings import *  # noqa: F401,F403

# SQLite for local dev
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}

# In-memory channel layer (no Redis needed)
CHANNEL_LAYERS = {
    "default": {
        "BACKEND": "channels.layers.InMemoryChannelLayer",
    }
}

# Disable Celery beat schedule locally
CELERY_BEAT_SCHEDULE = {}
CELERY_TASK_ALWAYS_EAGER = True
CELERY_TASK_EAGER_PROPAGATES = True

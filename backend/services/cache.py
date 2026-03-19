"""
Bus location cache — uses Redis when available, falls back to in-memory dict.
"""

import json
import os

LOCATION_TTL = 120  # seconds

# Try Redis, fall back to in-memory
_use_redis = True
_redis = None
_memory_store = {}

try:
    import redis
    _redis = redis.from_url(os.environ.get("REDIS_URL", "redis://redis:6379/0"))
    _redis.ping()
except Exception:
    _use_redis = False

LOCATION_KEY = "bus:location:{vehicle_id}"
ALL_BUSES_KEY = "bus:active_ids"


def set_bus_location(vehicle_id, data):
    if _use_redis:
        key = LOCATION_KEY.format(vehicle_id=vehicle_id)
        _redis.setex(key, LOCATION_TTL, json.dumps(data))
        _redis.sadd(ALL_BUSES_KEY, vehicle_id)
    else:
        _memory_store[vehicle_id] = data


def get_bus_location(vehicle_id):
    if _use_redis:
        key = LOCATION_KEY.format(vehicle_id=vehicle_id)
        raw = _redis.get(key)
        return json.loads(raw) if raw else None
    else:
        return _memory_store.get(vehicle_id)


def get_all_bus_locations():
    if _use_redis:
        vehicle_ids = _redis.smembers(ALL_BUSES_KEY)
        locations = {}
        for vid in vehicle_ids:
            vid_str = vid.decode() if isinstance(vid, bytes) else vid
            loc = get_bus_location(vid_str)
            if loc:
                locations[vid_str] = loc
            else:
                _redis.srem(ALL_BUSES_KEY, vid_str)
        return locations
    else:
        return dict(_memory_store)

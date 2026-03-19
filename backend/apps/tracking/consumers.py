"""WebSocket handlers for real-time GPS tracking."""

import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
from services.cache import get_all_bus_locations


class TrackingConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.group_name = "tracking"
        await self.channel_layer.group_add(self.group_name, self.channel_name)
        await self.accept()

        # Send current snapshot of all bus locations on connect
        locations = await database_sync_to_async(get_all_bus_locations)()
        await self.send(text_data=json.dumps({
            "type": "snapshot",
            "buses": locations,
        }))

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.group_name, self.channel_name)

    async def receive(self, text_data):
        data = json.loads(text_data)
        await self.channel_layer.group_send(
            self.group_name, {"type": "tracking.update", "data": data}
        )

    async def tracking_update(self, event):
        await self.send(text_data=json.dumps({
            "type": "update",
            "bus": event["data"],
        }))

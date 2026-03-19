# OmniRoute — Vadodara Smart Transit Tracker
## Presentation Notes

### What It Is
Real-time bus tracking system for Vadodara city. Riders see live bus positions on a map, get ETAs, and receive alerts — all updating in real time via WebSockets.

### Tech Stack
- **Backend:** Django + Daphne (ASGI) + Django REST Framework + Channels (WebSocket)
- **Frontend:** React + Leaflet maps + Zustand state + Tailwind CSS
- **Database:** PostgreSQL (Neon cloud)
- **Real-time:** WebSocket via Django Channels (InMemoryChannelLayer for dev)
- **Background tasks:** Celery + Redis (optional for production)
- **Road geometry:** OSRM (free routing API — routes follow real roads)

### Key Features
1. **Live Map** — buses move smoothly along actual road paths, updated every 3 seconds
2. **3 Routes** — City Center Loop, North-South Express, Parul University → Airport Express
3. **5 Buses** — each with driver name, phone, plate number, seat capacity
4. **14 Stops** — real Vadodara locations (Railway Station, Sayajigunj, Alkapuri, Parul University, Airport, etc.)
5. **ETA Calculation** — haversine distance + speed-based time estimate to next stop
6. **Occupancy Status** — empty / half / crowded shown on map and cards
7. **User Auth** — register/login with token-based authentication
8. **Favorite Routes** — riders can save preferred routes
9. **Live Alerts** — auto-generated from bus status (crowded, stopped, on-schedule)
10. **My Location** — GPS button to center map on user's position

### Architecture Flow
```
Bus Simulator → HTTP POST /api/tracking/gps/
    → Save to PostgreSQL (history)
    → Update in-memory cache (live positions)
    → Broadcast via WebSocket → All connected frontends
```

### Demo Credentials
- **Rider:** demo / demo123
- **Admin:** admin / admin123

### API Endpoints
- `GET /api/transit/routes/` — all routes with stops + GeoJSON
- `GET /api/transit/buses/` — all buses with driver details
- `GET /api/tracking/live/` — current positions of all buses
- `GET /api/tracking/eta/<bus_id>/` — ETA to next stop
- `POST /api/tracking/gps/` — GPS webhook (bus simulator uses this)
- `POST /api/accounts/login/` — user authentication

### How to Run

**Important:** Always activate the virtual environment first!

```bash
# Terminal 1 — Backend + Simulator (single command)
cd backend
venv\Scripts\activate
python manage.py runserver_with_sim

# Terminal 2 — Frontend
cd frontend
npm start
```

**Or run them separately:**
```bash
# Terminal 1 — Backend server
cd backend
venv\Scripts\activate
python manage.py runserver

# Terminal 2 — Bus simulator
cd backend
venv\Scripts\activate
python manage.py simulate_buses

# Terminal 3 — Frontend
cd frontend
npm start
```

**Common mistake:** If you see `No module named 'psycopg2'`, you forgot to activate the venv. Run `venv\Scripts\activate` first.

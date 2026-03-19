# Running OmniRoute Locally (Without Docker)

Running the project without Docker means you will need to manually set up and run the dependencies and services. This requires running multiple terminal windows simultaneously.

## Prerequisites

Ensure you have the following installed on your Windows machine:
1. **Python** (3.9 to 3.11 recommended)
2. **Node.js** (v16 or newer) & **npm**
3. **[PostgreSQL](https://www.postgresql.org/download/windows/)**
4. **[Redis](https://github.com/tporadowski/redis/releases)** (Or use Redis within [WSL2](https://learn.microsoft.com/en-us/windows/wsl/))

---

## 1. Setup Environment Variables

In your `.env` file, you must change the Database and Redis URLs to point to your local machine (localhost) instead of the docker containers.

Change these lines:
```env
# Change from 'db' to 'localhost'
DATABASE_URL=postgres://postgres:postgres@localhost:5432/transit

# Change from 'redis' to 'localhost'
REDIS_URL=redis://localhost:6379/0
```
Make sure in PostgreSQL server you create a database named `transit` with user `postgres` and password `postgres` (or adjust the `.env` if you choose a different password).

---

## 2. Start Redis and PostgreSQL
Make sure both the PostgreSQL service and Redis server are running in the background before proceeding.

---

## 3. Setup and Run the Backend (Terminal 1)

Open a new terminal in the `backend` directory.

```bash
# Move to backend directory
cd backend

# Create a virtual environment
python -m venv venv

# Activate the virtual environment (Windows)
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run database migrations
python manage.py migrate

# Start the Django/Daphne server
python manage.py runserver
```
*(The API will be available at `http://localhost:8000/api/`)*

---

## 4. Run the Celery Worker (Terminal 2)

Open a **second** terminal and keep it running for background tasks.

```bash
cd backend
venv\Scripts\activate

# Start the Celery Worker
celery -A core worker -l info --pool=solo
```
*(Note: `--pool=solo` is usually needed for Celery on Windows to work correctly without a workaround).*

---

## 5. Run the Celery Beat (Terminal 3)

Open a **third** terminal and keep it running for scheduled tasks.

```bash
cd backend
venv\Scripts\activate

# Start the Celery Beat scheduler
celery -A core beat -l info
```

---

## 6. Setup and Run the Frontend (Terminal 4)

Open a **fourth** terminal in the `frontend` directory.

```bash
cd frontend

# Install Node dependencies
npm install

# Start the React development server
npm start
```
*(The Frontend application will open at `http://localhost:3000`)*

---

## Summary
You should now have 4 terminals running:
1. Django Server (`runserver`)
2. Celery Worker (`worker`)
3. Celery Beat (`beat`)
4. React Frontend (`npm start`)

You can access your fully local environment at **[http://localhost:3000](http://localhost:3000)**!

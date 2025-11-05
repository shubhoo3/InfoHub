## InfoHub

A simple full‑stack SPA (React + Vite + Express) that integrates:

- Real‑time Weather display
- INR Currency converter (to USD/EUR)
- Motivational quote generator

### Stack

- Frontend: React 18, Vite
- Backend: Node.js, Express, Axios

### Local Setup

1. Install dependencies

```
cd server && npm install
cd ../client && npm install
```

2. Configure environment

Create `server/.env` with:

```
PORT=5000
WEATHER_API_KEY=YOUR_OPENWEATHERMAP_API_KEY
WEATHER_CITY=London
```

You can obtain an API key at: https://openweathermap.org/api

3. Run the backend

```
cd server
npm start
```

Server will run on `http://localhost:5000`.

4. Run the frontend

```
cd client
npm run dev
```

Frontend will open on `http://localhost:5173`. The Vite dev server proxies `/api/*` to the backend.

### API Summary

- `GET /api/quote` → Random quote (uses Quotable with mock fallback)
- `GET /api/weather?city=London` → Simplified weather (requires `WEATHER_API_KEY`)
- `GET /api/currency?amount=100` → Convert INR amount to USD/EUR using exchangerate.host

### Notes

- CORS is enabled on the server. The frontend uses a Vite proxy to `/api` in dev.
- Weather API will return `501` if the `WEATHER_API_KEY` is not configured.

##Screenshots

--WEATHER
<img width="1869" height="946" alt="image" src="https://github.com/user-attachments/assets/bc497ad5-0c67-4024-8a15-519c1d639143" />

--CURRENCY CONVERTER
<img width="1881" height="971" alt="image" src="https://github.com/user-attachments/assets/a7eb8731-0f28-4c7b-b9d1-4ab7ace4a167" />

--QUOTES
<img width="1831" height="917" alt="image" src="https://github.com/user-attachments/assets/02be86f2-7bf5-4149-b2da-6162f95faa10" />

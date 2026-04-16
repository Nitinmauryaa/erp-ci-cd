# College ERP Localhost Setup

This setup runs backend and frontend together on localhost with API integration.

## 1) Backend setup (`/backend`)

1. Copy env:
   - Windows PowerShell:
     - `Copy-Item .env.example .env`
2. Install dependencies:
   - `pip install -r requirements.txt`
3. Start backend:
   - `uvicorn app.main:app --reload --host 0.0.0.0 --port 8000`
4. Check:
   - Root: `http://localhost:8000/`
   - Health: `http://localhost:8000/health`
   - API health: `http://localhost:8000/api/health`

## 2) Frontend setup (`/frontend`)

1. Copy env:
   - Windows PowerShell:
     - `Copy-Item .env.example .env.local`
2. Install dependencies:
   - `npm install`
3. Start frontend:
   - `npm run dev`
4. Open:
   - `http://localhost:3000`

## 3) API contract used by frontend

- Base URL: `NEXT_PUBLIC_API_URL` (default expected: `http://localhost:8000`)
- Versioned routes: `/api/v1/...`
- Auth routes:
  - `POST /api/v1/auth/login`
  - `GET /api/v1/auth/me`
  - `POST /api/v1/auth/refresh`
  - `POST /api/v1/auth/logout`
- Core module routes:
  - `GET /api/v1/students`
  - `GET /api/v1/faculty`
  - `GET /api/v1/departments`

## 4) If login fails

- Ensure `SECRET_KEY` and `ALGORITHM` are set in backend `.env`.
- Ensure backend is running on port `8000`.
- Ensure frontend `.env.local` has `NEXT_PUBLIC_API_URL=http://localhost:8000`.
- Restart both servers after env changes.

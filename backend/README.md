# SBDS Backend — Phase 1

## Setup Instructions

1. Install dependencies:
   ```
   cd backend
   npm install
   ```

2. Create your `.env` file:
   ```
   copy .env.example .env
   ```
   Then open `.env` and fill in:
   - `MONGO_URI` — from MongoDB Atlas (Connect > Drivers)
   - `JWT_SECRET` — any long random string

3. Run in development (auto-restarts on file changes):
   ```
   npm run dev
   ```

4. Confirm it's working by visiting:
   ```
   http://localhost:5000/api/health
   ```
   You should see: `{"status":"ok","message":"SBDS API is running"}`

## What's included in Phase 1

- **Models:** User (donors + recipients), EmergencyRequest, Station
- **Auth:** JWT-based register/login, bcrypt password hashing, protect/adminOnly middleware
- **Donor endpoints:** search/filter directory, availability toggle, admin CNIC verification
- **Emergency endpoints:** create (public + optional auth), list/filter, update status

## API Endpoints Summary

| Method | Endpoint                        | Access        | Purpose                          |
|--------|----------------------------------|---------------|-----------------------------------|
| POST   | /api/auth/register               | Public        | Register donor/recipient          |
| POST   | /api/auth/login                  | Public        | Login, get JWT                    |
| GET    | /api/auth/me                     | Private       | Get own profile                   |
| GET    | /api/donors?bloodGroup=&area=     | Public        | Search/filter donor directory     |
| GET    | /api/donors/:id                  | Public        | Single donor profile              |
| PATCH  | /api/donors/availability          | Private/Donor | Toggle own availability           |
| PATCH  | /api/donors/:id/verify            | Private/Admin | Issue CNIC-verified badge         |
| POST   | /api/emergency                   | Public        | Post emergency request            |
| GET    | /api/emergency?bloodGroup=&urgency=| Public       | View bulletin board                |
| PATCH  | /api/emergency/:id/status         | Private       | Mark fulfilled/expired            |

## Not yet built (upcoming phases)
- Phase 2: React frontend setup
- Phase 3: Peshawar dropdown datasets (areas, BRT stations, hospitals as shared constants)
- Phase 4: Frontend-backend integration, WhatsApp link builder, badge UI

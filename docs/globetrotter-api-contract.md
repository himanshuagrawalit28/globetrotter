# GlobeTrotter — API Contract
**Odoo x LDCE Hackathon 26 | Team RMBH**

> Frontend: fake/dummy data isi shape ka use karo.
> Backend: exact yehi endpoints + response format banao.
> Base URL (local dev): `http://localhost:8000`

---

## 1. Auth

### Signup
`POST /auth/signup`
```json
// Request
{ "email": "user@example.com", "password": "pass123", "name": "Kapil" }

// Response 201
{ "user_id": 1, "email": "user@example.com", "name": "Kapil", "token": "jwt_token_here" }
```

### Login
`POST /auth/login`
```json
// Request
{ "email": "user@example.com", "password": "pass123" }

// Response 200
{ "user_id": 1, "token": "jwt_token_here" }
```
> Frontend: token ko localStorage/context me save karo, har protected request me `Authorization: Bearer <token>` header bhejo.

---

## 2. Trips

### Create Trip
`POST /trips`
```json
// Request
{
  "name": "Goa Trip",
  "start_date": "2026-09-01",
  "end_date": "2026-09-05",
  "description": "Beach vacation",
  "cover_photo_url": null
}

// Response 201
{
  "id": 1,
  "name": "Goa Trip",
  "start_date": "2026-09-01",
  "end_date": "2026-09-05",
  "description": "Beach vacation",
  "cover_photo_url": null,
  "user_id": 1
}
```

### List My Trips
`GET /trips`
```json
// Response 200
[
  {
    "id": 1,
    "name": "Goa Trip",
    "start_date": "2026-09-01",
    "end_date": "2026-09-05",
    "stop_count": 2
  }
]
```

### Get Single Trip (full detail with stops)
`GET /trips/{trip_id}`
```json
// Response 200
{
  "id": 1,
  "name": "Goa Trip",
  "start_date": "2026-09-01",
  "end_date": "2026-09-05",
  "description": "Beach vacation",
  "stops": [
    {
      "id": 10,
      "city": { "id": 5, "name": "Panaji", "country": "India" },
      "start_date": "2026-09-01",
      "end_date": "2026-09-03",
      "activities": [
        { "id": 100, "name": "Beach Walk", "cost": 0, "duration_hours": 2 }
      ]
    }
  ]
}
```

### Update / Delete Trip
`PUT /trips/{trip_id}` — same body as create
`DELETE /trips/{trip_id}` → `204 No Content`

---

## 3. Stops (city + dates inside a trip)

### Add Stop to Trip
`POST /trips/{trip_id}/stops`
```json
// Request
{ "city_id": 5, "start_date": "2026-09-01", "end_date": "2026-09-03" }

// Response 201
{ "id": 10, "trip_id": 1, "city_id": 5, "start_date": "2026-09-01", "end_date": "2026-09-03" }
```

### Remove Stop
`DELETE /trips/{trip_id}/stops/{stop_id}` → `204`

---

## 4. Cities (search)

`GET /cities?search=paris`
```json
// Response 200
[
  { "id": 5, "name": "Panaji", "country": "India", "cost_index": 3, "popularity": 8 },
  { "id": 6, "name": "Paris", "country": "France", "cost_index": 9, "popularity": 10 }
]
```

---

## 5. Activities

### Search/List Activities (optionally by city)
`GET /activities?city_id=5&type=sightseeing`
```json
// Response 200
[
  { "id": 100, "name": "Beach Walk", "type": "sightseeing", "cost": 0, "duration_hours": 2, "description": "..." },
  { "id": 101, "name": "Scuba Diving", "type": "adventure", "cost": 2500, "duration_hours": 3, "description": "..." }
]
```

### Add Activity to a Stop
`POST /trips/{trip_id}/stops/{stop_id}/activities`
```json
// Request
{ "activity_id": 100 }

// Response 201
{ "id": 200, "stop_id": 10, "activity_id": 100 }
```

### Remove Activity from Stop
`DELETE /trips/{trip_id}/stops/{stop_id}/activities/{activity_id}` → `204`

---

## 6. Budget

`GET /trips/{trip_id}/budget`
```json
// Response 200
{
  "trip_id": 1,
  "total_cost": 15000,
  "breakdown": {
    "activities": 5000,
    "stay": 8000,
    "transport": 2000,
    "meals": 0
  },
  "avg_cost_per_day": 3000,
  "days": 5
}
```

---

## Notes for everyone
- Dates always `"YYYY-MM-DD"` string format.
- All error responses: `{ "detail": "error message" }` with proper HTTP status (400/401/404).
- Frontend: build against fake data matching these shapes NOW. Jab backend endpoint ready ho, sirf fetch call plug karo — UI mat todo.
- Backend: field names EXACT yehi rakho (snake_case), warna frontend break hoga.

from fastapi import FastAPI
from app.routers import auth, trips, cities, stops, activities, budget
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI(title="GlobeTrotter API")

app.include_router(auth.router)
app.include_router(trips.router)
app.include_router(cities.router)
app.include_router(stops.router)
app.include_router(activities.router)
app.include_router(budget.router)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # hackathon ke liye simple rakho
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {"message": "GlobeTrotter backend is running"}
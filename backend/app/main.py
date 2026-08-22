from fastapi import FastAPI
from app.routers import auth, trips

app = FastAPI(title="GlobeTrotter API")

app.include_router(auth.router)
app.include_router(trips.router)


@app.get("/")
def root():
    return {"message": "GlobeTrotter backend is running"}
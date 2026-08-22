"""
Run this once to seed sample cities into the database.
Usage: python -m app.seed_cities  (from backend/ folder, venv active)
"""
from app.database import SessionLocal
from app import models

sample_cities = [
    {"name": "Goa", "country": "India", "cost_index": 4, "popularity": 9},
    {"name": "Jaipur", "country": "India", "cost_index": 3, "popularity": 8},
    {"name": "Manali", "country": "India", "cost_index": 3, "popularity": 8},
    {"name": "Mumbai", "country": "India", "cost_index": 6, "popularity": 9},
    {"name": "Paris", "country": "France", "cost_index": 9, "popularity": 10},
    {"name": "Bangkok", "country": "Thailand", "cost_index": 5, "popularity": 9},
    {"name": "Dubai", "country": "UAE", "cost_index": 8, "popularity": 9},
    {"name": "Bali", "country": "Indonesia", "cost_index": 5, "popularity": 9},
]

db = SessionLocal()
try:
    for city in sample_cities:
        exists = db.query(models.City).filter(models.City.name == city["name"]).first()
        if not exists:
            db.add(models.City(**city))
    db.commit()
    print(f"Seeded {len(sample_cities)} cities (skipped duplicates).")
finally:
    db.close()
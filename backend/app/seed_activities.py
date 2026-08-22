"""
Run this once to seed sample activities into the database.
Usage: python -m app.seed_activities (from backend/ folder, venv active)
Run AFTER seed_cities.py since activities reference city_id 1-8.
"""
from app.database import SessionLocal
from app import models

sample_activities = [
    {"name": "Beach Walk", "type": "sightseeing", "cost": 0, "duration_hours": 2, "description": "Relaxing walk on the beach", "city_id": 1},
    {"name": "Scuba Diving", "type": "adventure", "cost": 2500, "duration_hours": 3, "description": "Underwater diving experience", "city_id": 1},
    {"name": "Amber Fort Visit", "type": "sightseeing", "cost": 500, "duration_hours": 3, "description": "Historic fort tour", "city_id": 2},
    {"name": "Local Food Tour", "type": "food", "cost": 800, "duration_hours": 2, "description": "Street food tasting", "city_id": 2},
    {"name": "Paragliding", "type": "adventure", "cost": 3000, "duration_hours": 1, "description": "Paragliding over the valley", "city_id": 3},
    {"name": "River Rafting", "type": "adventure", "cost": 1500, "duration_hours": 2, "description": "White water rafting", "city_id": 3},
    {"name": "Gateway of India Tour", "type": "sightseeing", "cost": 0, "duration_hours": 1, "description": "Iconic monument visit", "city_id": 4},
    {"name": "Eiffel Tower Visit", "type": "sightseeing", "cost": 2000, "duration_hours": 2, "description": "Visit the iconic tower", "city_id": 5},
    {"name": "Floating Market Tour", "type": "sightseeing", "cost": 1000, "duration_hours": 3, "description": "Explore local floating markets", "city_id": 6},
    {"name": "Desert Safari", "type": "adventure", "cost": 4000, "duration_hours": 4, "description": "Dune bashing and camel ride", "city_id": 7},
    {"name": "Rice Terrace Trek", "type": "sightseeing", "cost": 500, "duration_hours": 2, "description": "Scenic trekking experience", "city_id": 8},
]

db = SessionLocal()
try:
    for activity in sample_activities:
        exists = db.query(models.Activity).filter(models.Activity.name == activity["name"]).first()
        if not exists:
            db.add(models.Activity(**activity))
    db.commit()
    print(f"Seeded {len(sample_activities)} activities (skipped duplicates).")
finally:
    db.close()
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app import models
from app.dependencies import get_current_user

router = APIRouter(prefix="/trips", tags=["Budget"])

# Rough per-day estimates used since we don't track real hotel/transport bookings.
# Simple and good enough for a hackathon demo.
STAY_COST_PER_DAY = 1500
TRANSPORT_COST_PER_DAY = 500
MEALS_COST_PER_DAY = 600


@router.get("/{trip_id}/budget")
def get_trip_budget(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    trip = (
        db.query(models.Trip)
        .filter(models.Trip.id == trip_id, models.Trip.user_id == current_user.id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    days = (trip.end_date - trip.start_date).days + 1
    if days < 1:
        days = 1

    # Sum activity costs across all stops in this trip
    stops = db.query(models.Stop).filter(models.Stop.trip_id == trip_id).all()
    activities_total = 0.0
    for stop in stops:
        for link in stop.activities:
            activity = db.query(models.Activity).filter(models.Activity.id == link.activity_id).first()
            if activity:
                activities_total += activity.cost

    stay_total = STAY_COST_PER_DAY * days
    transport_total = TRANSPORT_COST_PER_DAY * days
    meals_total = MEALS_COST_PER_DAY * days

    total_cost = activities_total + stay_total + transport_total + meals_total

    return {
        "trip_id": trip_id,
        "total_cost": total_cost,
        "breakdown": {
            "activities": activities_total,
            "stay": stay_total,
            "transport": transport_total,
            "meals": meals_total,
        },
        "avg_cost_per_day": round(total_cost / days, 2),
        "days": days,
    }
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter(prefix="/trips/{trip_id}/stops", tags=["Stops"])


def _get_owned_trip(trip_id: int, db: Session, current_user: models.User):
    trip = (
        db.query(models.Trip)
        .filter(models.Trip.id == trip_id, models.Trip.user_id == current_user.id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")
    return trip


@router.post("", response_model=schemas.StopOut, status_code=status.HTTP_201_CREATED)
def add_stop(
    trip_id: int,
    stop: schemas.StopCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_trip(trip_id, db, current_user)

    city = db.query(models.City).filter(models.City.id == stop.city_id).first()
    if not city:
        raise HTTPException(status_code=404, detail="City not found")

    new_stop = models.Stop(
        trip_id=trip_id,
        city_id=stop.city_id,
        start_date=stop.start_date,
        end_date=stop.end_date,
    )
    db.add(new_stop)
    db.commit()
    db.refresh(new_stop)
    return new_stop

@router.get("", response_model=List[schemas.StopWithActivities])
def list_stops(
    trip_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_trip(trip_id, db, current_user)
    stops = db.query(models.Stop).filter(models.Stop.trip_id == trip_id).all()
    result = []
    for s in stops:
        activity_ids = [link.activity_id for link in s.activities]
        result.append(schemas.StopWithActivities(
            id=s.id, city_id=s.city_id, start_date=s.start_date,
            end_date=s.end_date, activity_ids=activity_ids
        ))
    return result

@router.delete("/{stop_id}", status_code=status.HTTP_204_NO_CONTENT)
def remove_stop(
    trip_id: int,
    stop_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_trip(trip_id, db, current_user)

    stop = (
        db.query(models.Stop)
        .filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id)
        .first()
    )
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")

    db.delete(stop)
    db.commit()
    return None
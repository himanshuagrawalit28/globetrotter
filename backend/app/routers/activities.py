from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas
from app.dependencies import get_current_user

router = APIRouter(tags=["Activities"])


# ---------- Search/list activities ----------
@router.get("/activities", response_model=List[schemas.ActivityOut])
def list_activities(
    city_id: Optional[int] = Query(None),
    type: Optional[str] = Query(None),
    db: Session = Depends(get_db),
):
    query = db.query(models.Activity)
    if city_id:
        query = query.filter(models.Activity.city_id == city_id)
    if type:
        query = query.filter(models.Activity.type == type)
    return query.all()


# ---------- Add activity to a stop ----------
def _get_owned_stop(trip_id: int, stop_id: int, db: Session, current_user: models.User):
    trip = (
        db.query(models.Trip)
        .filter(models.Trip.id == trip_id, models.Trip.user_id == current_user.id)
        .first()
    )
    if not trip:
        raise HTTPException(status_code=404, detail="Trip not found")

    stop = (
        db.query(models.Stop)
        .filter(models.Stop.id == stop_id, models.Stop.trip_id == trip_id)
        .first()
    )
    if not stop:
        raise HTTPException(status_code=404, detail="Stop not found")
    return stop


@router.post(
    "/trips/{trip_id}/stops/{stop_id}/activities",
    status_code=status.HTTP_201_CREATED,
)
def add_activity_to_stop(
    trip_id: int,
    stop_id: int,
    payload: schemas.StopActivityCreate,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_stop(trip_id, stop_id, db, current_user)

    activity = db.query(models.Activity).filter(models.Activity.id == payload.activity_id).first()
    if not activity:
        raise HTTPException(status_code=404, detail="Activity not found")

    link = models.StopActivity(stop_id=stop_id, activity_id=payload.activity_id)
    db.add(link)
    db.commit()
    db.refresh(link)
    return {"id": link.id, "stop_id": link.stop_id, "activity_id": link.activity_id}


@router.delete(
    "/trips/{trip_id}/stops/{stop_id}/activities/{activity_id}",
    status_code=status.HTTP_204_NO_CONTENT,
)
def remove_activity_from_stop(
    trip_id: int,
    stop_id: int,
    activity_id: int,
    db: Session = Depends(get_db),
    current_user: models.User = Depends(get_current_user),
):
    _get_owned_stop(trip_id, stop_id, db, current_user)

    link = (
        db.query(models.StopActivity)
        .filter(models.StopActivity.stop_id == stop_id, models.StopActivity.activity_id == activity_id)
        .first()
    )
    if not link:
        raise HTTPException(status_code=404, detail="Activity not linked to this stop")

    db.delete(link)
    db.commit()
    return None
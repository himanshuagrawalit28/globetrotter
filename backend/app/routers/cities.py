from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app import models, schemas

router = APIRouter(prefix="/cities", tags=["Cities"])


@router.get("", response_model=List[schemas.CityOut])
def search_cities(search: Optional[str] = Query(None), db: Session = Depends(get_db)):
    query = db.query(models.City)
    if search:
        query = query.filter(models.City.name.ilike(f"%{search}%"))
    return query.all()
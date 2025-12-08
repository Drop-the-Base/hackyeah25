from pydantic import BaseModel
from typing import List, Optional, Dict


class Province(BaseModel):
    id: str
    name: str
    city: str
    slug_name: str


class News(BaseModel):
    id: int
    title: str
    shortcut: str
    content: str
    rso_alarm: str
    rso_icon: Optional[str]
    valid_from: str
    valid_to: str
    repetition: Optional[str]
    longitude: Optional[float]
    latitude: Optional[float]
    water_level_value: Optional[float]
    water_level_warning_status_value: Optional[float]
    water_level_alarm_status_value: Optional[float]
    water_level_trend: Optional[str]
    river_name: str
    location_name: str
    created_at: str
    updated_at: str

    provinces: Dict[str, Province]

    class Config:
        extra = "ignore"


class Pagination(BaseModel):
    totalitems: int
    itemsperpage: int


class Answer(BaseModel):
    pagination: Pagination
    newses: List[News]

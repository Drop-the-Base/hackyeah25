from pydantic import BaseModel
from typing import List, Dict, Optional
from alerts.models import News, Answer
from guides.models import KnowledgeDoc

class IngestDoc(BaseModel):
    id: str
    text: str
    metadata: Optional[Dict] = None


class IngestRequest(BaseModel):
    docs: List[IngestDoc]


class QueryRequest(BaseModel):
    query: str
    k: int = 4


class SourceOut(BaseModel):
    text: str
    metadata: Optional[Dict] = None
    distance: float


class QueryResponse(BaseModel):
    answer: str
    sources: List[SourceOut]
    

class AlertsRequest(BaseModel):
    province: Optional[str] = None     
    alarm_only: Optional[bool] = False 


class AlertResponse(BaseModel):
    total: int
    filtered: int
    items: List[News]
    raw: Answer   
    

class KnowledgeRequest(BaseModel):
    category: Optional[str] = None
    topic: Optional[str] = None


class KnowledgeResponse(BaseModel):
    total: int
    filtered: int
    docs: List[KnowledgeDoc]
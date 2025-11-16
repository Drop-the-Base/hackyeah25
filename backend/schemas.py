from pydantic import BaseModel
from typing import List, Dict, Optional

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
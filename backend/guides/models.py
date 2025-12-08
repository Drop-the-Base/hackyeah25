from pydantic import BaseModel
from typing import Dict


class KnowledgeMetadata(BaseModel):
    category: str
    topic: str
    source: str


class KnowledgeDoc(BaseModel):
    id: str
    text: str
    metadata: KnowledgeMetadata

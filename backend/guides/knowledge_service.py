import json
from typing import List
from guides.models import KnowledgeDoc
from schemas import KnowledgeRequest, KnowledgeResponse

class KnowledgeService:
    def __init__(self):
        self.json_path = "data/knowledge_base.json"

    def load_data(self) -> List[KnowledgeDoc]:
        with open(self.json_path, "r", encoding="utf-8") as f:
            data = json.load(f)
        return [KnowledgeDoc(**doc) for doc in data["docs"]]

    def filter_docs(self, req: KnowledgeRequest) -> KnowledgeResponse:
        docs = self.load_data()

        filtered = docs
        if req.category:
            filtered = [d for d in filtered if d.metadata.category == req.category]

        if req.topic:
            filtered = [d for d in filtered if d.metadata.topic == req.topic]

        return KnowledgeResponse(
            total=len(docs),
            filtered=len(filtered),
            docs=filtered
        )

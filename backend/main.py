from fastapi import FastAPI
from rag.rag_service import RAGService
from pathlib import Path

from schemas import (
IngestRequest, QueryRequest, SourceOut, QueryResponse
)

BASE_DIR = Path(__file__).resolve().parent
SEED_PATH = BASE_DIR / "data" / "knowledge_base.json"




app = FastAPI(title="RAG API", version="1.0.0")
rag_service = RAGService()

@app.on_event("startup")
async def startup_event():
    loaded = rag_service.load_knowledge_from_json(SEED_PATH)
    print(f"[RAG] Startup seed loaded: {loaded} docs")

@app.post("/ingest")
def ingest_docs(payload: IngestRequest):
    docs = [doc.model_dump() for doc in payload.docs]
    rag_service.ingest(docs)
    return {"status": "ok", "ingested": len(docs)}


@app.post("/query", response_model=QueryResponse)
def query_rag(payload: QueryRequest):
    result = rag_service.answer(payload.query, k=payload.k)
    return QueryResponse(
        answer=result["answer"],
        sources=[SourceOut(**s) for s in result["sources"]]
    )

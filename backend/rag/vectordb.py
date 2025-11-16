from typing import List, Dict
import chromadb
from chromadb.config import Settings
from openai import OpenAI

from ..config import (
    GEMINI_API_KEY,
    GEMINI_BASE_URL,
    EMBEDDING_MODEL,
    CHROMA_DIR,
    CHROMA_COLLECTION,
)

client = OpenAI(
    api_key=GEMINI_API_KEY,
    base_url=GEMINI_BASE_URL,
)


def get_embedding(text: str) -> List[float]:
    resp = client.embeddings.create(
        model=EMBEDDING_MODEL,
        input=text,
    )
    return resp.data[0].embedding


class VectorStore:
    def __init__(self):
        self._client = chromadb.PersistentClient(
            path=CHROMA_DIR,
            settings=Settings(),
        )
        self._collection = self._client.get_or_create_collection(
            name=CHROMA_COLLECTION
        )

    def add_documents(self, docs: List[Dict]):
        ids = [d["id"] for d in docs]
        texts = [d["text"] for d in docs]
        metadatas = [d.get("metadata", {}) for d in docs]

        embeddings = [get_embedding(t) for t in texts]

        self._collection.add(
            ids=ids,
            documents=texts,
            metadatas=metadatas,
            embeddings=embeddings,
        )

    def query(self, query_text: str, k: int = 4):
        query_embedding = get_embedding(query_text)
        res = self._collection.query(
            query_embeddings=[query_embedding],
            n_results=k,
        )

        docs = res.get("documents", [[]])[0]
        metadatas = res.get("metadatas", [[]])[0]
        distances = res.get("distances", [[]])[0]

        results = []
        for d, m, dist in zip(docs, metadatas, distances):
            results.append(
                {
                    "text": d,
                    "metadata": m,
                    "distance": dist,
                }
            )
        return results

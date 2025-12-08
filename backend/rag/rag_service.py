from typing import List
from openai import OpenAI
import json

from config import GEMINI_API_KEY, GEMINI_BASE_URL, CHAT_MODEL
from .vectordb import VectorStore
from .models import Answer
from pathlib import Path

client = OpenAI(
    api_key=GEMINI_API_KEY,
    base_url=GEMINI_BASE_URL,
)


class RAGService:
    def __init__(self):
        self.vstore = VectorStore()

    def ingest(self, docs: List[dict]):
        self.vstore.add_documents(docs)

    def load_knowledge_from_json(self, path: str | Path) -> int:
        p = Path(path)
        if not p.exists():
            print(f"[RAG] Knowledge base file not found: {p}")
            return 0

        if not self.vstore.is_empty():
            print(f"[RAG] Skipping knowledge load – collection already has data.")
            return 0

        try:
            with p.open("r", encoding="utf-8") as f:
                data = json.load(f)
        except Exception as e:
            print(f"[RAG] Failed to read knowledge file {p}: {e}")
            return 0

        docs = data.get("docs", [])
        if not isinstance(docs, list) or not docs:
            print(f"[RAG] Knowledge file {p} contains no docs")
            return 0

        self.ingest(docs)
        print(f"[RAG] Loaded {len(docs)} docs from knowledge file {p}")
        return len(docs)

    def answer(self, query: str, k: int = 4) -> dict:
        retrieved = self.vstore.query(query, k=k)

        context_blocks = []
        for i, item in enumerate(retrieved, start=1):
            meta_str = ", ".join(
                f"{key}={value}" for key, value in item.get("metadata", {}).items()
            )
            context_blocks.append(
                f"[Źródło {i} ({meta_str})]\n{item['text']}"
            )

        context = "\n\n".join(context_blocks)

        system_prompt = (
            "Jesteś asystentem RAG. Odpowiadasz WYŁĄCZNIE na podstawie kontekstu.\n"
            "Jeśli odpowiedź nie wynika z kontekstu, napisz, że nie wiesz.\n"
            "Odpowiadasz po polsku.\n"
            "Zwróć wynik TYLKO w formacie JSON zgodnym ze schematem, "
            "który otrzymujesz w parametrze response_format."
        )

        user_prompt = (
            f"Pytanie użytkownika:\n{query}\n\n"
            f"Kontekst z dokumentów:\n{context}\n\n"
            "Na podstawie powyższego kontekstu odpowiedz na pytanie.\n"
            "Pamiętaj: odpowiedź ma być TYLKO w formacie JSON."
        )

        resp = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "rag_answer",
                    "strict": True,
                    "schema": Answer.model_json_schema(),
                },
            },
        )

        raw_content = resp.choices[0].message.content

        try:
            parsed = Answer.model_validate_json(raw_content)
        except Exception:
            parsed = Answer(answer=raw_content, used_source_indexes=[])

        return {
            "answer": parsed.answer,
            "sources": retrieved,
            "used_source_indexes": parsed.used_source_indexes,
        }

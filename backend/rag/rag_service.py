from typing import List
from openai import OpenAI

from ..config import GEMINI_API_KEY, GEMINI_BASE_URL, CHAT_MODEL
from .vectordb import VectorStore


client = OpenAI(
    api_key=GEMINI_API_KEY,
    base_url=GEMINI_BASE_URL,
)


class RAGService:
    def __init__(self):
        self.vstore = VectorStore()

    def ingest(self, docs: List[dict]):
        self.vstore.add_documents(docs)

    def answer(self, query: str, k: int = 4) -> dict:
        retrieved = self.vstore.query(query, k=k)

        context_blocks = []
        for i, item in enumerate(retrieved, start=1):
            meta_str = ", ".join(
                f"{k}={v}" for k, v in item.get("metadata", {}).items()
            )
            context_blocks.append(
                f"[Źródło {i} ({meta_str})]\n{item['text']}"
            )

        context = "\n\n".join(context_blocks)

        system_prompt = (
            "Jesteś asystentem RAG. Odpowiadasz WYŁĄCZNIE na podstawie kontekstu.\n"
            "Jeśli odpowiedź nie wynika z kontekstu, napisz, że nie wiesz.\n"
            "Odpowiadaj po polsku, zwięźle i konkretnie."
        )

        user_prompt = (
            f"Pytanie użytkownika:\n{query}\n\n"
            f"Kontekst z dokumentów:\n{context}\n\n"
            "Na podstawie powyższego kontekstu odpowiedz na pytanie."
        )

        resp = client.chat.completions.create(
            model=CHAT_MODEL,
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
        )

        answer_text = resp.choices[0].message.content

        return {
            "answer": answer_text,
            "sources": retrieved,
        }

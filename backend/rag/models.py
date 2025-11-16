from typing import List
from pydantic import BaseModel, Field


class Answer(BaseModel):
    answer: str = Field(..., description="The final answer for the user in Polish.")
    used_source_indexes: List[int] = Field(
        default_factory=list,
        description="A list of 1-based indexes of the sources used to generate the answer."
    )
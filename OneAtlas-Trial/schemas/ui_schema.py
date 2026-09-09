from pydantic import BaseModel
from typing import List


class PageSchema(BaseModel):
    name: str
    components: List[str]


class UISchema(BaseModel):
    pages: List[PageSchema]
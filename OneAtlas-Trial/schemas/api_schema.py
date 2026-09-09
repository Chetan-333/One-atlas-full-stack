from pydantic import BaseModel
from typing import List


class EndpointSchema(BaseModel):
    path: str
    method: str
    description: str


class APISchema(BaseModel):
    endpoints: List[EndpointSchema]
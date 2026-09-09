from pydantic import BaseModel
from typing import Dict, List


class AuthSchema(BaseModel):
    roles: Dict[str, List[str]]
    
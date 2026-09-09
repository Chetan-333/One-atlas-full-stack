from pydantic import BaseModel
from typing import List, Optional

class IntentSchema(BaseModel):
    app_name: str
    app_type: str
    features: List[str]
    roles: List[str]
    entities: List[str]
    monetization: Optional[str] = None
    
from pydantic import BaseModel
from typing import List, Dict


class DashboardSchema(BaseModel):
    name: str
    access_roles: List[str]


class DesignSchema(BaseModel):
    pages: List[str]
    modules: List[str]
    role_permissions: Dict[str, Dict[str, List[str]]]
    dashboards: List[DashboardSchema]

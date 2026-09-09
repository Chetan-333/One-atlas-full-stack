from pydantic import BaseModel
from typing import List


class ColumnSchema(BaseModel):
    name: str
    type: str


class TableSchema(BaseModel):
    table_name: str
    columns: List[ColumnSchema]


class DatabaseSchema(BaseModel):
    tables: List[TableSchema]
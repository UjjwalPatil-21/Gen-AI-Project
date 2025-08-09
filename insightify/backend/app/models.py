from pydantic import BaseModel

class QueryRequest(BaseModel):
    filename: str
    query: str

from fastapi import FastAPI, File, UploadFile
import shutil
import os

app = FastAPI()

# Create uploads directory if it doesn't exist
UPLOADS_DIR = "uploads"
os.makedirs(UPLOADS_DIR, exist_ok=True)

@app.get("/")
def read_root():
    return {"message": "Welcome to Insightify!"}

from .models import QueryRequest
from .services import get_query_response

@app.post("/uploadfile/")
async def create_upload_file(file: UploadFile = File(...)):
    file_path = os.path.join(UPLOADS_DIR, file.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
    return {"filename": file.filename, "content_type": file.content_type}

@app.post("/query/")
async def query(request: QueryRequest):
    response = get_query_response(request.filename, request.query)
    return response

@app.get("/sample-queries/")
async def sample_queries():
    return {
        "samples": [
            {
                "title": "Total revenue per product",
                "query": "What is the total revenue for each product?",
                "filename": "sales.csv"
            },
            {
                "title": "Revenue trend over time",
                "query": "Show me the trend of revenue over time.",
                "filename": "sales.csv"
            }
        ]
    }

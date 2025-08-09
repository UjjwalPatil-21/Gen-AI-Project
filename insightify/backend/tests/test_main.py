import os
import shutil
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Welcome to Insightify!"}

def test_create_upload_file():
    # Create a dummy file to upload
    file_content = b"col1,col2\n1,2\n3,4"
    file_name = "test.csv"
    with open(file_name, "wb") as f:
        f.write(file_content)

    with open(file_name, "rb") as f:
        response = client.post("/uploadfile/", files={"file": (file_name, f, "text/csv")})

    # Clean up the dummy file
    os.remove(file_name)

    assert response.status_code == 200
    assert response.json() == {"filename": file_name, "content_type": "text/csv"}

    # Check if the file was saved correctly
    saved_file_path = os.path.join("uploads", file_name)
    assert os.path.exists(saved_file_path)

    # Clean up the uploaded file
    os.remove(saved_file_path)

from unittest.mock import patch

@patch("app.main.get_query_response")
def test_query(mock_get_query_response):
    # Set up the mock
    mock_response = {
        "result": "The total of col2 is 6.",
        "visualization": {
            "type": "bar",
            "data": {
                "labels": ["sum"],
                "datasets": [{"label": "total", "data": [6]}],
            },
        },
    }
    mock_get_query_response.return_value = mock_response

    # Define the request payload
    request_payload = {
        "filename": "test.csv",
        "query": "What is the total of col2?"
    }

    # Send the request to the endpoint
    response = client.post("/query/", json=request_payload)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == mock_response

    # Assert that the mocked function was called with the correct arguments
    mock_get_query_response.assert_called_once_with("test.csv", "What is the total of col2?")

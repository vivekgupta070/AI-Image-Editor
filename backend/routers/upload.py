from fastapi import APIRouter, UploadFile, File, HTTPException, Request
import shutil
import os
import uuid

router = APIRouter(
    prefix="/upload",
    tags=["upload"],
)

UPLOAD_DIR = "uploads"
os.makedirs(UPLOAD_DIR, exist_ok=True)

@router.post("/")
async def upload_file(request: Request, file: UploadFile = File(...)):
    try:
        # Generate a unique filename
        file_extension = os.path.splitext(file.filename)[1]
        unique_filename = f"{uuid.uuid4()}{file_extension}"
        file_path = os.path.join(UPLOAD_DIR, unique_filename)
        
        # Save the file locally
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
            
        # Dynamic base URL
        host = request.headers.get("host", "localhost:8000")
        protocol = "https" if request.scope.get("type") == "https" else "http"
        base_url = f"{protocol}://{host}/uploads"
        
        # Return the URL
        return {
            "filename": unique_filename,
            "url": f"{base_url}/{unique_filename}"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

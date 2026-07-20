import os
from dotenv import load_dotenv

# Load environment variables early
load_dotenv(os.path.join(os.path.dirname(__file__), ".env"))

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from . import models, database
from .routers import users, projects, ai

# Create Database Tables
models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="AI Photo Editor API")

# CORS Setup
origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include Routers
app.include_router(users.router)
app.include_router(projects.router)
app.include_router(ai.router)
from .routers import upload
app.include_router(upload.router)

# Mount Static Files (for uploaded images)
# Ensure directory exists
os.makedirs("uploads", exist_ok=True)
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

@app.get("/")
def read_root():
    return {"message": "Welcome to AI Photo Editor API"}

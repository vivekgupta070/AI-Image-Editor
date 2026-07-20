from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

# Image Schemas
class ImageBase(BaseModel):
    url: str
    prompt: Optional[str] = None

class ImageCreate(ImageBase):
    pass

class Image(ImageBase):
    id: int
    project_id: Optional[int] = None
    owner_id: int
    created_at: datetime

    class Config:
        from_attributes = True

# Project Schemas
class ProjectBase(BaseModel):
    title: str
    description: Optional[str] = None

class ProjectCreate(ProjectBase):
    pass

class Project(ProjectBase):
    id: int
    owner_id: int
    created_at: datetime
    updated_at: datetime
    images: List[Image] = []

    class Config:
        from_attributes = True

# User Schemas
class UserBase(BaseModel):
    email: str
    full_name: Optional[str] = None
    profile_image: Optional[str] = None

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    password: str
    is_active: bool
    created_at: datetime
    projects: List[Project] = []

    class Config:
        from_attributes = True

# Auth Schemas
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class UserPasswordUpdate(BaseModel):
    current_password: str
    new_password: str

class UserUpdate(BaseModel):
    full_name: Optional[str] = None
    profile_image: Optional[str] = None

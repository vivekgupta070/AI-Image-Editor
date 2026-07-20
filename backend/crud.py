from sqlalchemy.orm import Session
from typing import Optional
from . import models, schemas, auth

def get_user(db: Session, user_id: int):
    return db.query(models.User).filter(models.User.id == user_id).first()

def get_user_by_email(db: Session, email: str):
    return db.query(models.User).filter(models.User.email == email).first()

def create_user(db: Session, user: schemas.UserCreate):
    password = auth.get_password_hash(user.password)
    db_user = models.User(email=user.email, password=password, full_name=user.full_name, profile_image=user.profile_image)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user

def get_projects(db: Session, user_id: int, skip: int = 0, limit: int = 100):
    return db.query(models.Project).filter(models.Project.owner_id == user_id).offset(skip).limit(limit).all()

def create_project(db: Session, project: schemas.ProjectCreate, user_id: int):
    db_project = models.Project(**project.dict(), owner_id=user_id)
    db.add(db_project)
    db.commit()
    db.refresh(db_project)
    return db_project

def get_project(db: Session, project_id: int):
    return db.query(models.Project).filter(models.Project.id == project_id).first()

def create_image(db: Session, image: schemas.ImageCreate, owner_id: int, project_id: Optional[int] = None):
    db_image = models.Image(**image.dict(), owner_id=owner_id, project_id=project_id)
    db.add(db_image)
    db.commit()
    db.refresh(db_image)
    return db_image

def get_user_images(db: Session, user_id: int, skip: int = 0, limit: int = 50):
    return db.query(models.Image).filter(models.Image.owner_id == user_id).order_by(models.Image.created_at.desc()).offset(skip).limit(limit).all()

def update_user_password(db: Session, user: models.User, new_password: str):
    user.password = auth.get_password_hash(new_password)
    db.commit()
    db.refresh(user)
    db.refresh(user)
    return user
    
def update_user(db: Session, user: models.User, user_update: schemas.UserUpdate):
    if user_update.full_name is not None:
        user.full_name = user_update.full_name
    if user_update.profile_image is not None:
        user.profile_image = user_update.profile_image
    db.commit()
    db.refresh(user)
    return user

def delete_user(db: Session, user: models.User):
    db.delete(user)
    db.commit()
    return {"message": "User deleted successfully"}

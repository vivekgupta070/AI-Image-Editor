from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from .. import crud, models, schemas, database, auth

router = APIRouter(
    prefix="/projects",
    tags=["projects"],
)

@router.post("/", response_model=schemas.Project)
def create_project(project: schemas.ProjectCreate, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    return crud.create_project(db=db, project=project, user_id=current_user.id)

@router.get("/", response_model=List[schemas.Project])
def read_projects(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    projects = crud.get_projects(db, user_id=current_user.id, skip=skip, limit=limit)
    return projects

@router.get("/{project_id}", response_model=schemas.Project)
def read_project(project_id: int, db: Session = Depends(database.get_db), current_user: models.User = Depends(auth.get_current_user)):
    db_project = crud.get_project(db, project_id=project_id)
    if db_project is None:
        raise HTTPException(status_code=404, detail="Project not found")
    if db_project.owner_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to access this project")
    return db_project

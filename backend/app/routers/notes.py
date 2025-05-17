from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from .. import schemas, crud, models
from ..database import get_db

router = APIRouter(prefix="/notes", tags=["notes"])

@router.post("/", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    return crud.create_note(db, note)

@router.get("/", response_model=List[schemas.Note])
def read_notes(tag: Optional[str] = None, keyword: Optional[str] = None, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    notes = crud.get_notes(db, tag=tag, keyword=keyword, skip=skip, limit=limit)
    return notes

@router.get("/{note_id}", response_model=schemas.Note)
def read_note(note_id: int, db: Session = Depends(get_db)):
    note = crud.get_note(db, note_id)
    return note

@router.patch("/{note_id}/link", response_model=schemas.Note)
def link_note(note_id: int, link: schemas.LinkCreate, db: Session = Depends(get_db)):
    crud.create_link(db, note_id, link.target_id)
    return crud.get_note(db, note_id)

@router.get("/graph/", response_model=schemas.Graph)
def get_graph(db: Session = Depends(get_db)):
    return crud.get_graph1(db)
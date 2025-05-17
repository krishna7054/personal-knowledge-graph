from pydantic import BaseModel
from typing import List, Optional, Dict
from datetime import datetime

class TagBase(BaseModel):
    name: str

class TagCreate(TagBase):
    pass

class Tag(TagBase):
    id: int

    class Config:
        from_attributes = True

class NoteBase(BaseModel):
    title: str
    content: Optional[str] = None
    tags: List[str] = []

class NoteCreate(NoteBase):
    pass

class NoteUpdate(NoteBase):
    title: Optional[str] = None

class Note(NoteBase):
    id: int
    created_at: datetime
    tags: List[Tag] = []
    links: List[int] = []
    backlinks: List[int] = []

    class Config:
        from_attributes = True

class LinkCreate(BaseModel):
    target_id: int

class Graph(BaseModel):
    # nodes: List[Note]
    # edges: List[dict]
    adjacency_list: Dict[str, List[str]]
import re
from sqlalchemy.orm import Session
from . import models, schemas
from fastapi import HTTPException

def create_note(db: Session, note: schemas.NoteCreate):
    # Check for existing note
    if db.query(models.Note).filter(models.Note.title == note.title).first():
        raise HTTPException(status_code=400, detail="Note with this title already exists")
    
    # Create note
    db_note = models.Note(title=note.title, content=note.content)
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    
    # Handle tags
    for tag_name in note.tags:
        tag = db.query(models.Tag).filter(models.Tag.name == tag_name.lower()).first()
        if not tag:
            tag = models.Tag(name=tag_name.lower())
            db.add(tag)
            db.commit()
            db.refresh(tag)
        db_note_tag = models.NoteTag(note_id=db_note.id, tag_id=tag.id)
        db.add(db_note_tag)
    
    # Handle [[Linked Note Titles]] in content
    if note.content:
        links = extract_linked_titles(note.content, db)
        for target_title in links:
            target_note = db.query(models.Note).filter(models.Note.title == target_title).first()
            if target_note and target_note.id != db_note.id:
                create_link(db, db_note.id, target_note.id)
    
    db.commit()
    return db_note

def get_notes(db: Session, tag: str = None, keyword: str = None, skip: int = 0, limit: int = 100):
    query = db.query(models.Note)
    if tag:
        query = query.join(models.NoteTag).join(models.Tag).filter(models.Tag.name == tag.lower())
    if keyword:
        query = query.filter(models.Note.title.contains(keyword) | models.Note.content.contains(keyword))
    return query.offset(skip).limit(limit).all()

def get_note(db: Session, note_id: int):
    note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not note:
        raise HTTPException(status_code=404, detail="Note not found")
     # Explicitly populate links and backlinks
    note.links = [link.target_id for link in note.outgoing_links]
    note.backlinks = [link.source_id for link in note.incoming_links]
    return note

def create_link(db: Session, source_id: int, target_id: int):
    if source_id == target_id:
        raise HTTPException(status_code=400, detail="Cannot link note to itself")
    if db.query(models.Link).filter_by(source_id=source_id, target_id=target_id).first():
        raise HTTPException(status_code=400, detail="Link already exists")
    source_note = get_note(db, source_id)
    target_note = get_note(db, target_id)
    db_link = models.Link(source_id=source_id, target_id=target_id)
    db.add(db_link)
    db.commit()
    return db_link

def get_graph1(db: Session):
    # notes = db.query(models.Note).all()
    # edges = db.query(models.Link).all()
    # edge_list = [{"source": edge.source_id, "target": edge.target_id} for edge in edges]
    # return {
    #     "nodes": notes, 
    #     "edges": edge_list}
        # Fetch all notes
    notes = db.query(models.Note).all()
    # Create a dictionary to store the adjacency list
    adjacency_list = {note.title: [] for note in notes}
    # Fetch all links
    links = db.query(models.Link).all()
    # Map note IDs to titles for quick lookup
    id_to_title = {note.id: note.title for note in notes}
    # Populate the adjacency list
    for link in links:
        source_title = id_to_title.get(link.source_id)
        target_title = id_to_title.get(link.target_id)
        if source_title and target_title:
            adjacency_list[source_title].append(target_title)
    return {"adjacency_list": adjacency_list}

def extract_linked_titles(content: str, db: Session):
    pattern = r'\[\[(.*?)\]\]'
    matches = re.findall(pattern, content)
    return [match for match in matches if db.query(models.Note).filter(models.Note.title == match).first()]
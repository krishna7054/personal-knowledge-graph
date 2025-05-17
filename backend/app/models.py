from sqlalchemy import Column, Integer, Text, String, ForeignKey, DateTime
from sqlalchemy.orm import relationship
from .database import Base
from datetime import datetime

class Note(Base):
    __tablename__ = "notes"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, nullable=False)
    content = Column(Text)
    created_at = Column(DateTime, default=datetime.utcnow)
    tags = relationship("Tag", secondary="note_tags", back_populates="notes")
    outgoing_links = relationship(
        "Link", foreign_keys="[Link.source_id]", back_populates="source_note"
    )
    incoming_links = relationship(
        "Link", foreign_keys="[Link.target_id]", back_populates="target_note"
    )

class Link(Base):
    __tablename__ = "links"
    source_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True)
    target_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True)
    source_note = relationship("Note", foreign_keys=[source_id], back_populates="outgoing_links")
    target_note = relationship("Note", foreign_keys=[target_id], back_populates="incoming_links")

class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)
    notes = relationship("Note", secondary="note_tags", back_populates="tags")

class NoteTag(Base):
    __tablename__ = "note_tags"
    note_id = Column(Integer, ForeignKey("notes.id", ondelete="CASCADE"), primary_key=True)
    tag_id = Column(Integer, ForeignKey("tags.id", ondelete="CASCADE"), primary_key=True)
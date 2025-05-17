from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routers import notes
from .database import engine
from . import models

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Personal Knowledge Graph System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(notes.router)

@app.get("/")
def read_root():
    return {"message": "Personal Knowledge Graph System"}
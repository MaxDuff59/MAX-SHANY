import os
import uuid
from datetime import date
from typing import Optional, Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from database import supabase

load_dotenv()

app = FastAPI(title="Max & Shany API")

frontend_origin = os.environ.get("FRONTEND_ORIGIN", "http://localhost:5173")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[frontend_origin, "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ---------- Schémas ----------

class CourseCreate(BaseModel):
    text: str


class CourseUpdate(BaseModel):
    text: Optional[str] = None
    checked: Optional[bool] = None


class TodoCreate(BaseModel):
    text: str
    due_date: Optional[date] = None
    priority: Literal["basse", "normale", "haute"] = "normale"


class TodoUpdate(BaseModel):
    text: Optional[str] = None
    done: Optional[bool] = None
    due_date: Optional[date] = None
    priority: Optional[Literal["basse", "normale", "haute"]] = None


# ---------- Routes de base ----------

@app.get("/")
def root():
    return {"status": "ok", "app": "Max & Shany"}


# ---------- Routes Courses ----------

@app.get("/courses")
def list_courses():
    res = supabase.table("courses").select("*").order("created_at").execute()
    return res.data


@app.post("/courses", status_code=201)
def create_course(course: CourseCreate):
    res = supabase.table("courses").insert({"text": course.text}).execute()
    return res.data[0]


@app.patch("/courses/{course_id}")
def update_course(course_id: uuid.UUID, course: CourseUpdate):
    payload = {k: v for k, v in course.model_dump().items() if v is not None}
    if not payload:
        raise HTTPException(400, "Aucune donnée à mettre à jour")
    res = supabase.table("courses").update(payload).eq("id", str(course_id)).execute()
    if not res.data:
        raise HTTPException(404, "Course introuvable")
    return res.data[0]


@app.delete("/courses/{course_id}", status_code=204)
def delete_course(course_id: uuid.UUID):
    supabase.table("courses").delete().eq("id", str(course_id)).execute()
    return None


# ---------- Routes Todos ----------

@app.get("/todos")
def list_todos():
    res = supabase.table("todos").select("*").order("due_date").execute()
    return res.data


@app.post("/todos", status_code=201)
def create_todo(todo: TodoCreate):
    payload = {
        "text": todo.text,
        "priority": todo.priority,
        "due_date": todo.due_date.isoformat() if todo.due_date else None,
    }
    res = supabase.table("todos").insert(payload).execute()
    return res.data[0]


@app.patch("/todos/{todo_id}")
def update_todo(todo_id: uuid.UUID, todo: TodoUpdate):
    payload = {k: v for k, v in todo.model_dump().items() if v is not None}
    if "due_date" in payload and payload["due_date"] is not None:
        payload["due_date"] = payload["due_date"].isoformat()
    if not payload:
        raise HTTPException(400, "Aucune donnée à mettre à jour")
    res = supabase.table("todos").update(payload).eq("id", str(todo_id)).execute()
    if not res.data:
        raise HTTPException(404, "Tâche introuvable")
    return res.data[0]


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: uuid.UUID):
    supabase.table("todos").delete().eq("id", str(todo_id)).execute()
    return None

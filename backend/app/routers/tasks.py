from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List
from app.database import get_pg_connection

router = APIRouter(
    prefix="/tasks",
    tags=["Tasks"]
)

class TaskCreate(BaseModel):
    description: str

class TaskUpdate(BaseModel):
    is_completed: bool

class TaskResponse(BaseModel):
    id: int
    description: str
    is_completed: bool



@router.get("", response_model=List[TaskResponse])
async def get_tasks():
    """Fetch all tasks from the database."""
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cur.execute("SELECT id, description, is_completed FROM tasks ORDER BY created_at DESC;")
        rows = cur.fetchall()
        
        tasks = [
            {"id": r[0], "description": r[1], "is_completed": r[2]} 
            for r in rows
        ]
        
        cur.close()
        conn.close()
        return tasks
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {e}")

@router.post("", response_model=TaskResponse)
async def create_task(task: TaskCreate):
    """Add a new task to the list."""
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cur.execute(
            "INSERT INTO tasks (description) VALUES (%s) RETURNING id, description, is_completed;",
            (task.description,)
        )
        new_task = cur.fetchone()
        conn.commit()
        
        response = {
            "id": new_task[0],
            "description": new_task[1],
            "is_completed": new_task[2]
        }
        
        cur.close()
        conn.close()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to create task: {e}")

@router.patch("/{task_id}", response_model=TaskResponse)
async def toggle_task_status(task_id: int, task_update: TaskUpdate):
    """Update the status of a task (Check/Uncheck)."""
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cur.execute(
            "UPDATE tasks SET is_completed = %s WHERE id = %s RETURNING id, description, is_completed;",
            (task_update.is_completed, task_id)
        )
        updated_task = cur.fetchone()
        
        if not updated_task:
            raise HTTPException(status_code=404, detail="Task not found")
            
        conn.commit()
        cur.close()
        conn.close()
        
        return {
            "id": updated_task[0],
            "description": updated_task[1],
            "is_completed": updated_task[2]
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to update task: {e}")

@router.delete("/{task_id}")
async def delete_task(task_id: int):
    """Remove a task from the database."""
    try:
        conn = get_pg_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM tasks WHERE id = %s;", (task_id,))
        conn.commit()
        cur.close()
        conn.close()
        return {"message": "Task deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to delete task: {e}")
import uuid
from fastapi import APIRouter, HTTPException, UploadFile, File
from pydantic import BaseModel
from typing import List, Dict

# Import your centralized database helpers
from app.database import get_pg_connection, get_mongo_client

# from app.services.pdf_parser import extract_text_from_pdf

router = APIRouter(
    prefix="/projects",
    tags=["Projects"]
)

# --- 1. SCHEMAS ---
class ProjectCreate(BaseModel):
    name: str
    type: str
    status: str = "Pending"
    description: str = ""

class ProjectResponse(BaseModel):
    id: str
    name: str
    type: str
    status: str

class ProjectSummary(BaseModel):
    """Specific for the Dashboard Table"""
    name: str
    type: str
    status: str



@router.get("/stats", response_model=Dict[str, int])
async def get_dashboard_stats():
    """Fetches counts for 'Done', 'In Process', and 'Pending' for the Dashboard cards."""
    try:
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        cur.execute("SELECT status, COUNT(*) FROM projects GROUP BY status;")
        rows = cur.fetchall()
        
        # Default counts to 0
        stats = {"Done": 0, "In Process": 0, "Pending": 0}
        for status, count in rows:
            if status in stats:
                stats[status] = count
                
        cur.close()
        pg_conn.close()
        return stats
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to fetch stats: {e}")

@router.get("/summary", response_model=List[ProjectSummary])
async def list_project_summaries():
    """Lightweight endpoint for the Dashboard project list."""
    try:
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        cur.execute("SELECT name, type, status FROM projects ORDER BY created_at DESC;")
        rows = cur.fetchall()
        
        projects = [{"name": r[0], "type": r[1], "status": r[2]} for r in rows]
        
        cur.close()
        pg_conn.close()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("", response_model=ProjectResponse)
async def create_project(project: ProjectCreate):
    """Creates a new project and initializes it in both PG and Mongo."""
    shared_id = str(uuid.uuid4())
    try:
        # Save Metadata to PostgreSQL
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        cur.execute(
            "INSERT INTO projects (id, name, type, status) VALUES (%s, %s, %s, %s);",
            (shared_id, project.name, project.type, project.status)
        )
        pg_conn.commit()
        cur.close()
        pg_conn.close()

        # Initialize Document entry in MongoDB
        mg_client = get_mongo_client()
        mg_db = mg_client["legallens_docs"]
        mg_collection = mg_db["project_contents"]
        mg_collection.insert_one({
            "project_id": shared_id,
            "full_text": project.description,
            "filename": None,
            "analysis": {}
        })
        mg_client.close()

        return {**project.dict(), "id": shared_id}
    except Exception as e:
        print(f"Error creating project: {e}")
        raise HTTPException(status_code=500, detail="Failed to create project")

@router.get("", response_model=List[ProjectResponse])
async def list_projects():
    """Retrieves all projects (Legacy endpoint)."""
    try:
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        cur.execute("SELECT id, name, type, status FROM projects ORDER BY created_at DESC;")
        rows = cur.fetchall()
        
        projects = [{"id": str(r[0]), "name": r[1], "type": r[2], "status": r[3]} for r in rows]
        
        cur.close()
        pg_conn.close()
        return projects
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# --- 4. PDF UPLOAD (COMMENTED OUT) ---

"""
@router.post("/{project_id}/upload")
async def upload_document(project_id: str, file: UploadFile = File(...)):
    # This remains inactive until extract_text_from_pdf is ready
    pass
"""
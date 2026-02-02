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
@router.get("/analytics-list")
async def get_analytics_project_list():
    """
    Fetches projects with the count of associated offers 
    specifically for the Analytics dashboard.
    """
    try:
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        
        # We join projects with appels_offres to count the candidates per project
        query = """
            SELECT 
                p.id, 
                p.name, 
                p.created_at, 
                COUNT(a.id) as candidates_count
            FROM projects p
            LEFT JOIN appels_offres a ON p.id = a.project_id
            GROUP BY p.id, p.name, p.created_at
            ORDER BY p.created_at DESC;
        """
        cur.execute(query)
        rows = cur.fetchall()
        
        results = []
        for r in rows:
            results.append({
                "id": str(r[0]),
                "name": r[1],
                "date": r[2].strftime("%Y-%m-%d") if r[2] else "N/A",
                "candidates": r[3]
            })
            
        cur.close()
        pg_conn.close()
        return results
    except Exception as e:
        print(f"Database Error: {e}")
        raise HTTPException(status_code=500, detail="Could not fetch analytics list")
    
@router.get("/{project_id}/offers")
async def get_project_offers(project_id: str):
    try:
        pg_conn = get_pg_connection()
        cur = pg_conn.cursor()
        cur.execute("""
            SELECT id, offre_reference, status 
            FROM appels_offres 
            WHERE project_id = %s
        """, (project_id,))
        rows = cur.fetchall()
        cur.close()
        pg_conn.close()
        
        return [{"id": str(r[0]), "offre_reference": r[1], "status": r[2]} for r in rows]
    except Exception as e:
        return []

"""
@router.post("/{project_id}/upload")
async def upload_document(project_id: str, file: UploadFile = File(...)):
    # This remains inactive until extract_text_from_pdf is ready
    pass
"""
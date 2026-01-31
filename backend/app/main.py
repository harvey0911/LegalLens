from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from app.routers import projects  # Import your new logic module

# Initialize environment variables
load_dotenv()

app = FastAPI(title="LegalLens API", version="1.0.0")

# --- 1. GLOBAL MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 2. INCLUDE ROUTERS (The "Office" assignments) ---
# This tells FastAPI: "Any request starting with /projects, send it to projects.py"
app.include_router(projects.router)

# --- 3. GLOBAL SYSTEM ROUTES ---
@app.get("/")
def health_check():
    return {"status": "online", "message": "LegalLens Backend is active"}



# import uuid
# import os
# from fastapi import FastAPI, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from pydantic import BaseModel
# from pymongo import MongoClient
# from dotenv import load_dotenv

# # Import the PG connection helper we added to your database.py
# from app.database import get_pg_connection

# load_dotenv()

# app = FastAPI(title="LegalLens API")

# # --- 1. CORS CONFIGURATION ---
# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# # --- 2. MONGO CONNECTION HELPER ---
# def get_mongo_client():
#     mongo_uri = os.getenv("MONGO_URI", "mongodb://user_admin:password123@127.0.0.1:27017")
#     return MongoClient(mongo_uri)

# # --- 3. DATA MODELS (Pydantic) ---
# class ProjectCreate(BaseModel):
#     name: str
#     type: str
#     status: str = "In Process"
#     description: str = "" # This will go to MongoDB

# # --- 4. ENDPOINTS ---

# @app.post("/projects")
# async def create_project(project: ProjectCreate):
#     # Step A: Generate the Shared UUID
#     shared_id = str(uuid.uuid4())
    
#     try:
#         # Step B: Save Metadata to PostgreSQL
#         pg_conn = get_pg_connection()
#         cur = pg_conn.cursor()
        
#         pg_query = """
#             INSERT INTO projects (id, name, type, status) 
#             VALUES (%s, %s, %s, %s) RETURNING id;
#         """
#         cur.execute(pg_query, (shared_id, project.name, project.type, project.status))
#         pg_conn.commit()
#         cur.close()
#         pg_conn.close()

#         # Step C: Save Heavy Description/Text to MongoDB
#         mg_client = get_mongo_client()
#         mg_db = mg_client["legallens_docs"]
#         mg_collection = mg_db["project_contents"]
        
#         mg_collection.insert_one({
#             "project_id": shared_id, # The Link
#             "full_text": project.description,
#             "analysis": {} # Placeholder for future AI results
#         })
#         mg_client.close()

#         return {"id": shared_id, "status": "Success", "message": "Project synced across PG and Mongo"}

#     except Exception as e:
#         print(f"Error: {e}")
#         raise HTTPException(status_code=500, detail="Internal Server Error")

# @app.get("/projects")
# async def list_projects():
#     try:
#         pg_conn = get_pg_connection()
#         cur = pg_conn.cursor()
#         # Fetching our new UUID based projects
#         cur.execute("SELECT id, name, type, status FROM projects ORDER BY created_at DESC;")
#         rows = cur.fetchall()
        
#         projects = []
#         for row in rows:
#             projects.append({
#                 "id": str(row[0]), # Convert UUID to string for JSON
#                 "name": row[1],
#                 "type": row[2],
#                 "status": row[3]
#             })
        
#         cur.close()
#         pg_conn.close()
#         return projects
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=str(e))

# @app.get("/")
# def read_root():
#     return {"message": "LegalLens API is active"}

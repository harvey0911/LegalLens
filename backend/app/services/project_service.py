# backend/app/services/project_service.py
import uuid
from app.database import get_pg_connection, get_mongo_client # You'll need to add these helpers

def create_full_project(project_name, project_type, raw_pdf_text):
    # 1. Generate the Shared ID
    # We use this to link the "Metadata" (Postgres) and "Text" (Mongo)
    shared_id = str(uuid.uuid4()) 

    # 2. Save Metadata to Postgres
    pg_conn = get_pg_connection()
    cur = pg_conn.cursor()
    cur.execute(
        "INSERT INTO projects (id, name, type, status) VALUES (%s, %s, %s, %s)",
        (shared_id, project_name, project_type, 'In Process')
    )
    pg_conn.commit()

    # 3. Save Text to MongoDB
    mg_client = get_mongo_client()
    db = mg_client["legallens_docs"]
    db.contents.insert_one({
        "project_id": shared_id,  # This links it back to Postgres
        "full_text": raw_pdf_text
    })
    
    return shared_id
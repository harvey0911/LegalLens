import psycopg2
import os
from dotenv import load_dotenv

# Load variables from .env file
load_dotenv()

def init_db():
    try:
        conn = psycopg2.connect(
            host=os.getenv("PG_HOST", "127.0.0.1"),
            database=os.getenv("PG_DB", "legallens_metadata"),
            user=os.getenv("PG_USER", "user_admin"),
            password=os.getenv("PG_PASSWORD", "password123")
        )
        cur = conn.cursor()
        
        # Reset for testing - Added 'cases' to ensure your DB stays clean
        cur.execute("DROP TABLE IF EXISTS reports, appels_offres, projects, cases CASCADE;")
        
        # 1. Projects Table (Changed id to UUID)
        cur.execute("""
            CREATE TABLE projects (
                id UUID PRIMARY KEY, 
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) CHECK (type IN (
                    'Marchés de Travaux', 
                    'Marchés de Services', 
                    'Marchés de Fournitures'
                )),
                status VARCHAR(20) CHECK (status IN ('Done', 'Pending', 'In Process')) DEFAULT 'Pending',
                cps_file_reference TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        """)

        # 2. Appels d'Offres Table (project_id changed to UUID)
        cur.execute("""
            CREATE TABLE appels_offres (
                id SERIAL PRIMARY KEY,
                project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
                offre_reference TEXT NOT NULL,
                status VARCHAR(20) CHECK (status IN ('accepted', 'rejected', 'pending')) DEFAULT 'pending'
            );
        """)

        # 3. Reports Table (project_id changed to UUID)
        cur.execute("""
            CREATE TABLE reports (
                id SERIAL PRIMARY KEY,
                project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
                report_name VARCHAR(255),
                date_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                report_reference TEXT,
                cps_reference TEXT
            );
        """)
        
        conn.commit()
        cur.close()
        conn.close()
        print("✅ Database initialized! Schema now supports UUID synchronization.")

    except Exception as e:
        print(f"❌ Connection Failed: {e}")

# Helper functions for other parts of your app
def get_pg_connection():
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        database=os.getenv("PG_DB", "legallens_metadata"),
        user=os.getenv("PG_USER", "user_admin"),
        password=os.getenv("PG_PASSWORD", "password123")
    )

if __name__ == "__main__": 
    init_db()
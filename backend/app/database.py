import psycopg2
import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load variables from .env file
load_dotenv()

# --- 1. INITIALIZATION LOGIC (PostgreSQL Schema) ---

def init_db():
    """Initializes the PostgreSQL database schema and tables."""
    try:
        conn = psycopg2.connect(
            host=os.getenv("PG_HOST", "127.0.0.1"),
            database=os.getenv("PG_DB", "legallens_metadata"),
            user=os.getenv("PG_USER", "user_admin"),
            password=os.getenv("PG_PASSWORD", "password123")
        )
        cur = conn.cursor()
        
        # Reset for testing - Cleans up existing tables
        cur.execute("DROP TABLE IF EXISTS reports, appels_offres, projects, cases CASCADE;")
        
        # 1. Projects Table (Using UUID for shared reference with MongoDB)
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

        # 2. Appels d'Offres Table
        cur.execute("""
            CREATE TABLE appels_offres (
                id SERIAL PRIMARY KEY,
                project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
                offre_reference TEXT NOT NULL,
                status VARCHAR(20) CHECK (status IN ('accepted', 'rejected', 'pending')) DEFAULT 'pending'
            );
        """)

        # 3. Reports Table
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

# --- 2. HELPER FUNCTIONS (Connection Getters) ---

def get_pg_connection():
    """Returns a connection object for PostgreSQL."""
    return psycopg2.connect(
        host=os.getenv("PG_HOST", "127.0.0.1"),
        database=os.getenv("PG_DB", "legallens_metadata"),
        user=os.getenv("PG_USER", "user_admin"),
        password=os.getenv("PG_PASSWORD", "password123")
    )

def get_mongo_client():
    """Returns a MongoClient object for MongoDB."""
    # Note: Using 127.0.0.1 for local dev, ensure it matches your docker-compose exposed port
    mongo_uri = os.getenv(
        "MONGO_URI", 
        "mongodb://user_admin:password123@127.0.0.1:27017/?authSource=admin"
    )
    return MongoClient(mongo_uri)

# This allows you to run 'python app/database.py' to reset your DB
if __name__ == "__main__": 
    init_db()
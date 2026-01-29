import os
from dotenv import load_dotenv
import psycopg2
from pymongo import MongoClient

# Look 2 levels up for the .env file in the root LegalLens folder
load_dotenv(dotenv_path="../../.env")

# --- POSTGRESQL ---
def get_pg_connection():
    return psycopg2.connect(
        host="localhost",
        database=os.getenv("PG_DB"),
        user=os.getenv("PG_USER"),
        password=os.getenv("PG_PASSWORD")
    )

# --- MONGODB ---
def get_mongo_client():
    user = os.getenv("MONGO_USER")
    pw = os.getenv("MONGO_PASSWORD")
    uri = f"mongodb://{user}:{pw}@localhost:27017"
    return MongoClient(uri)

if __name__ == "__main__":
    # This part only runs if you run THIS file directly to test
    try:
        pg = get_pg_connection()
        mg = get_mongo_client()
        mg.admin.command('ping') # Test if Mongo is actually alive
        print("✅ Both databases are securely connected!")
    except Exception as e:
        print(f"❌ Connection failed: {e}")
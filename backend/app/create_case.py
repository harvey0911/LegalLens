import uuid
from database import get_pg_connection, get_mongo_client

def create_legal_case(case_name, lawyer_name, raw_text):
    case_id = str(uuid.uuid4()) # Generate a unique ID for both DBs
    
    # 1. Save Metadata to Postgres
    pg_conn = get_pg_connection()
    cur = pg_conn.cursor()
    # Let's create the table if it doesn't exist
    cur.execute("""
        CREATE TABLE IF NOT EXISTS cases (
            id UUID PRIMARY KEY,
            name VARCHAR(255),
            lawyer VARCHAR(255)
        )
    """)
    cur.execute("INSERT INTO cases (id, name, lawyer) VALUES (%s, %s, %s)", 
                (case_id, case_name, lawyer_name))
    pg_conn.commit()
    cur.close()
    pg_conn.close()

    # 2. Save Heavy Text to MongoDB
    mg_client = get_mongo_client()
    db = mg_client["legallens_docs"]
    collection = db["case_contents"]
    collection.insert_one({
        "case_id": case_id,
        "full_text": raw_text,
        "summary": "AI summary goes here later..."
    })
    mg_client.close()

    print(f"🚀 Success! Case created with ID: {case_id}")

if __name__ == "__main__":
    create_legal_case("Smith vs. Doe", "M. Lawyer", "This is the very long legal text from a PDF...")
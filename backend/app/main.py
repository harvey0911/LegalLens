from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from contextlib import asynccontextmanager

# Import your initialization logic and routers
from app.database import init_db 
from app.routers import projects, tasks

# Initialize environment variables
load_dotenv()

# --- 1. LIFESPAN HANDLER ---
# This ensures init_db() runs every time the server starts
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("🔍 Initializing Database...")
    try:
        init_db()
        print("✅ All tables verified/created.")
    except Exception as e:
        print(f"❌ Database initialization failed: {e}")
    yield

# Initialize FastAPI with the lifespan handler
app = FastAPI(
    title="LegalLens API", 
    version="1.0.0",
    lifespan=lifespan
)

# --- 2. GLOBAL MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- 3. INCLUDE ROUTERS ---
app.include_router(projects.router)
app.include_router(tasks.router)

# --- 4. GLOBAL SYSTEM ROUTES ---
@app.get("/")
def health_check():
    return {
        "status": "online", 
        "message": "LegalLens Backend is active",
        "active_modules": ["projects", "tasks"]
    }
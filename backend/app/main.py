from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.core.database import engine, Base
from app.api import auth, trades, announcements, portfolio

# Create database tables (skip if connection fails, e.g., during testing)
try:
    Base.metadata.create_all(bind=engine)
except Exception as e:
    print(f"Warning: Could not create database tables: {e}")

# Initialize FastAPI app
app = FastAPI(
    title="Crypto Cartel Transparency Platform API",
    description="Backend API for institutional crypto portfolio management and transparency",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ALLOWED_ORIGINS == "*" else settings.cors_origins,
    allow_credentials=False if settings.ALLOWED_ORIGINS == "*" else True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allow_headers=["*"],
    expose_headers=["*"],
    max_age=3600,
)

# Include routers
app.include_router(auth.router)
app.include_router(trades.router)
app.include_router(announcements.router)
app.include_router(portfolio.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Crypto Cartel Transparency Platform API",
        "version": "1.0.0",
        "status": "operational"
    }


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)

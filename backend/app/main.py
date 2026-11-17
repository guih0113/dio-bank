import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.routes import router as api_router

app = FastAPI(
    title="DIO Bank - Open Finance API & MCP",
    description="Backend for DIO Bank featuring Open Finance integration via Pluggy and MCP tools for AI Financial Assistant.",
    version="1.0.0",
)

# CORS configuration to allow React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api")


@app.get("/")
def root():
    return {
        "app": "DIO Bank Open Finance API",
        "docs": "/docs",
        "mode": "mock" if settings.is_mock_mode else "real",
        "mcp_enabled": True,
    }


if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=True,
    )

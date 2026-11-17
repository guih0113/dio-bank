import os
from pathlib import Path
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict

# Directory anchors
_BACKEND_DIR = Path(__file__).resolve().parent.parent.parent
_ROOT_DIR = _BACKEND_DIR.parent

# Search candidates for .env file
_ENV_FILES = [
    str(_ROOT_DIR / ".env"),
    str(_BACKEND_DIR / ".env"),
    ".env",
    "backend/.env",
]


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=tuple(f for f in _ENV_FILES if os.path.exists(f)) or ".env",
        env_file_encoding="utf-8",
        extra="ignore",
    )

    PORT: int = 8000
    HOST: str = "0.0.0.0"
    CORS_ORIGINS: str = "http://localhost:5173,http://localhost:3000"

    PLUGGY_CLIENT_ID: str = ""
    PLUGGY_CLIENT_SECRET: str = ""
    PLUGGY_BASE_URL: str = "https://api.pluggy.ai"
    PLUGGY_MOCK_MODE: bool = True

    GEMINI_API_KEY: str = ""

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

    @property
    def is_mock_mode(self) -> bool:
        # If explicitly set to True or credentials are empty, default to mock mode
        if self.PLUGGY_MOCK_MODE:
            return True
        return not bool(self.PLUGGY_CLIENT_ID and self.PLUGGY_CLIENT_SECRET)


settings = Settings()

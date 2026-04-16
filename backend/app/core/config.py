import os
from dotenv import load_dotenv

load_dotenv()


class Settings:

    DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./college_erp.db")

    SECRET_KEY = os.getenv("SECRET_KEY", "change-me")

    ACCESS_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", 60)
    )
    REFRESH_TOKEN_EXPIRE_MINUTES = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", 60 * 24 * 7)
    )

    ENVIRONMENT = os.getenv("ENVIRONMENT", "development")
    ALGORITHM = os.getenv("ALGORITHM", "HS256")
    BACKEND_CORS_ORIGINS = os.getenv(
        "BACKEND_CORS_ORIGINS",
        "http://localhost:3000,http://127.0.0.1:3000"
    )


settings = Settings()
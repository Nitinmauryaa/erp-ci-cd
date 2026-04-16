import os
from fastapi import FastAPI
from sqlalchemy import text

from app.db.session import engine, Base
from app.db import base

from app.api.v1.router import api_router
from fastapi import Request
import time
from app.core.logger import logger
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from fastapi.exceptions import RequestValidationError


app = FastAPI(
    title="College ERP API"
)

# Create tables
Base.metadata.create_all(bind=engine)

# Register versioned API routers
app.include_router(api_router, prefix="/api/v1")


@app.get("/")
def root():
    return {
        "message": "College ERP Backend Running"
    }


@app.get("/health")
def health():
    return {
        "status": "ok"
    }


@app.get("/api/health")
def api_health():
    return {
        "status": "ok"
    }


@app.get("/db-test")
def db_test():
    with engine.connect() as connection:
        connection.execute(
            text("SELECT 1")
        )

    return {
        "database": "connected successfully"
    }
@app.middleware("http")
async def log_requests(request: Request, call_next):

    start_time = time.time()

    response = await call_next(request)

    duration = round(time.time() - start_time, 3)

    logger.info(
        f"{request.method} {request.url.path} "
        f"Status: {response.status_code} "
        f"Time: {duration}s"
    )

    return response
@app.exception_handler(Exception)
async def global_exception_handler(request, exc):

    logger.error(f"Unhandled error: {str(exc)}")

    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error"
        }
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    logger.warning(f"Validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={
            "message": "Validation failed",
            "details": exc.errors(),
        },
    )

allowed_origins = os.getenv(
    "BACKEND_CORS_ORIGINS",
    "http://localhost:3000,http://127.0.0.1:3000"
).split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=[origin.strip() for origin in allowed_origins if origin.strip()],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

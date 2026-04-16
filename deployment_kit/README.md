# ERP System - Deployment Kit

This folder contains everything needed to run the College ERP system anywhere (Cloud, Local, or Staging) without needing the source code. It uses the pre-built Docker images directly from Docker Hub.

## Prerequisites
*   **Docker** installed
*   **Docker Compose** installed

## How to Run

1.  **Copy this folder** to your server or local machine.
2.  **Navigate to the folder** in your terminal.
3.  **Start the application**:
    ```bash
    docker compose up -d
    ```

## Accessing the Services
Once the containers are up, they will be available at:

*   **Frontend (UI)**: [http://localhost:3000](http://localhost:3000)
*   **Backend (API Docs)**: [http://localhost:8000/docs](http://localhost:8000/docs)
*   **Database (Postgres)**: Internal port `5432`

## Deployment Secrets
For production deployments (like AWS EC2), you should change the following in `docker-compose.yml`:
*   `POSTGRES_PASSWORD`: Use a strong password.
*   `SECRET_KEY`: Change to a unique random string.
*   `BACKEND_CORS_ORIGINS`: Change to your actual domain.

## Maintenance
*   **Stop the app**: `docker compose down`
*   **Update to latest version**:
    ```bash
    docker compose pull
    docker compose up -d
    ```
*   **Check Logs**: `docker compose logs -f`

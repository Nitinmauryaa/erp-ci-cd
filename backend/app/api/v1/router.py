from fastapi import APIRouter

from app.api.v1.endpoints import auth
from app.api.v1.endpoints import students
from app.api.v1.endpoints import faculty
from app.api.v1.endpoints import courses
from app.api.v1.endpoints import enrollments
from app.api.v1.endpoints import attendance
from app.api.v1.endpoints import marks
from app.api.v1.endpoints import results
from app.api.v1.endpoints import reports
from app.api.v1.endpoints import dashboard
from app.api.v1.endpoints import departments
from app.api.v1.endpoints import subjects
from app.api.v1.endpoints import timetable
from app.api.v1.endpoints import fees




# FIRST create the router
api_router = APIRouter()

api_router.include_router(
    marks.router,
    prefix="/marks",
    tags=["Marks"]
)

api_router.include_router(
    attendance.router,
    prefix="/attendance",
    tags=["Attendance"]
)





api_router.include_router(
    enrollments.router,
    prefix="/enrollments",
    tags=["Enrollments"]
)

# Authentication routes
api_router.include_router(
    auth.router,
    prefix="/auth",
    tags=["Authentication"]
)


# Student routes
api_router.include_router(
    students.router,
    prefix="/students",
    tags=["Students"]
)


# Faculty routes
api_router.include_router(
    faculty.router,
    prefix="/faculty",
    tags=["Faculty"]
)


# Course routes
api_router.include_router(
    courses.router,
    prefix="/courses",
    tags=["Courses"]
)
api_router.include_router(
    results.router,
    prefix="/results",
    tags=["Results"]
)
api_router.include_router(
    reports.router,
    prefix="/reports",
    tags=["Reports"]
)
api_router.include_router(
    dashboard.router,
    prefix="/dashboard",
    tags=["Dashboard"]
)
api_router.include_router(
    departments.router,
    prefix="/departments",
    tags=["Departments"]
)
api_router.include_router(
    subjects.router,
    prefix="/subjects",
    tags=["Subjects"]
)
api_router.include_router(
    timetable.router,
    prefix="/timetable",
    tags=["Timetable"]
)
api_router.include_router(
    fees.router,
    prefix="/fees",
    tags=["Fees"]
)
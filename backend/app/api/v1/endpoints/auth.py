from fastapi import APIRouter, Depends, Header, HTTPException, status
from sqlalchemy.orm import Session
from jose import JWTError, jwt

from app.db.session import get_db
from app.models.user import User
from app.schemas.user import (
    AuthResponse,
    TokenRefreshRequest,
    UserCreate,
    UserLogin,
    UserOut,
)
from app.core.security import (
    hash_password,
    verify_password,
    create_access_token,
    create_refresh_token,
)
from app.core.config import settings

router = APIRouter()
ALGORITHM = settings.ALGORITHM
SECRET_KEY = settings.SECRET_KEY


def serialize_user(user: User) -> dict:
    user_out = UserOut.model_validate(user)
    return {
        "id": str(user_out.id),
        "email": user_out.email,
        "name": user_out.name,
        "role": user_out.role,
        "isActive": True,
        "createdAt": "",
        "updatedAt": ""
    }


@router.post("/register")
def register_user(
    user: UserCreate,
    db: Session = Depends(get_db)
):
    existing_user = db.query(User).filter(User.email == user.email).first()
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="User with this email already exists",
        )

    hashed = hash_password(
        user.password
    )

    new_user = User(
        name=user.name,
        email=user.email,
        password=hashed,
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "message": "User created",
        "data": serialize_user(new_user)
    }


@router.post("/login", response_model=AuthResponse)
def login_user(
    user: UserLogin,
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == user.email
    ).first()

    if not db_user:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    if not verify_password(
        user.password,
        db_user.password
    ):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email or password")

    token_payload = {
        "user_id": db_user.id,
        "role": db_user.role
    }
    access_token = create_access_token(
        token_payload
    )
    refresh_token = create_refresh_token(
        token_payload
    )

    return {
        "accessToken": access_token,
        "refreshToken": refresh_token,
        "user": UserOut.model_validate(db_user),
    }


def _decode_token(token: str) -> dict:
    try:
        return jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
    except JWTError as exc:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc


@router.get("/me")
def get_me(
    authorization: str | None = Header(default=None),
    db: Session = Depends(get_db)
):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing authorization header")

    token = authorization.split(" ", 1)[1]
    payload = _decode_token(token)
    user_id = payload.get("user_id")

    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token payload")

    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return serialize_user(user)


@router.post("/refresh")
def refresh_token(payload: TokenRefreshRequest):
    token_payload = _decode_token(payload.refreshToken)
    if token_payload.get("type") != "refresh":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    user_id = token_payload.get("user_id")
    role = token_payload.get("role")
    if not user_id or not role:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token payload")
    fresh_payload = {"user_id": user_id, "role": role}
    return {
        "accessToken": create_access_token(fresh_payload),
        "refreshToken": create_refresh_token(fresh_payload),
    }


@router.post("/logout")
def logout_user():
    return {
        "success": True
    }
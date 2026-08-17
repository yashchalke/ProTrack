from fastapi import Depends,HTTPException,status
from fastapi.security import OAuth2PasswordBearer
from sqlalchemy.orm import Session
from .security import verify_token
from db.db import get_db
from db.models import DBUser
from routers.Schemas import UserBase

oauth2_schema = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token:str = Depends(oauth2_schema),db:Session = Depends(get_db)):
    payload = verify_token(token=token)
    if not payload or "sub" not in payload:
        raise HTTPException(status_code=401, detail="Invalid or expired token")

    user = db.query(DBUser).filter(DBUser.id == int(payload["sub"])).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    return UserBase(user)
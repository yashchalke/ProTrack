from fastapi import APIRouter,status,Depends
from db.db import get_db
from .Schemas import UserModel,LoginUserModel
from sqlalchemy.orm.session import Session
from db.db_user import register_user,login_user

router = APIRouter(prefix="/auth",tags=['Authentication'])

@router.post("/signup")
def signup(request:UserModel,db:Session = Depends(get_db)):
    return register_user(new_user=request,db=db)

@router.post('/login')
def login(request:LoginUserModel,db:Session = Depends(get_db)):
    return login_user(user_request=request,db=db)


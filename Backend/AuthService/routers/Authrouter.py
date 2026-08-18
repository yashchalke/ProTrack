from fastapi import APIRouter,status,Depends,HTTPException,Response
from db.db import get_db
from .Schemas import UserModel,LoginUserModel,Token,UserBase
from sqlalchemy.orm.session import Session
from db.auth import register_user,login_user
from utils.security import verify_token,create_access_token,create_refresh_token
from db.models import DBUser

router = APIRouter(prefix="/auth",tags=['Authentication'])

@router.post("/signup")
def signup(request:UserModel,db:Session = Depends(get_db)):
    return register_user(new_user=request,db=db)

@router.post('/login')
def login(request:LoginUserModel,response:Response,db:Session = Depends(get_db)):
    return login_user(user_request=request,db=db,response=response)

@router.post('/refresh',response_model=Token)
def refresh_token(refresh_token:str):
    payload = verify_token(refresh_token)
    if not payload or payload.get("type") != "refresh":
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    user_id = payload.get('sub')
    access_token = create_access_token({"sub": user_id})
    new_refresh_token = create_refresh_token({"sub":user_id})

    response = Response()
    response.set_cookie(
        key="refresh_token",
        value=new_refresh_token,
        httponly=True,
        secure=False,
        samesite="strict",
        max_age=7*24*60*60,
        path="/"
    )

    return Token(access_token=access_token, refresh_token=new_refresh_token)

@router.get("/getuser/{email}",response_model=UserBase)
def get_user_by_email(email:str,db:Session=Depends(get_db)):
    user = db.query(DBUser).filter(DBUser.email == email).first()
    if not user:
        raise HTTPException(status_code=404,detail="user not found")
    return user
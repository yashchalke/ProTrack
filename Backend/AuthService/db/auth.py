from .models import DBUser
from routers.Schemas import UserModel,LoginUserModel,Token
from fastapi import APIRouter,Depends,status,Response
from sqlalchemy.orm.session import Session
from utils.security import hash_password,verify_password
from sqlalchemy import or_
from utils.security import create_access_token,create_refresh_token

def register_user(new_user:UserModel,db:Session):
    existing_user = db.query(DBUser).filter(or_(DBUser.email == new_user.email, DBUser.phone_no == new_user.phone_no)).first()
    if existing_user:
        return {
            "status":400,
            "message":"User with same Email or Phone number Already Exists"
        }

    hashedpassword = hash_password(new_user.password)
    user = DBUser(
        firstname=new_user.firstname,
        lastname=new_user.lastname,
        email=new_user.email,
        password=hashedpassword,
        phone_no=new_user.phone_no
    )
    db.add(user)
    db.commit()
    db.refresh(user)
    return {
        "status":201,
        "message":"User Registered Successfully",
        "data":new_user
    }

def login_user(user_request:LoginUserModel,response:Response,db:Session):
    user = db.query(DBUser).filter(DBUser.email == user_request.email).first();
    print(user)
    if not user:
        return {
            "status":401,
            "message":"User not found"
        }
    if not verify_password(user_request.password,user.password):
        return {
            "status":401,
            "message":"Wrong Password"
        }
    username = user.firstname + " " + user.lastname
    access_token = create_access_token({"sub":str(user.id)})
    refresh_token = create_refresh_token({"sub":str(user.id)})
    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,
        secure=False,
        samesite="strict",
        max_age=7*24*60*60,
        path="/"
    )
    return {
        "status":200,
        "message":"User Logged In Successfully",
        "data":{
                "Name":user.firstname + " " + user.lastname,
                "email":user.email,
                "phone_no":user.phone_no
            },
        "token":Token(access_token=access_token,refresh_token=refresh_token)
        }
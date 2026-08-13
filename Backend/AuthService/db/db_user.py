from .models import DBUser
from routers.Schemas import UserModel,LoginUserModel
from fastapi import APIRouter,Depends,status
from sqlalchemy.orm.session import Session
from utils.security import hash_password,verify_password
from sqlalchemy import or_

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

def login_user(user_request:LoginUserModel,db:Session):
    user = db.query(DBUser).filter(DBUser.email == user_request.email).first();
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
    return {
        "status":200,
        "message":"User Logged In Successfully",
        "data":{
                "Name":user.firstname + " " + user.lastname,
                "email":user.email,
                "phone_no":user.phone_no
            }
        }
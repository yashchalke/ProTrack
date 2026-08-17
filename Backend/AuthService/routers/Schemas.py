from pydantic import BaseModel

class UserModel(BaseModel):
    firstname:str
    lastname:str
    email:str
    password:str
    phone_no:str

class LoginUserModel(BaseModel):
    email:str
    password:str

class Token(BaseModel):
    access_token:str
    refresh_token:str
    token_type:str = "bearer"

class UserBase(BaseModel):
        id:int
        firstname:str
        lastname:str
        email:str
        phone_no:str
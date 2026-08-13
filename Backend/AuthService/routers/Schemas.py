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
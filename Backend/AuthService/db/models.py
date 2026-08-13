from .db import Base
from sqlalchemy import Column,Integer,String,DateTime,ForeignKey
from sqlalchemy.orm import relationship

class DBUser(Base):
    __tablename__ = "Users"
    id = Column(Integer,primary_key=True,index=True)
    firstname = Column(String)
    lastname = Column(String)
    password = Column(String)
    phone_no = Column(String)
    email = Column(String)

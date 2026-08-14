from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import os 
from dotenv import load_dotenv
from sqlalchemy.ext.declarative import declarative_base

load_dotenv()

DB_URL = os.getenv("DB_URL")

engine = create_engine(DB_URL)

localsession = sessionmaker(bind=engine,autoflush=False,autocommit=False)

Base = declarative_base()

def get_db():
    db = localsession()
    try:
        yield db
    finally:
        db.close()




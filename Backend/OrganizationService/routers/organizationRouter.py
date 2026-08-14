from fastapi import APIRouter,Depends
from routers.Schemas import OrganizationFormBase
from sqlalchemy.orm import Session
from db.OrganizationDB import create_new_organization
from db.db import get_db

router = APIRouter(prefix="/organization",tags=['organization'])

@router.post("/create")
def create_organization(request:OrganizationFormBase,db:Session = Depends(get_db)):
    return create_new_organization(payload=request,db=db)
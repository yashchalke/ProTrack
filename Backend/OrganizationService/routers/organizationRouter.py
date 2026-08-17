from fastapi import APIRouter,Depends,UploadFile,File,HTTPException
from routers.Schemas import OrganizationFormBase
from sqlalchemy.orm import Session
from db.OrganizationDB import create_new_organization,get_roles
from db.db import get_db
from utils.S3Client import s3_client,Bucket_name
from uuid import uuid4
from utils.dependency import get_current_user
from db.models import OrganizationMember

router = APIRouter(prefix="/organization",tags=['organization'])

@router.post("/create")
def create_organization(request:OrganizationFormBase,db:Session = Depends(get_db),user_id:int = Depends(get_current_user)):
    return create_new_organization(payload=request,db=db,user_id=user_id)

@router.post("/upload-logo")
async def upload_logo(file: UploadFile = File(...)):
    try:
        file_extension = file.filename.split(".")[-1]
        key = f"logos/{uuid4()}.{file_extension}"

        s3_client.upload_fileobj(
            file.file,
            Bucket_name,
            key
        )

        url = f"https://{Bucket_name}.s3.amazonaws.com/{key}"
        return {"logo_url": url}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Upload failed: {str(e)}")

@router.get("/global-roles")
def get_global_roles(db:Session = Depends(get_db)):
    return get_roles(db=db)

@router.get('/me')
def get_user_org(db:Session = Depends(get_db),current_user_id:int = Depends(get_current_user)):
    member = db.query(OrganizationMember).filter(OrganizationMember.user_id == current_user_id).first()
    if member:
        return {"has_org":True, "organization_id":member.organization_id}
    return {"has_org":False}
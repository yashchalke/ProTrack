from sqlalchemy.orm import Session
from routers.Schemas import OrganizationFormBase
from db.models import OrganizationDB,RoleDB,OrganizationMember
from utils.dependency import get_current_user

def create_new_organization(payload:OrganizationFormBase,db:Session,user_id:int):
    org = OrganizationDB(
        logo_url=payload.logo_url,
        name=payload.name,
        description=payload.description,
        address=payload.address,
        country=payload.country,
        state=payload.state,
        city=payload.city,
        pincode=payload.pincode,
    )
    db.add(org)
    db.flush()

    role = db.query(RoleDB).filter_by(id=payload.role_id, is_global=True).first()
    if not role:
        raise ValueError("Role not Found")

    member = OrganizationMember(
        organization_id = org.id,
        user_id = user_id,
        role_id = role.id,
        job_title = role.name,
    )
    db.add(member)
    db.commit()
    db.refresh(org)
    db.refresh(member)

    return {
        "organization": org,
        "member": member,
        "message":"Organization Created Successfully"}


def get_roles(db:Session):
    roles = db.query(RoleDB).filter(RoleDB.is_global == True).all()
    return {
        "status":200,
        "message":"Global Roles Fetched Successfully",
        "roles":roles
    }
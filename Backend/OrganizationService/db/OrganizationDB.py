from sqlalchemy.orm import Session
from routers.Schemas import OrganizationFormBase
from db.models import OrganizationDB,RoleDB,OrganizationMember

def create_new_organization(payload:OrganizationFormBase,db:Session):
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
        user_id = 5,
        role_id = role.id,
        job_title = role.name,
    )
    db.add(member)
    db.commit()
    db.refresh(org)
    db.refresh(member)

    return {"organization": org, "member": member}
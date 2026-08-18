from sqlalchemy.orm import Session
from db.models import RoleDB

def seed_global_roles(db: Session):
    default_roles = [
        {"name": "Employee","is_super_admin":False,"is_global":True},
        {"name": "Admin", "is_super_admin": True, "is_global": True},
        {"name": "HR", "is_super_admin": True, "is_global": True},
        {"name": "CEO", "is_super_admin": True, "is_global": True},
        {"name": "Co-founder", "is_super_admin": True, "is_global": True},
        {"name": "Director", "is_super_admin": True, "is_global": True},
    ]

    for role in default_roles:
        exists = db.query(RoleDB).filter_by(name=role["name"], is_global=True).first()
        if not exists:
            db.add(RoleDB(**role))

    db.commit()

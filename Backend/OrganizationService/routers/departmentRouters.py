from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db.models import OrganizationDB,DepartmentDB,RoleDB,TeamDB
from Schemas import DepartmentCreate,DepartmentResponse,DepartmentListResponse,RoleResponse,RoleCreate,RoleListResponse,TeamResponse,TeamCreate,TeamListResponse

router = APIRouter(prefix="/department",tags=["Departments"])

@router.post("/create")
def create_new_department(payload:DepartmentCreate,db:Session = Depends(get_db)):
    org = db.query(OrganizationDB).filter(OrganizationDB.id == payload.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    existing = db.query(DepartmentDB).filter(
        DepartmentDB.organization_id == payload.organization_id,
        DepartmentDB.name == payload.name
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Department with this name already exists")

    new_department = DepartmentDB(
        organization_id = payload.organization_id,
        name=payload.name
    )
    db.add(new_department)
    db.commit()
    db.refresh(new_department)

    return {
        "status":201,
        "message":"Department Created Successfully",
        "data":new_department
    }

@router.get("/organization/{org_id}",response_model=DepartmentListResponse)
def get_departments_by_org(org_id:int,db:Session = Depends(get_db)):
    org = db.query(OrganizationDB).filter(OrganizationDB.id == org_id).first()
    if not org:
        raise HTTPException(status_code=404,detail="Organization not found")

    departments = db.query(DepartmentDB).filter(
        OrganizationDB.id == org_id
    ).all()

    dept_list = []
    for dept in departments:
        dept_list.append(DepartmentResponse(
            id=dept.id,
            organization_id=dept.organization_id,
            name=dept.name,
            employee_count=len(dept.employees),
            team_count=len(dept.teams)
        ))

    return {"departments":dept_list}

@router.post("/roles/create")
def create_new_role(role:RoleCreate,db:Session = Depends(get_db)):
    org = db.query(OrganizationDB).filter(OrganizationDB.id == role.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    dept = db.query(DepartmentDB).filter(DepartmentDB.id == role.department_id).first()
    if not dept:
        raise HTTPException(status_code=400, detail="Department not found")

    existing_role = db.query(RoleDB).filter(
        RoleDB.department_id == role.department_id,
        RoleDB.name == role.name).first()
    if existing_role:
        raise HTTPException(status_code=400, detail="role with same name already exists")

    new_role = RoleDB(
        department_id = role.department_id,
        organization_id = role.organization_id,
        name = role.name,
        is_super_admin = role.is_super_admin,
        is_global = role.is_global
    )
    db.add(new_role)
    db.commit()
    db.refresh(new_role)

    return new_role

@router.get("/roles/{dept_id}",response_model=RoleListResponse)
def get_roles_by_department(dept_id:int,db:Session = Depends(get_db)):
    dept = db.query(DepartmentDB).filter(DepartmentDB.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    roles = db.query(RoleDB).filter(RoleDB.department_id == dept_id).all()

    return {"roles":roles}

@router.post("/team/create")
def create_new_team(payload:TeamCreate,db:Session = Depends(get_db)):
    dept = db.query(DepartmentDB).filter(DepartmentDB.id == payload.department_id).first()
    if not dept:
        raise HTTPException(status_code=404,detail="Department not found")

    existing_team = db.query(TeamDB).filter(
        TeamDB.department_id == payload.department_id,
        TeamDB.name == payload.name).first()
    if existing_team:
        raise HTTPException(status_code=400,detail="Team with same name already exists in this Department")

    new_team = TeamDB(
        department_id = payload.department_id,
        name=payload.name
    )
    db.add(new_team)
    db.commit()
    db.refresh(new_team)
    return new_team

@router.get("/team/{dept_id}",response_model=TeamListResponse)
def get_teams_by_department(dept_id:int,db:Session = Depends(get_db)):
    dept = db.query(DepartmentDB).filter(DepartmentDB.id == dept_id).first()
    if not dept:
        raise HTTPException(status_code=404,detail="Department not found")

    teams = db.query(TeamDB).filter(TeamDB.department_id == dept_id).all()

    team_list = []
    for team in teams:
        team_list.append(TeamResponse(
            id=team.id,
            department_id=team.department_id,
            name=team.name,
            member_count=len(teams.members)
        ))
    return {"teams":team_list}
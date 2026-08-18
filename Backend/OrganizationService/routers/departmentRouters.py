import httpx
from fastapi import APIRouter,Depends,HTTPException
from sqlalchemy.orm import Session
from db.db import get_db
from db.models import OrganizationDB,DepartmentDB,RoleDB,TeamDB,InvitationDB,OrganizationMember
from routers.Schemas import DepartmentCreate,DepartmentResponse,DepartmentListResponse,RoleResponse,RoleCreate,RoleListResponse,TeamResponse,TeamCreate,TeamListResponse,InvitationCreate,InvitationResponse,InvitationStatus

router = APIRouter(prefix="/department",tags=["Departments"])

AUTH_SERVICE_URL = "http://localhost:8000"

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

@router.post("/invite/new", response_model=InvitationResponse)
def create_invitation(invite: InvitationCreate, db: Session = Depends(get_db)):
    org = db.query(OrganizationDB).filter(OrganizationDB.id == invite.organization_id).first()
    if not org:
        raise HTTPException(status_code=404, detail="Organization not found")

    dept = db.query(DepartmentDB).filter(DepartmentDB.id == invite.department_id).first()
    if not dept:
        raise HTTPException(status_code=404, detail="Department not found")

    new_invite = InvitationDB(
        email=invite.email,
        organization_id=invite.organization_id,
        department_id=invite.department_id
    )
    db.add(new_invite)
    db.commit()
    db.refresh(new_invite)

    # TODO: send email notification here
    return new_invite

@router.post("/invite/{invite_id}/accept")
def accept_invitation(invite_id:int,db:Session = Depends(get_db)):
    invitation = db.query(InvitationDB).filter(InvitationDB.id == invite_id).first()
    if not invitation:
        raise HTTPException(status_code=404,detail="Invitation not found or expired")

    try:
        response = httpx.get(f"{AUTH_SERVICE_URL}/getuser/{invitation.email}")
        response.raise_for_status()
        user = response.json()
    except httpx.HTTPStatusError:
        raise HTTPException(status_code=404, detail="User not found in AuthService")

    invitation.status = InvitationStatus.accepted
    db.commit()

    new_member = OrganizationMember(
        organization_id = invitation.organization_id,
        department_id = invitation.department_id,
        user_id = user["id"],
        role_id = 1
    )
    db.add(new_member)
    db.commit()
    db.refresh(new_member)

    return invitation
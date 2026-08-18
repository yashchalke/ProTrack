from pydantic import BaseModel
from typing import List
from enum import Enum

class OrganizationFormBase(BaseModel):
    logo_url:str
    name:str
    description:str
    address:str
    country:str
    state:str
    city:str
    pincode:str
    role_id:int

class RolesBase(BaseModel):
    organization_id:int
    name:str
    is_super_admin:bool
    is_global:bool

class OrganizationMemberBase(BaseModel):
    organization_id:int
    user_id:int
    role_id:int
    job_title:str

class DepartmentCreate(BaseModel):
    organization_id:int
    name:str

class DepartmentResponse(BaseModel):
    id:int
    organization_id:int
    name:str
    employee_count:int
    team_count:int

    class Config:
        from_attributes = True

class DepartmentListResponse(BaseModel):
    departments:List[DepartmentResponse]


class RoleCreate(BaseModel):
    department_id:int
    organization_id:int
    name:str
    is_super_admin:bool = False
    is_global:bool = False

class RoleResponse(BaseModel):
    id:int
    department_id:int
    organization_id:int
    name:str
    is_super_admin:bool 
    is_global:bool

    class Config:
        from_attributes = True

class RoleListResponse(BaseModel):
    roles : List[RoleResponse]

class TeamCreate(BaseModel):
    department_id:int
    name:str

class TeamResponse(BaseModel):
    id:int
    department_id:int
    name:str
    member_count:int

    class Config:
        from_attributes = True

class TeamListResponse(BaseModel):
    teams:List[TeamResponse]

class InvitationStatus(str, Enum):
    pending = "pending"
    accepted = "accepted"
    rejected = "rejected"

class InvitationCreate(BaseModel):
    email:str
    organization_id:int
    department_id:int

class InvitationResponse(BaseModel):
    id:int
    email:str
    organization_id:int
    department_id:int
    status:InvitationStatus

    class Config:
        from_attributes = True
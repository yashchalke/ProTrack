from pydantic import BaseModel

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

    
from sqlalchemy import Column, String, Integer, DateTime, ForeignKey, Boolean
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from .db import Base

class OrganizationDB(Base):
    __tablename__ = "organizations"
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False, unique=True)
    description = Column(String(500))
    logo_url = Column(String(255))
    address = Column(String(255))
    country = Column(String(100))
    state = Column(String(100))
    city = Column(String(100))
    pincode = Column(String(20))
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    members = relationship("OrganizationMember", back_populates="organization", cascade="all, delete-orphan")
    departments = relationship("DepartmentDB", back_populates="organization", cascade="all, delete-orphan")
    roles = relationship("RoleDB", back_populates="organization", cascade="all, delete-orphan")


class RoleDB(Base):
    __tablename__ = "roles"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=True)
    name = Column(String(100), nullable=False)
    is_super_admin = Column(Boolean, default=False)
    is_global = Column(Boolean, default=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    organization = relationship("OrganizationDB", back_populates="roles")
    department = relationship("DepartmentDB", back_populates="roles")
    members = relationship("OrganizationMember", back_populates="role", cascade="all, delete-orphan")


class OrganizationMember(Base):
    __tablename__ = "organization_members"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=True, index=True)
    team_id = Column(Integer, ForeignKey("teams.id", ondelete="CASCADE"), nullable=True, index=True)
    user_id = Column(Integer, nullable=False, index=True)  # no FK if users are in another DB
    role_id = Column(Integer, ForeignKey("roles.id", ondelete="CASCADE"), nullable=False, index=True)
    job_title = Column(String(100))
    joined_at = Column(DateTime, server_default=func.now())

    # Relationships
    organization = relationship("OrganizationDB", back_populates="members")
    department = relationship("DepartmentDB", back_populates="employees")
    role = relationship("RoleDB", back_populates="members")
    team = relationship("TeamDB", back_populates="members")


class DepartmentDB(Base):
    __tablename__ = "departments"
    id = Column(Integer, primary_key=True, index=True)
    organization_id = Column(Integer, ForeignKey("organizations.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    organization = relationship("OrganizationDB", back_populates="departments")
    employees = relationship("OrganizationMember", back_populates="department", cascade="all, delete-orphan")
    roles = relationship("RoleDB", back_populates="department", cascade="all, delete-orphan")
    teams = relationship("TeamDB", back_populates="department", cascade="all, delete-orphan")


class TeamDB(Base):
    __tablename__ = "teams"
    id = Column(Integer, primary_key=True, index=True)
    department_id = Column(Integer, ForeignKey("departments.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, server_default=func.now())

    # Relationships
    department = relationship("DepartmentDB", back_populates="teams")
    members = relationship("OrganizationMember", back_populates="team", cascade="all, delete-orphan")

from fastapi import FastAPI
from db.db import engine,get_db
from db import models
from utils.SeedGlobalRoles import seed_global_roles
from sqlalchemy.orm.session import Session
from routers import organizationRouter

app = FastAPI()

models.Base.metadata.create_all(engine)
app.include_router(organizationRouter.router)

@app.on_event("startup")
def startup_event():
    db:Session = next(get_db())
    seed_global_roles(db)
    db.close()

@app.get("/",tags=["Organization"])
def check_health():
    return {
        "status":200,
        "message":"Organization Service is Active."
    }




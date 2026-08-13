from fastapi import FastAPI
from db import models
from db.db import engine
from routers import Authrouter
from fastapi.middleware.cors import CORSMiddleware

models.Base.metadata.create_all(engine)

app = FastAPI()

app.include_router(Authrouter.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins="http://localhost:3000",
    allow_credentials=True,
    allow_methods=['*'],
    allow_headers=['*']
)

@app.get("/")
def health():
    return {
        "Status":"Running...",
        "Message":"Auth Service is Active"
    }
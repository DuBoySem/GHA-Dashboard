from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from api import router

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.include_router(router)

@app.get("/", include_in_schema=False)
def root():
    return {"message": "CI/CD dashboard backend is live. Visit /docs for API."}

@app.get("/favicon.ico", include_in_schema=False)
def favicon():
    return Response(status_code=204)

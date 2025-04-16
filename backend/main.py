from fastapi import FastAPI

app = FastAPI()

@app.get("/api/brands")
def get_brands():
    return ["FIAT", "RENAULT", "PEUGEOT"]

from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
from agent import chat

app = FastAPI()
sessions = {}

class ChatIn(BaseModel):
    session_id: str
    message: str

@app.post("/chat")
def chat_endpoint(body: ChatIn):
    history = sessions.setdefault(body.session_id, [])
    history.append({"role": "user", "content": body.message})
    return {"reply": chat(history)}

# This must stay LAST, after all other routes
app.mount("/", StaticFiles(directory="frontend/dist", html=True), name="site")
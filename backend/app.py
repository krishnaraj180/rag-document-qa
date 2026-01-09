from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

app = FastAPI(title="RAG Document Q&A API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def read_root():
    return {
        "message": "RAG Document Q&A System API",
        "version": "1.0.0",
        "endpoints": {
            "upload": "/api/upload",
            "ask": "/api/ask",
            "history": "/api/history"
        }
    }

@app.post("/api/upload")
async def upload_document(file: UploadFile = File(...)):
    return {"message": f"Document {file.filename} uploaded successfully"}

@app.post("/api/ask")
async def ask_question(question: str):
    return {"answer": "This is a sample answer from RAG system"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)

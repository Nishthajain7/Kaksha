import os
import requests
from groq import Groq
from typing import List
from pydantic import BaseModel
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File, HTTPException

app = FastAPI()
load_dotenv()
client = Groq(api_key=os.getenv("GROQ_API_KEY"))
OCR_API = os.getenv("OCR_API")
OCR_URL = "https://api.ocr.space/parse/image"

class QuizQuestion(BaseModel):
    question: str
    options: List[str]
    correct_answer: int
    concept: str
    
class QuizRequest(BaseModel):
    num_questions: int = 7
    concepts : List[str] = None

async def extract_text_from_pdf(request: QuizRequest, file: UploadFile = File(...)):

    if not file.filename.lower().endswith(".pdf"):
        raise HTTPException(400, "Only PDF files are allowed")

    file_bytes = await file.read()

    if request.num_questions < 1 or request.num_questions > 15:
        raise HTTPException(
            status_code=400, 
            detail="Number of questions must be between 1 and 15"
        )

    response = requests.post(
        OCR_URL,
        files={"file": (file.filename, file_bytes, "application/pdf")},
        data={
            "apikey": OCR_API,
            "language": "eng",
            "isOverlayRequired": False,
            "filetype": "PDF"
        }
    )

    result = response.json()

    if "ParsedResults" not in result:
        raise HTTPException(500, result)

    text = "\n".join(page["ParsedText"] for page in result["ParsedResults"])
    
    if not text.strip():
        raise HTTPException(status_code=400, detail="Text cannot be empty")

    return text

def extract_key_points(text):
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You extract key learning concepts from study material."
            },
            {
                "role": "user",
                "content": f"""
Extract the most important learning points from the following text.
No need of bullet points. Do NOT add any introduction, heading, or explanation
TEXT:
{text}
"""
            }
        ],
        temperature=0.3
    )

    return response.choices[0].message.content
    
def generate_quiz_with_groq(text: str, num_questions: int, concepts: List[str]) -> List[QuizQuestion]:
    
    concept_clause = ""
    if concepts:
        concept_clause = f"""
Focus specially on {", ".join(concepts)}
"""
    
    prompt = f"""Generate {num_questions} multiple-choice questions from this content. {concept_clause}
Content:
{text}

Output ONLY valid JSON:
{{
  "questions": [
    {{
      "question": "...",
      "options": ["A", "B", "C", "D"],
      "correct_answer": 0,
      "concept": "Concept name"
    }}
  ]
}}
"""
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {"role": "system", "content": "You are a quiz generation expert. Always respond with valid JSON only."},
            {"role": "user", "content": prompt}
        ],
        response_format={"type": "json_object"},
        temperature=0.7,
        max_tokens=2000
    )

    data = response.choices[0].message.content
    return data

@app.post("/generate-quiz", response_model=List[QuizQuestion])
async def generate_quiz(
    request: QuizRequest,
    file: UploadFile = File(...)
):
    raw_text = await extract_text_from_pdf(request, file)

    key_points = extract_key_points(raw_text)

    quiz = generate_quiz_with_groq(
        text=key_points,
        num_questions=request.num_questions,
        concepts=request.concepts
    )

    return quiz

@app.get("/")
async def root():
    return {
        "message": "Free Quiz Generation API",
        "model": "Groq Llama 3.3 70B",
        "status": "active"
    }
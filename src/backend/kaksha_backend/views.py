from django.http import JsonResponse
import os
import requests
from groq import Groq
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Concept,File,Folder

def auth(request):
    if request.user.is_authenticated:
        return JsonResponse({
            "isLoggedIn": True,
            "user": {
                "id": request.user.id,
                "email": request.user.email,
                "name": f"{request.user.first_name} {request.user.last_name}"
            }
        })
    return JsonResponse({"isLoggedIn": False}, status=401)


@api_view(["POST"])
def folderUpload(request, folder_name):
    if not request.user.is_authenticated:
        return Response({"error": "Login required"}, status=401)

    if Folder.objects.filter(folder_name=folder_name, user=request.user).exists():
        return Response({"error": "Folder exists"}, status=409)

    folder = Folder.objects.create(folder_name=folder_name, user=request.user)

    return Response({"folder_id": folder.folder_id}, status=201)

@api_view(["POST"])
def fileUpload(request, folder_name):
    if not request.user.is_authenticated:
        return Response({"error": "Login required"}, status=401)

    try:
        folder = Folder.objects.get(folder_name=folder_name, user=request.user)
    except Folder.DoesNotExist:
        return Response({"error": "Folder not found"}, status=404)

    file_name = request.data.get("file_name")
    file_path = request.data.get("path")

    file = File.objects.create(
        file_name=file_name,
        path=file_path,
        folder=folder
    )
    return Response({"file_id": file.file_id}, status=201)


def accuracy(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    # This filters: Concepts -> File -> Folder -> User
    concepts = Concept.objects.filter(file__folder__user=request.user)
    
    result = []
    for c in concepts:
         total = (c.correct or 0) + (c.wrong or 0)
         acc = (c.correct / total) if total > 0 else 0
         result.append({
            "concept_name": c.concept_name,
            "accuracy": round(acc, 2)
        })
    return JsonResponse(result, safe=False)


OCR_URL = "https://api.ocr.space/parse/image"
OCR_API = os.getenv("OCR_API")
client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class OCRExtractView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    def post(self, request):
        serializer = OCRRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        file = serializer.validated_data["file"]

        if not file.name.lower().endswith(".pdf"):
            return Response(
                {"detail": "Only PDF files are allowed"},
                status=status.HTTP_400_BAD_REQUEST
            )

        file_bytes = file.read()

        response = requests.post(
            OCR_URL,
            files={"file": (file.name, file_bytes, "application/pdf")},
            data={
                "apikey": OCR_API,
                "language": "eng",
                "isOverlayRequired": False,
                "filetype": "PDF"
            }
        )

        result = response.json()

        if "ParsedResults" not in result:
            return Response(
                {"detail": "OCR failed", "error": result},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

        text = "\n".join(
            page.get("ParsedText", "")
            for page in result["ParsedResults"]
        )

        if not text.strip():
            return Response(
                {"detail": "Extracted text is empty"},
                status=status.HTTP_400_BAD_REQUEST
            )

        return Response(
            {"text": text},
            status=status.HTTP_200_OK
        )

class KeyPointsView(APIView):

    def post(self, request):
        serializer = KeyPointsRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["text"]

        prompt = f"""
You are an information extraction system.

Task:
Extract the core academic or technical concepts from the given text.

Instructions:
1. Identify only meaningful concepts (topics, ideas, principles, methods, entities).
2. Exclude examples, explanations, filler text, and questions.
3. Normalize concepts to short noun phrases (2–6 words).
4. Merge duplicates or closely related concepts.
5. Do NOT invent concepts that are not explicitly present in the text.
6. Preserve domain-specific terminology exactly as written.
7. Order concepts by importance (most important first).

Output Format (STRICT):
Return valid JSON only. No extra text.

{{
  "concepts": [
    "concept 1",
    "concept 2",
    "concept 3"
  ]
}}

Text:
\"\"\"
{text}
\"\"\"
"""

        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": "You extract key learning concepts from study material."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3
        )

        key_points = response.choices[0].message.content

        return Response(
            {"key_points": key_points},
            status=status.HTTP_200_OK
        )

class QuizGenerationView(APIView):

    def post(self, request):
        serializer = QuizRequestSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        text = serializer.validated_data["text"]
        num_questions = serializer.validated_data["num_questions"]
        concepts = serializer.validated_data.get("concepts")

        concept_clause = ""
        if concepts:
            concept_clause = f"Focus specially on {', '.join(concepts)}."

        prompt = f"""
Generate {num_questions} multiple-choice questions.
{concept_clause}

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
                {
                    "role": "system",
                    "content": "You are a quiz generation expert. Always respond with valid JSON only."
                },
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            response_format={"type": "json_object"},
            temperature=0.7,
            max_tokens=2000
        )

        quiz_json = response.choices[0].message.content

        return Response(
            quiz_json,
            status=status.HTTP_200_OK
        )
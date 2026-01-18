from django.http import JsonResponse
import os
import requests
from groq import Groq
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from rich import _console
from .models import Concept,File,Folder
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from allauth.socialaccount.models import SocialToken
from django.utils import timezone
from datetime import timedelta
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import api_view, authentication_classes, permission_classes
from rest_framework.authentication import SessionAuthentication
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

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

class UnsafeSessionAuthentication(SessionAuthentication):
    def enforce_csrf(self, request):
        return

@api_view(["POST"])
@authentication_classes([UnsafeSessionAuthentication])
@permission_classes([IsAuthenticated])
def folderUpload(request, folder_name):
    if not request.user.is_authenticated:
        return Response({"error": "Login required"}, status=401)

    if Folder.objects.filter(folder_name=folder_name, user=request.user).exists():
        return Response({"error": "Folder exists"}, status=409)

    folder = Folder.objects.create(folder_name=folder_name, user=request.user)

    return Response({"folder_id": folder.folder_id}, status=201)

import json
from django.db import transaction

@api_view(["POST"])
def fileUpload(request, folder_name):
    if not request.user.is_authenticated:
        return Response({"error": "Login required"}, status=401)

    try:
        folder = Folder.objects.get(folder_name=folder_name, user=request.user)
    except Folder.DoesNotExist:
        return Response({"error": "Folder not found"}, status=404)

    # 1. Save the file record first
    file_name = request.data.get("file_name")
    file_path = request.data.get("path")
    
    try:
        with transaction.atomic():
            # Create the file in DB
            new_file = File.objects.create(
                file_name=file_name,
                path=file_path,
                folder=folder
            )

            # 2. Call OCRExtractView internally
            # We pass the current request which contains the 'file'
            ocr_response = OCRExtractView.as_view()(request._request)
            if ocr_response.status_code != 200:
                raise Exception("OCR Step Failed")
            
            extracted_text = ocr_response.data.get("text")

            # 3. Call KeyPointsView internally
            # We must update the request data to pass the 'text' forward
            request.data['text'] = extracted_text
            kp_response = KeyPointsView.as_view()(request._request)
            
            if kp_response.status_code != 200:
                raise Exception("Concept Extraction Failed")

            # KeyPointsView returns a string of JSON, so we parse it
            raw_kp_content = kp_response.data.get("key_points")
            concepts_data = json.loads(raw_kp_content)

            # 4. Save Concepts to Database
            for name in concepts_data.get("concepts", []):
                Concept.objects.create(
                    file=new_file,
                    concept_name=name
                )
            
            _console.log("Uploading to folder:", folderName);


            return Response({
                "status": "success",
                "file_id": new_file.file_id,
                "concepts_found": len(concepts_data.get("concepts", []))
            }, status=201)

    except Exception as e:
        return Response({"error": str(e)}, status=500)

from django.utils import timezone
from datetime import timedelta
from django.http import JsonResponse
from .models import Concept

import json
from collections import defaultdict
from django.http import JsonResponse
from django.utils import timezone
from datetime import timedelta

def submit_quiz_result(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    if request.method != "POST":
        return JsonResponse({"error": "Invalid request method"}, status=405)

    try:
        body = json.loads(request.body)
        results = body.get("results", [])
    except json.JSONDecodeError:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    if not results:
        return JsonResponse({"error": "No quiz results provided"}, status=400)

    grouped = defaultdict(list)
    for r in results:
        grouped[r["concept_id"]].append(r["result"])

    next_review_days = []

    for concept_id, attempts in grouped.items():
        try:
            concept = Concept.objects.get(
                concept_id=concept_id,
                file__folder__user=request.user
            )
        except Concept.DoesNotExist:
            continue 

        correct = attempts.count("correct")
        wrong = attempts.count("wrong")
        skipped = attempts.count("skipped")

        concept.correct += correct
        concept.wrong += wrong

        if correct > wrong:
            quality = 5
        elif skipped > 0:
            quality = 2
        else:
            quality = 1

        reps = concept.repetitions
        interval = concept.interval
        ef = concept.easiness_factor

        if quality >= 3:
            if reps == 0:
                interval = 1
            elif reps == 1:
                interval = 6
            else:
                interval = round(interval * ef)
            reps += 1
        else:
            reps = 0
            interval = 1

        ef = ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
        if ef < 1.3:
            ef = 1.3

        concept.repetitions = reps
        concept.interval = interval
        concept.easiness_factor = ef
        concept.next_review = timezone.now() + timedelta(days=interval)
        concept.save()

        next_review_days.append(interval)

    next_quiz_in_days = min(next_review_days) if next_review_days else 1

    return JsonResponse({
        "status": "OK",
        "next_quiz": next_quiz_in_days
    })



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
        # We now expect file_id (and optionally folder_id for security)
        file_id = request.data.get("file_id")
        num_questions = request.data.get("num_questions", 5)

        if not file_id:
            return Response({"error": "file_id is required"}, status=400)

        try:
            # 1. Fetch the File and its extracted concepts from the DB
            # Security: Ensure the file belongs to the logged-in user
            file_obj = File.objects.get(file_id=file_id, folder__user=request.user)
            
            # Get all concept names for this file
            db_concepts = Concept.objects.filter(file=file_obj).values_list('concept_name', flat=True)
            
            if not db_concepts:
                return Response({"error": "No concepts found for this file. Upload the file first."}, status=404)

            # 2. Reconstruct the prompt using the database concepts
            concept_clause = f"Focus strictly on these extracted concepts: {', '.join(db_concepts)}."

            # Note: You'll need the text from the file. 
            # If you saved the OCR text in the File model earlier, use that.
            # If not, you might need to pass the text in the request or fetch from S3/Path.
            text_content = request.data.get("text") # Fallback if text is sent from frontend

            prompt = f"""
You are an exam question generator.

Generate 10 high-quality multiple-choice questions strictly based on the given concepts.

Concepts:
{db_concepts}

Rules:
- Each question must clearly relate to ONE of the provided concepts
- Provide exactly 4 options per question
- Only ONE option must be correct
- Use 0-based indexing for the correct answer
- The "concept" field must exactly match one of the given concepts
- Do NOT add explanations or extra text

Output ONLY valid JSON in the following format:

{{
  "questions": [
    {{
      "question": "Question text here",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correct_answer": 0,
      "concept": "Exact concept name it is realted to, Each question must clearly relate to ONE of the provided concepts"
    }}
  ]
}}
"""

            response = client.chat.completions.create(
                model="llama-3.3-70b-versatile",
                messages=[
                    {"role": "system", "content": "You are a quiz generation expert. Respond with valid JSON only."},
                    {"role": "user", "content": prompt}
                ],
                response_format={"type": "json_object"},
                temperature=0.7,
            )

            return Response(json.loads(response.choices[0].message.content), status=200)

        except File.DoesNotExist:
            return Response({"error": "File not found or unauthorized"}, status=404)

from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from allauth.socialaccount.models import SocialToken, SocialAccount
from django.http import JsonResponse
import urllib.parse
from django.http import JsonResponse
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from allauth.socialaccount.models import SocialAccount, SocialToken
import os

import urllib.parse  # <--- Add this import
from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials

@api_view(["GET"])
def dashboard_view(request):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    user = request.user
    social_account = SocialAccount.objects.filter(user=user, provider="google").first()
    extra_data = social_account.extra_data if social_account else {}
    photo_url = extra_data.get("picture")

    folder_list = [{"id": f.folder_id, "name": f.folder_name} for f in user.folders.all()]
    calendar_url = None

    try:
        token_obj = SocialToken.objects.get(account__user=user, account__provider="google")

        creds = Credentials(
            token=token_obj.token,
            refresh_token=token_obj.token_secret,
            token_uri="https://oauth2.googleapis.com/token",
            client_id=os.getenv("GOOGLE_CLIENT_ID"),
            client_secret=os.getenv("GOOGLE_CLIENT_SECRET"),
        )

        service = build("calendar", "v3", credentials=creds)
        
        # Get list of calendars
        calendar_list = service.calendarList().list().execute()
        kaksha_calendar_id = None

        for entry in calendar_list.get("items", []):
            if entry.get("summary") == "Kaksha Schedule":
                kaksha_calendar_id = entry["id"]
                break

        if not kaksha_calendar_id:
            # Create if not exists
            created_calendar = service.calendars().insert(
                body={"summary": "Kaksha Schedule", "timeZone": "Asia/Kolkata"}
            ).execute()
            kaksha_calendar_id = created_calendar["id"]

            try:
                service.acl().insert(
                    calendarId=kaksha_calendar_id,
                    body={"role": "reader", "scope": {"type": "default"}}
                ).execute()
            except Exception as acl_e:
                print(f"ACL Error (usually fine if already public): {acl_e}")

        # Encode ID for the URL
        encoded_id = urllib.parse.quote(kaksha_calendar_id)
        calendar_url = f"https://calendar.google.com/calendar/embed?src={encoded_id}&ctz=Asia%2FKolkata"

    except Exception as e:
        print("Calendar logic error:", e)
        # Fallback to primary calendar if logic fails
        encoded_email = urllib.parse.quote(user.email)
        calendar_url = f"https://calendar.google.com/calendar/embed?src={encoded_email}&ctz=Asia%2FKolkata"

    return JsonResponse({
        "status": "success",
        "first_name": user.first_name,
        "photo": photo_url,
        "folders": folder_list,
        "calendar_url": calendar_url,
    })

def calculate_sm2(quality, repetitions, interval, easiness_factor):
    """
    quality: 0-5 (0=blackout, 5=perfect)
    repetitions: current success streak
    interval: current interval in days
    easiness_factor: current EF
    """
    if quality >= 3:
        if repetitions == 0:
            interval = 1
        elif repetitions == 1:
            interval = 6
        else:
            interval = round(interval * easiness_factor)
        
        repetitions += 1
    else:  # Incorrect answer
        repetitions = 0
        interval = 1

    # Calculate new Easiness Factor
    easiness_factor = easiness_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02))
    if easiness_factor < 1.3:
        easiness_factor = 1.3

    return repetitions, interval, easiness_factor

from django.http import JsonResponse
from .models import Folder, File, Concept

def folder_full_detail(request, folder_id):
    if not request.user.is_authenticated:
        return JsonResponse({"error": "Unauthorized"}, status=401)

    try:
        # 1. Security check: Ensure the folder belongs to the user
        folder = Folder.objects.get(folder_id=folder_id, user=request.user)
        
        # 2. Get all files in this folder
        files = File.objects.filter(folder=folder)
        
        folder_data = {
            "folder_name": folder.folder_name,
            "files": []
        }

        for f in files:
            # 3. Get all concepts for each file
            concepts = Concept.objects.filter(file=f)
            
            concept_list = []
            for c in concepts:
                # Calculate accuracy for display
                total = (c.correct or 0) + (c.wrong or 0)
                accuracy = round((c.correct / total), 2) if total > 0 else 0
                
                concept_list.append({
                    "concept_id": c.concept_id,
                    "name": c.concept_name,
                    "accuracy": accuracy,
                    "next_review": c.next_review.strftime("%Y-%m-%d"),
                    "repetitions": c.repetitions
                })

            folder_data["files"].append({
                "file_id": f.file_id,
                "file_name": f.file_name,
                "concepts": concept_list
            })

        return JsonResponse(folder_data)

    except Folder.DoesNotExist:
        return JsonResponse({"error": "Folder not found"}, status=404)
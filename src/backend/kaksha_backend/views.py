from django.http import JsonResponse

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
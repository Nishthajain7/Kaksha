from django.contrib import admin
from django.urls import path, include
from .views import (
    OCRExtractView,
    KeyPointsView,
    QuizGenerationView,
    accuracy,
    folderUpload,
    fileUpload,
    auth
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/user/me/', auth, name='user_me'),
    
    path("accuracy/", accuracy, name="accuracy"),
    path("ocr/", OCRExtractView.as_view()),
    path("key-points/", KeyPointsView.as_view()),
    path("generate-quiz/", QuizGenerationView.as_view()),
    path("folderUpload/<str:folder_name>/", folderUpload, name="folderUpload"),
    path("fileUpload/<str:folder_name>/", fileUpload, name="fileUpload"),
]
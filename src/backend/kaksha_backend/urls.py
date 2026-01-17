from django.contrib import admin
from django.urls import path, include
from .views import (
    OCRExtractView,
    KeyPointsView,
    QuizGenerationView,
    folderUpload,
    fileUpload,
    auth,
    dashboard_view,        
    submit_quiz_result,   
    folder_full_detail   
)

urlpatterns = [
    path('admin/', admin.site.urls),
    path('accounts/', include('allauth.urls')),
    path('api/user/me/', auth, name='user_me'),
    path('api/dashboard/', dashboard_view, name='dashboard'),
    

    path("api/generate-quiz/", QuizGenerationView.as_view()),
    
    path("api/folderUpload/<str:folder_name>/", folderUpload, name="folderUpload"),
    path("api/fileUpload/<str:folder_name>/", fileUpload, name="fileUpload"),
    path("api/folder/<int:folder_id>/", folder_full_detail, name="folder_detail"), # Added
    
    path("api/submit-quiz/", submit_quiz_result, name="submit_quiz"), # Added
]
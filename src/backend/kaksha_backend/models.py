from django.db import models
from django.conf import settings # Crucial for referencing the User

class Folder(models.Model):
    folder_id = models.AutoField(primary_key=True)
    folder_name = models.CharField(max_length=255)
    
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name="folders"
    )

    class Meta:
        managed = True  
        db_table = 'folder'

class File(models.Model):
    file_id = models.AutoField(primary_key=True)
    file_name = models.CharField(max_length=255)

    folder = models.ForeignKey('Folder', on_delete=models.CASCADE, related_name="files")
    path = models.TextField(unique=True)

    class Meta:
        managed = True 
        db_table = 'file'

class Concept(models.Model):
    concept_id = models.AutoField(primary_key=True)
    file = models.ForeignKey('File', on_delete=models.CASCADE, related_name="concepts")
    concept_name = models.CharField(max_length=255)
    correct = models.IntegerField(default=0)
    wrong = models.IntegerField(default=0)

    class Meta:
        managed = True
        db_table = 'concept'
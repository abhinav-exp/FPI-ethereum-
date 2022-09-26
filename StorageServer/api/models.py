from django.db import models

# Create your models here.

class FileModel(models.Model):
    id = models.IntegerField(primary_key = True)
    field_name = models.BinaryField()
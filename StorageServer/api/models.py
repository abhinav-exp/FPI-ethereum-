from django.db import models

# Create your models here.

class FileModel(models.Model):
    unit_id = models.AutoField(primary_key=True)
    field_name = models.BinaryField()
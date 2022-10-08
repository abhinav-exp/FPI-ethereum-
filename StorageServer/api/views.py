from django.shortcuts import render, HttpResponse
from rest_framework.decorators import api_view
from .models import FileModel
from django.http import FileResponse

# Create your views here.
@api_view(['POST'])
def add(request):
    print(request.data)
    inputFile = request.data['FK']
    obj = FileModel(field_name = inputFile.read())
    obj.save()
    return HttpResponse(obj.pk)

@api_view(['GET'])
def show(request, num):
    obj = FileModel.objects.get(pk = num)
    outputFile = obj.field_name
    return HttpResponse(outputFile, content_type='image/jpeg')
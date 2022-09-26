from django.shortcuts import render, HttpResponse

# Create your views here.
def add(request):
    print(request.data)
    return HttpResponse("add")

def show(request):
    return HttpResponse("hello")
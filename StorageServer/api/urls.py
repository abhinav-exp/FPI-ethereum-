from django.urls import path
from . import views

urlpatterns = [
    path('add', views.add),
    path('show/<int:num>', views.show),
]
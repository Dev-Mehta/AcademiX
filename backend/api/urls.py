from django.urls import path
from api import views
urlpatterns = [
    path('booths-algorithm/', views.BoothsAlgorithmView.as_view(), name='booths-algorithm'),
]
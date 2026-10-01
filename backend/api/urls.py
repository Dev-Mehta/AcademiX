from django.urls import path
from api import views
urlpatterns = [
    path('booths-algorithm/', views.BoothsAlgorithm.as_view(), name='booths-algorithm'),
    path('get-all-articles/', views.GetAllArticles.as_view(), name='articles'),
    path('get-article/<str:title>/', views.GetArticle.as_view(), name='article'),
    path('get-prompts/<str:title>/', views.GetOrGeneratePrompts.as_view(), name='get-prompts'),
    path('get-recommendation/<str:title>/', views.GetSimilarArticles.as_view(), name='recommendation'),
    path('add-article/', views.AddArticle.as_view(), name='add-article'),
]


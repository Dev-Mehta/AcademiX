from django.http import JsonResponse
from django.views import View

class BoothsAlgorithm(View):
    def post(self, request):
        return JsonResponse({'message': 'Hello, World!'})
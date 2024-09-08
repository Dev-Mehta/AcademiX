from django.http import JsonResponse

class BoothsAlgorithmView:
    def post(self, request):
        return JsonResponse({'message': 'Hello, World!'})
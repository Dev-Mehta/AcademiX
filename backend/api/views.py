import logging
from django.http import JsonResponse
from django.views import View
from .helpers import add_binary, shift_right, negate

class BoothsAlgorithm(View):
    def get(self, request):
        _list = []
        num1 = self.request.GET.get('num1')
        num2 = self.request.GET.get('num2')
        try:
            assert num1 and num2, 'num1 and num2 are required'
            assert len(num1) == 8 and len(num2) == 8, 'num1 and num2 must be 8 bits long'
            assert all([bit in '01' for bit in num1]) and all([bit in '01' for bit in num2]), 'num1 and num2 must be binary numbers'
        except AssertionError as e:
            return JsonResponse({'error': str(e)}, status=400)
        steps = []
        ac = '00000000'
        qr = num1
        q_1 = '0'
        steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'Initial'})
        
        for i in range(len(num1)):
            last_bit = qr[-1]
            if last_bit + q_1 == '01':
                ac = add_binary(ac, num2)
                steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'A = A + M'})
            elif last_bit + q_1 == '10':
                ac = add_binary(ac, negate(num2))
                steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'A = A - M'})
            
            ac, qr, q_1 = shift_right(ac, qr, q_1)
            steps.append({'ac': ac, 'qr': qr, 'q_1': q_1, 'operation': 'Shift Right'})
        
        bin_result = ac + qr
        negated = False
        if bin_result[0] == '1':
            bin_result = negate(bin_result)
            negated = True
            
        num_result = int(bin_result, 2)
        if negated:
            num_result = -num_result
        
        steps.append({'ac': ac, 'qr': qr, 'q_1': num_result, 'operation': 'Result'})
        return JsonResponse({'result': num_result, 'steps': steps})
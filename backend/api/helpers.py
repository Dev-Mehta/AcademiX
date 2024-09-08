import logging
import math

def shift_right(ac, qr, q_1):
    """
    Performs arithmetic right shift on the given numbers
    """
    whole_string = ac[0] + ac + qr + q_1
    ac = whole_string[:8]
    qr = whole_string[8:16]
    q_1 = whole_string[16]
    return ac, qr, q_1

def add_binary(bin1: str, bin2: str):
    try:
        assert len(bin1) == len(bin2), 'Both binary numbers must be of the same length'
        assert all([bit in '01' for bit in bin1]) and all([bit in '01' for bit in bin2]), 'Both binary numbers must be binary numbers'
        
    except AssertionError as e:
        logging.error(str(e))
        raise e
    sum_result = ''
    carry = 0
    
    # Perform binary addition
    for i in range(7, -1, -1):
        bit_a = int(bin1[i])
        bit_b = int(bin2[i])
        bit_sum = bit_a + bit_b + carry
        sum_result = str(bit_sum % 2) + sum_result
        carry = bit_sum // 2
    return sum_result

def negate(bin_str: str):
    inverted = ''.join('1' if bit == '0' else '0' for bit in bin_str)
    inverted_int = int(inverted, 2) + 1
    return bin(inverted_int)[2:].zfill(len(bin_str))
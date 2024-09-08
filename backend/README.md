# API for Academix

Django API for algorithms and tools of Academix.

## Endpoints

Request:`/api/booths-algorithm/?num1={num1}&num2={num2}`
Params: `num1` and `num2` are integers.
Returns: 

```json
{
    "result": 0
    "steps": [
        {
        "ac": "00000000",
        "qr": "00000000",
        "q_1": "0",
        "operation": "Initial",
        },
        ...
    ]
}
```

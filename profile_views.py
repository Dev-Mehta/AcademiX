import time

import requests

url = "https://camo.githubusercontent.com/7e66f2f5e66c59a15798271c5ee7dea3029c1b6577c3804ad60d75bdd211c036/68747470733a2f2f6b6f6d617265762e636f6d2f67687076632f3f757365726e616d653d4465762d4d65687461"

while True:
    requests.get(url)
    time.sleep(1)
    print("Profile view sent")
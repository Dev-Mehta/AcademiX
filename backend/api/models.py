from django.db import models
from bs4 import BeautifulSoup

# Create your models here.
class Article(models.Model):
    def extract_first_paragraph(self, html):
        soup = BeautifulSoup(html, "html.parser")

        for p in soup.find_all("p"):
            text = p.get_text(strip=True)
            if len(text) > 50:
                return text

        return ""
    title = models.CharField(max_length=255)
    html = models.TextField()
    description = models.TextField(default='', blank=True)
    original_link = models.URLField()
    orbit_prompts = models.JSONField(default=list, blank=True)
    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.description and self.html:
            self.description = self.extract_first_paragraph(self.html)

        super().save(*args, **kwargs)

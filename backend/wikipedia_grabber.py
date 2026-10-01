wiki_links = open('wiki_links.txt', 'r').readlines()
wiki_links = [link.strip() for link in wiki_links]

import django
import os

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Article

from bs4 import BeautifulSoup
import requests, json
for link in wiki_links:
    try:
        title = link.split('/')[-1]
        if Article.objects.filter(title=title).exists():
            print(f"Article {title} already exists")
            continue
        headers = {
            # Format recommended by Wikimedia: <AppName>/<Version> (<ContactURL or Email>)
            "User-Agent": "AcademiX/1.0 (https://github.com/Dev-Mehta/AcademiX; contact@example.com)"
        }

        url = f"https://en.wikipedia.org/w/api.php?action=parse&page={title}&format=json&prop=text|sections"
        response = requests.get(url, headers=headers)
        print(url)
        data = json.loads(response.text)
        # hamera Canvas ------------------

        # javascript version
        # pageHTML = pageHTML.replaceAll("\"//upload.wikimedia.org/", "\"https://upload.wikimedia.org/");
        # // remove all elements with class editsection
        # pageHTML = pageHTML.replace(/<span class="mw-editsection">.*?<\/span>/g, "");
        # // remove all links with title that starts with Edit Section
        # pageHTML = pageHTML.replace(/<a.*?title="Edit section.*?<\/a>/g, "");
        # pageHTML = pageHTML.replace(/<span class="mw-editsection-bracket">.*?<\/span>/g, "");
        import re
        html = data['parse']['text']['*']
        html = html.replace(r'//upload.wikimedia.org/', 'https://upload.wikimedia.org/')
        html = re.sub(r'<span class="mw-editsection">.*?</span>', '', html)
        html = re.sub(r'<a.*?title="Edit section.*?</a>', '', html)
        html = re.sub(r'<span class="mw-editsection-bracket">.*?</span>', '', html)
        html = html.replace('href="/wiki', 'href="https://en.wikipedia.org/wiki')
        html = html.replace('src="/wiki', 'src="https://en.wikipedia.org/wiki')
    
        aritcle, created = Article.objects.get_or_create(title=title, html=html, original_link=link)

        if created:
            aritcle.save()
        print(f"Successfully fetched {link}")
    except Exception as e:
        print(f"Failed to fetch {link},{str(e)} {e}")

# from bs4 import BeautifulSoup
# from api.models import Article

# def extract_first_paragraph(html):
#     soup = BeautifulSoup(html, "html.parser")
#     for p in soup.find_all("p"):
#         text = p.get_text(strip=True)
#         if len(text) > 50:
#             return text
#     return ""
# articles = Article.objects.all()
# for article in articles:
#     article.description = extract_first_paragraph(article.html)
#     article.save()
#     print(f"Updated: {article.title}")

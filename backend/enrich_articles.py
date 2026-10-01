import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Article
from api.ai_prompts import inject_orbit_prompts_into_html

def enrich_articles(limit=None):
    """
    Enriches stored Wikipedia articles by inserting section-based
    <orbit-reviewarea> active recall cards directly into the article HTML.
    """
    articles = Article.objects.all()
    total = articles.count()
    if limit:
        articles = articles[:limit]

    print(f"Checking {total} articles for inline Orbit prompt enrichment...")
    count = 0
    for article in articles:
        if '<orbit-reviewarea' not in article.html:
            article.html = inject_orbit_prompts_into_html(article.html, article.title)
            article.save(update_fields=['html'])
            count += 1
            print(f"[{count}] Injected Orbit prompts into: {article.title}")
        else:
            print(f"Already contains Orbit prompts: {article.title}")

    print(f"\nCompleted! Enriched {count} articles.")

if __name__ == '__main__':
    import sys
    limit = int(sys.argv[1]) if len(sys.argv) > 1 else None
    enrich_articles(limit=limit)

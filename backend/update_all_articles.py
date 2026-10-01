import os
import time
import django
from bs4 import BeautifulSoup

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from api.models import Article
from api.ai_prompts import generate_and_inject_prompts

import sys
if hasattr(sys.stdout, 'reconfigure'):
    sys.stdout.reconfigure(encoding='utf-8')

def update_all_articles(limit=None):
    articles = list(Article.objects.all())
    if limit:
        articles = articles[:limit]
    total = len(articles)
    print(f"Starting Gemini update for {total} articles...\n", flush=True)

    success_count = 0
    failed_count = 0

    for idx, article in enumerate(articles, 1):
        print(f"[{idx}/{total}] Processing: {article.title}...", end="", flush=True)
        try:
            enriched_html, prompts = generate_and_inject_prompts(article.title, article.html)
            article.html = enriched_html
            article.orbit_prompts = prompts
            article.save(update_fields=['orbit_prompts', 'html'])
            success_count += 1
            print(f" -> [OK] {len(prompts)} prompts", flush=True)

            # Polite delay to respect Gemini rate limits
            time.sleep(2.0)

        except Exception as e:
            failed_count += 1
            print(f" -> [ERROR]: {e}", flush=True)
            time.sleep(3.0)

        except Exception as e:
            failed_count += 1
            print(f"   [ERROR] Updating {article.title}: {e}")
            time.sleep(4)

    print(f"\n==========================================")
    print(f"Finished! Successfully updated: {success_count}/{total} (Failed: {failed_count})")
    print(f"==========================================")

if __name__ == '__main__':
    limit_arg = int(sys.argv[1]) if len(sys.argv) > 1 else None
    update_all_articles(limit=limit_arg)

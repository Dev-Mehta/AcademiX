import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cleanArticleContent, decodeArticleTitle } from '@/lib/articleUtils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { RefreshCw, BookOpen } from 'lucide-react';

interface ArticleData {
    title: string;
    content: string;
    prompts?: any[];
}

interface Recommendation {
    title: string;
}

const Article = () => {
    const { title } = useParams<{ title: string }>();
    const [article, setArticle] = useState<ArticleData | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [prompts, setPrompts] = useState<any[]>([]);
    const [promptsLoading, setPromptsLoading] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchPrompts = useCallback(async (articleTitle: string, regenerate = false) => {
        setPromptsLoading(true);
        try {
            const url = `${import.meta.env.VITE_API_URL}/get-prompts/${encodeURIComponent(articleTitle)}/${regenerate ? '?regenerate=true' : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error('Failed to fetch prompts');
            const data = await res.json();
            if (data.prompts && data.prompts.length > 0) {
                setPrompts(data.prompts);
            }
            // If regenerating, reload the article to get the freshly injected HTML
            if (regenerate) {
                const artRes = await fetch(`${import.meta.env.VITE_API_URL}/get-article/${encodeURIComponent(articleTitle)}/`);
                if (artRes.ok) {
                    const artData = await artRes.json();
                    setArticle({
                        title: artData.title,
                        content: cleanArticleContent(artData.content),
                        prompts: artData.prompts
                    });
                }
            }
        } catch (error) {
            console.error("Failed to load prompts", error);
        } finally {
            setPromptsLoading(false);
        }
    }, []);

    useEffect(() => {
        const loadData = async () => {
            if (!title) return;
            setLoading(true);
            try {
                // Fetch article content
                const articleRes = await fetch(`${import.meta.env.VITE_API_URL}/get-article/${encodeURIComponent(title)}/`);
                if (!articleRes.ok) throw new Error("Article not found");
                const articleData = await articleRes.json();

                setArticle({
                    title: articleData.title,
                    content: cleanArticleContent(articleData.content),
                    prompts: articleData.prompts
                });

                // Fetch recommendations
                const recRes = await fetch(`${import.meta.env.VITE_API_URL}/get-recommendation/${encodeURIComponent(title)}/`);
                if (recRes.ok) {
                    const recData = await recRes.json();
                    setRecommendations(recData.recommendations || []);
                }

                if (articleData.prompts && articleData.prompts.length > 0) {
                    setPrompts(articleData.prompts);
                } else {
                    fetchPrompts(title, false);
                }

            } catch (error) {
                console.error("Failed to load article", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [title, fetchPrompts]);

    useEffect(() => {
        if (!loading && article && (window as any).Nutshell) {
            (window as any).Nutshell.start();
            (window as any).Nutshell.setOptions({
                dontEmbedHeadings: true,
            });
        }
    }, [loading, article]);

    if (loading || !article) {
        return (
            <div className="container max-w-4xl py-8 space-y-4">
                <Skeleton className="h-12 w-3/4" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-6 w-2/3" />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
                    {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 w-full" />)}
                </div>
            </div>
        );
    }

    // Count how many quick review decks are injected in the content
    const deckCount = (article.content.match(/quick-review-deck/g) || []).length;

    return (
        <div className="container max-w-4xl py-8 animate-in fade-in duration-500">
            {/* Header Title & Actions */}
            <div className="text-center mb-8 space-y-4">
                <h1 className="text-3xl md:text-5xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    {decodeArticleTitle(article.title)}
                </h1>

                <div className="flex items-center justify-center gap-3 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary font-medium">
                        <BookOpen className="h-3.5 w-3.5" />
                        {deckCount > 0 ? `${deckCount} Section Review${deckCount > 1 ? 's' : ''}` : `${prompts.length} Prompts`}
                    </span>

                    {title && (
                        <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => fetchPrompts(title, true)} 
                            disabled={promptsLoading}
                            className="h-7 text-xs gap-1.5 hover:text-foreground text-muted-foreground"
                        >
                            <RefreshCw className={`h-3 w-3 ${promptsLoading ? 'animate-spin' : ''}`} />
                            {promptsLoading ? "Generating Cards..." : "Regenerate AI Cards"}
                        </Button>
                    )}
                </div>
            </div>

            {recommendations && recommendations.length > 0 && (
                <div className="mb-8 p-6 bg-muted/30 rounded-lg border">
                    <h2 className="text-xl font-bold mb-4">Recommended Articles</h2>
                    <div className="flex flex-wrap gap-2">
                        {recommendations.map((rec) => (
                            <Button key={rec.title} variant="secondary" size="sm" asChild>
                                <Link to={`/article/${rec.title}`}>
                                    {decodeArticleTitle(rec.title)}
                                </Link>
                            </Button>
                        ))}
                    </div>
                </div>
            )}

            {/* Article Content with Interleaved Quick Review Cards */}
            <div
                className="prose prose-lg dark:prose-invert max-w-none 
                    prose-headings:font-bold prose-headings:tracking-tight
                    prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                    prose-img:rounded-lg prose-img:shadow-md"
                dangerouslySetInnerHTML={{ __html: article.content }}
            />
        </div>
    );
};

export default Article;

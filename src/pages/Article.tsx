import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { cleanArticleContent, decodeArticleTitle } from '@/lib/articleUtils';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ArticleData {
    title: string;
    content: string;
}

interface Recommendation {
    title: string;
}

const Article = () => {
    const { title } = useParams<{ title: string }>();
    const [article, setArticle] = useState<ArticleData | null>(null);
    const [recommendations, setRecommendations] = useState<Recommendation[] | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadData = async () => {
            if (!title) return;
            setLoading(true);
            try {
                // Fetch Article
                const articleRes = await fetch(`${import.meta.env.VITE_API_URL}/get-article/${title}`);
                const articleData = await articleRes.json();

                // Fetch Recommendations
                const recRes = await fetch(`${import.meta.env.VITE_API_URL}/get-recommendation/${title}`);
                const recData = await recRes.json();

                // Process Content
                const cleanedContent = cleanArticleContent(articleData.content);

                setArticle({ ...articleData, content: cleanedContent });
                setRecommendations(recData.recommendations?.slice(0, 5) || []);

            } catch (error) {
                console.error("Failed to load article", error);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, [title]);

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

    return (
        <div className="container max-w-4xl py-8 animate-in fade-in duration-500">
            <h1 className="text-3xl md:text-5xl font-extrabold mb-8 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                {decodeArticleTitle(article.title)}
            </h1>

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

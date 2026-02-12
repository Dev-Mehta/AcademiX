import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

import { Link } from 'react-router-dom';
import { ArrowRight, Plus, Search } from 'lucide-react';
import { decodeArticleTitle } from '@/lib/articleUtils';

interface ArticleSummary {
    title: string;
    description: string;
}

const ArticleList = () => {
    const [articles, setArticles] = useState<ArticleSummary[]>([]);
    const [filteredArticles, setFilteredArticles] = useState<ArticleSummary[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [articleUrl, setArticleUrl] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticles = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/get-all-articles`);
                const data = await res.json();
                setArticles(data);
                setFilteredArticles(data);
            } catch (error) {
                console.error("Failed to fetch articles", error);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const lowerQuery = searchQuery.toLowerCase();
        const filtered = articles.filter(article =>
            decodeArticleTitle(article.title).toLowerCase().includes(lowerQuery) ||
            (article.description && article.description.toLowerCase().includes(lowerQuery))
        );
        setFilteredArticles(filtered);
    }, [searchQuery, articles]);

    const handleAddArticle = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!articleUrl) return;

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL}/add-article/?url=` + encodeURIComponent(articleUrl));
            const data = await res.json();

            if (data.error) {
                alert(`Error: ${data.error}`);
            } else {
                alert(data.message);
                // Refresh list potentially?
            }
        } catch (error) {
            alert('Failed to add article');
        }
        setArticleUrl('');
    };

    return (
        <div className="container py-8 space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                <div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Articles</h1>
                    <p className="text-muted-foreground mt-2">Explore various computer science topics.</p>
                </div>

                <div className="flex gap-2 w-full md:w-auto">
                    <div className="relative w-full md:w-[300px]">
                        <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                        <input
                            placeholder="Search articles..."
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-8 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            {/* Add Article Form */}
            <Card>
                <CardContent className="pt-6">
                    <form onSubmit={handleAddArticle} className="flex gap-4 items-end">
                        <div className="grid w-full items-center gap-1.5">
                            <label htmlFor="articleUrl" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">Add New Article</label>
                            <input
                                id="articleUrl"
                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                placeholder="Enter Wikipedia URL..."
                                value={articleUrl}
                                onChange={(e) => setArticleUrl(e.target.value)}
                            />
                        </div>
                        <Button type="submit">
                            <Plus className="mr-2 h-4 w-4" /> Add
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* List */}
            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {Array.from({ length: 6 }).map((_, i) => (
                        <div key={i} className="h-[150px] w-full bg-muted rounded-xl animate-pulse" />
                    ))}
                </div>
            ) : filteredArticles.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                    <div className="text-6xl mb-4">📚</div>
                    <h3 className="text-xl font-semibold mb-2">No articles found</h3>
                    <p className="text-muted-foreground">
                        {searchQuery
                            ? `No articles match "${searchQuery}". Try a different search term.`
                            : "No articles available yet. Add one using the form above!"}
                    </p>
                </div>
            ) : (
                <>
                    {searchQuery && (
                        <div className="text-sm text-muted-foreground mb-4">
                            Found {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''} matching "{searchQuery}"
                        </div>
                    )}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredArticles.map((article) => (
                            <Link key={article.title} to={`/article/${article.title}`}>
                                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer hover:border-primary/50">
                                    <CardContent className="p-6 flex flex-col h-full justify-between">
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 line-clamp-2">
                                                {decodeArticleTitle(article.title)}
                                            </h3>
                                            <p className="text-muted-foreground text-sm line-clamp-3">
                                                {article.description || "No description available."}
                                            </p>
                                        </div>
                                        <div className="mt-4 flex items-center text-primary font-medium text-sm group">
                                            Read Article <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default ArticleList;

import { useState, useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';
import { toolsData } from "@/data/tools";
import { Link } from "react-router-dom";
import { ExternalLink, ArrowRight } from "lucide-react";
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

const Home = () => {
    const [articles, setArticles] = useState<{ title: string }[]>([]);

    useEffect(() => {
        const fetchArticles = async () => {
            try {
                const res = await fetch(`${import.meta.env.VITE_API_URL}/get-all-articles`);
                if (!res.ok) throw new Error('Failed to fetch');
                const data = await res.json();
                const articles_random_5 = data.sort(() => Math.random() - Math.random()).slice(0, 5);
                setArticles(articles_random_5);
            } catch (error) {
                console.error("Failed to fetch articles:", error);
                // Fallback or empty state could be handled here
            }
        };

        fetchArticles();

        if ((window as any).Nutshell) {
            (window as any).Nutshell.start();
            (window as any).Nutshell.setOptions({
                dontEmbedHeadings: true,
            });
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center space-y-8 py-8 animate-in fade-in duration-500">
            <div className="text-center space-y-4 max-w-3xl">
                <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-blue-600 bg-clip-text text-transparent">
                    AcademiX
                </h1>
                <p className="text-xl md:text-2xl font-medium text-muted-foreground">
                    Academics Extended
                </p>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                    Making computer science topics intuitive, interactive, and relevant to the real world.
                </p>
            </div>

            <Accordion type="multiple" className="w-full max-w-4xl" defaultValue={['item-1', 'tools', 'articles']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-xl font-bold">What is AcademiX?</AccordionTrigger>
                    <AccordionContent className="text-base space-y-4 text-muted-foreground leading-relaxed">
                        <p>
                            You might be sitting in your discrete mathematics class wondering, "Why do we study this? Nobody uses set theory in real life, right?"
                            <span className="italic block mt-2 pl-4 border-l-2 border-primary">
                                "We might not use set theory or any topic like we do in an academic setting. We use these topics intuitively and unknowingly in our day-to-day life."
                            </span>
                        </p>
                        <p>
                            We, at AcademiX have just one little goal - we want you to think of the nitty gritty details of a computer science subject not as a means to pass an exam and get a bachelors degree, but as a tool in your toolbox that you can use to solve real world problems.
                            <span className="italic block mt-2 pl-4 border-l-2 border-primary">
                                "AcademiX is a place where you can interlink computer science topics and get an idea of why we study a topic x in our bachelors degree."
                            </span>
                        </p>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="tools">
                    <AccordionTrigger className="text-xl font-bold">Interactive Tools</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-4 md:grid-cols-2">
                            {toolsData.slice(0, 6).map((tool) => (
                                <Card key={tool.id} className="hover:bg-muted/50 transition-colors">
                                    <CardContent className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <Link to={tool.path} className="font-semibold text-primary hover:underline flex items-center gap-1">
                                                {tool.title}
                                                <ArrowRight className="h-4 w-4" />
                                            </Link>
                                            <a href={tool.wikiLink} target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">
                                                <ExternalLink className="h-4 w-4" />
                                            </a>
                                        </div>
                                        <p className="text-sm text-muted-foreground line-clamp-2">
                                            {tool.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                        <div className="mt-4 text-center">
                            <Button variant="outline" asChild>
                                <Link to="/tools">View All Tools</Link>
                            </Button>
                        </div>
                    </AccordionContent>
                </AccordionItem>

                <AccordionItem value="articles">
                    <AccordionTrigger className="text-xl font-bold">Latest Articles</AccordionTrigger>
                    <AccordionContent>
                        <div className="grid gap-3">
                            {articles.length > 0 ? (
                                articles.map((article) => (
                                    <Link
                                        key={article.title}
                                        to={`/article/${article.title}`}
                                        className="block p-4 rounded-lg bg-secondary/50 hover:bg-secondary transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-medium text-lg capitalize">
                                                {decodeURI(article.title).replace(/_/g, ' ')}
                                            </span>
                                            <ArrowRight className="h-4 w-4 text-muted-foreground" />
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-muted-foreground italic">Loading articles...</p>
                            )}
                            <div className="mt-2 text-center">
                                <Button variant="link" asChild>
                                    <Link to="/articles">All Articles</Link>
                                </Button>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    );
}

export default Home;

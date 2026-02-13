import React from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CopyBlock, dracula } from 'react-code-blocks';
import { cn } from "@/lib/utils";
import { useEffect } from 'react';
interface AlgorithmPageLayoutProps {
    title: string;
    description?: string;
    resources?: { label: string; url: string }[];
    codeSnippet?: string;
    controls?: React.ReactNode;
    children: React.ReactNode;
    className?: string;
}

const AlgorithmPageLayout = ({
    title,
    description,
    resources,
    codeSnippet,
    controls,
    children,
    className
}: AlgorithmPageLayoutProps) => {
    useEffect(() => {
            // Initialize Nutshell if available
            if ((window as any).Nutshell) {
                (window as any).Nutshell.start();
            }
        }, []);
    return (
        <div className={cn("container max-w-5xl py-8 space-y-8 animate-in fade-in duration-500", className)}>
            <div className="space-y-4 text-center">
                <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight lg:text-5xl bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                    {title}
                </h1>
                {description && (
                    <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                        {description}
                    </p>
                )}
                {resources && resources.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-4 text-left text-sm">
                        {resources.map((resource, idx) => (
                            <a
                                key={idx}
                                href={resource.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-primary hover:underline underline-offset-4 transition-colors"
                            >
                                :{resource.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
                <div className="space-y-6">
                    {/* Controls Section */}
                    {controls && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Input & Controls</CardTitle>
                                <CardDescription>Configure the algorithm parameters.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                {controls}
                            </CardContent>
                        </Card>
                    )}

                    {/* Code Section */}
                    {codeSnippet && (
                        <Card>
                            <CardHeader>
                                <CardTitle>Implementation</CardTitle>
                            </CardHeader>
                            <CardContent className="p-0 overflow-hidden rounded-b-lg">
                                <Accordion type="single" collapsible className="w-full">
                                    <AccordionItem value="code" className="border-0">
                                        <AccordionTrigger className="px-6 py-4 hover:bg-muted/50 hover:no-underline">
                                            View Code
                                        </AccordionTrigger>
                                        <AccordionContent className="p-0">
                                            <div className="max-h-[400px] overflow-y-auto">
                                                <CopyBlock
                                                    text={codeSnippet}
                                                    language="javascript"
                                                    theme={dracula}
                                                    showLineNumbers={true}
                                                    wrapLines={true}
                                                    codeBlock
                                                />
                                            </div>
                                        </AccordionContent>
                                    </AccordionItem>
                                </Accordion>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Visualization / Output Section */}
                <div className="space-y-6">
                    <Card className="h-full min-h-[400px]">
                        <CardHeader>
                            <CardTitle>Visualization</CardTitle>
                            <CardDescription>Step-by-step execution.</CardDescription>
                        </CardHeader>
                        <CardContent className="overflow-x-auto">
                            {children}
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default AlgorithmPageLayout;

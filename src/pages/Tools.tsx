import { useEffect, useMemo } from "react";
import { toolsData, Tool } from "@/data/tools";
import ToolCard from "@/components/ToolCard";



const Tools = () => {
    useEffect(() => {
        // Initialize Nutshell if available
        if ((window as any).Nutshell) {
            (window as any).Nutshell.start();
        }
    }, []);

    const toolsByCategory = useMemo(() => {
        const grouped: Record<string, Tool[]> = {};
        toolsData.forEach(tool => {
            if (!grouped[tool.category]) {
                grouped[tool.category] = [];
            }
            grouped[tool.category].push(tool);
        });
        return grouped;
    }, []);

    const categories = ["Computer Organization", "Discrete Math", "Algorithms", "Other"];

    return (
        <div className="container py-6 md:py-8 space-y-6 md:space-y-8">
            <div className="text-center space-y-3 md:space-y-4 px-4">
                <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight lg:text-5xl">Interactive Tools</h1>
                <p className="text-base md:text-xl text-muted-foreground max-w-2xl mx-auto">
                    Visualize and understand complex computer science algorithms through our interactive tools.
                </p>
            </div>

            {categories.map((category) => {
                const categoryTools = toolsByCategory[category];
                if (!categoryTools?.length) return null;

                return (
                    <div key={category} className="space-y-3 md:space-y-4">
                        <div className="flex items-center gap-2 border-b pb-2 px-2 md:px-0">
                            <h2 className="text-xl md:text-2xl font-bold tracking-tight">{category}</h2>
                            <span className="text-sm text-muted-foreground">({categoryTools.length})</span>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
                            {categoryTools.map((tool) => (
                                <ToolCard key={tool.id} tool={tool} />
                            ))}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default Tools;

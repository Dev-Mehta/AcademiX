import { Link as RouterLink } from "react-router-dom";
import { Link as LinkIcon, ExternalLink } from "lucide-react";
import { Tool } from "@/data/tools";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ToolCardProps {
    tool: Tool;
}

const ToolCard = ({ tool }: ToolCardProps) => {
    return (
        <Card className="hover:shadow-md transition-shadow h-full">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center gap-4 h-full">
                <div className="flex flex-1 items-start gap-3 sm:gap-4 min-w-0">
                    <div className="flex-shrink-0 bg-primary/10 p-2 rounded-full mt-0.5 sm:mt-0">
                        <LinkIcon className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <div className="flex-grow min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-base sm:text-lg truncate">
                                <RouterLink
                                    to={tool.path}
                                    className="hover:underline hover:text-primary transition-colors"
                                >
                                    {tool.title}
                                </RouterLink>
                            </h3>
                            <a
                                href={tool.wikiLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-muted-foreground hover:text-foreground transition-colors flex-shrink-0 flex items-center"
                                title="Learn more on Wikipedia"
                            >
                                <ExternalLink className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                            </a>
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                            {tool.description}
                        </p>
                    </div>
                </div>

                {/* Action Button */}
                {/* Mobile: Full width. Desktop: Auto width. */}
                <div className="flex-shrink-0 w-full sm:w-auto pt-2 sm:pt-0">
                    <Button asChild variant="secondary" size="sm" className="w-full sm:w-auto">
                        <RouterLink to={tool.path}>Open Tool</RouterLink>
                    </Button>
                </div>

            </CardContent>
        </Card>
    );
};

export default ToolCard;
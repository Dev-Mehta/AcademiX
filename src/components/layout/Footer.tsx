import { Github } from "lucide-react";

const Footer = () => {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8 md:py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div>
                        <h3 className="text-lg font-semibold mb-4">AcademiX</h3>
                        <p className="text-muted-foreground text-sm max-w-xs">
                            Making computer science topics interactive and easy to understand. Not just for exams, but for life.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Resources</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="/tools" className="hover:text-foreground transition-colors">Tools</a></li>
                            <li><a href="/articles" className="hover:text-foreground transition-colors">Articles</a></li>
                            <li><a href="#" className="hover:text-foreground transition-colors">Documentation</a></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-sm font-semibold mb-4 uppercase tracking-wider">Connect</h4>
                        <div className="flex space-x-4">
                            <a href="https://github.com/Dev-Mehta/Academix" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground transition-colors">
                                <Github className="h-5 w-5" />
                                <span className="sr-only">GitHub</span>
                            </a>
                            {/* Add more social links as needed */}
                        </div>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} Academix. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;

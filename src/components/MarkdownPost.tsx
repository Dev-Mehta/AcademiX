import { useState, useEffect } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownPostProps {
    filePath: string;
}

const MarkdownPost = ({ filePath }: MarkdownPostProps) => {
    const [content, setContent] = useState('');

    useEffect(() => {
        if (filePath) {
            fetch(filePath)
                .then(res => res.text())
                .then(text => setContent(text))
                .catch(err => console.error("Failed to load markdown content:", err));
        }
    }, [filePath]);

    return (
        <div className="container max-w-4xl py-8 prose dark:prose-invert mx-auto">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
    );
};

export default MarkdownPost;

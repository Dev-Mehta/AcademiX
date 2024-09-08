import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import file from "../content/discrete-math.md";
import { useEffect, useState } from "react";

const DiscreteMath = () => {
    const [content, setContent] = useState<string>('');
    useEffect(() => {
        fetch(file)
            .then(response => response.text())
            .then(text => {
                setContent(text);
            });
    }, []);
    return (
        <div className="my-8 mx-auto prose">
            <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
        </div>
    )
}

export default DiscreteMath;
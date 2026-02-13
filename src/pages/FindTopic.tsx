import { useParams } from "react-router-dom";
import MarkdownPost from "../components/MarkdownPost";
import setTheoryFile from "../content/set-theory.md";
import discreteMathFile from "../content/discrete-math.md";

const FindTopic = () => {
    const { topic } = useParams();

    if (topic === 'set-theory') {
        return <MarkdownPost filePath={setTheoryFile} />;
    }

    if (topic === 'discrete-mathematics') {
        return <MarkdownPost filePath={discreteMathFile} />;
    }

    return (
        <div className="flex justify-center items-center h-full">
            <h1 className="text-3xl font-bold text-destructive">404 Topic Not Found</h1>
        </div>
    );
};

export default FindTopic;

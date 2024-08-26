import { useState, useRef } from "react";
import { ForceGraph2D } from "react-force-graph";

const WarshallAlgorithm = () => {
    const [graph, setGraph] = useState<number[][]>([]);
    const [vertices, setVertices] = useState(0);
    const [distances, setDistances] = useState<number[][]>([]);
    const [paths, setPaths] = useState<{ from: number; to: number; path: string; distance: number; }[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [iterations, setIterations] = useState<number[][][]>([]);

    const handleVerticesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseInt(e.target.value);
        if (!isNaN(v) && v > 0) {
            setVertices(v);
            setGraph(Array(v).fill(null).map(() => Array(v).fill(0)));
        }
    };

    const handleGraphChange = (row: number, col: number, value: string) => {
        const newGraph = [...graph];
        const parsedValue = value.trim().toLowerCase();
        if (parsedValue === 'inf') {
            newGraph[row][col] = Infinity;
        } else {
            const numericValue = parseFloat(parsedValue);
            newGraph[row][col] = isNaN(numericValue) ? Infinity : numericValue;
        }
        setGraph(newGraph);
    };

    const floydWarshall = () => {
        const dist = Array.from({ length: vertices }, () => Array(vertices).fill(Infinity));
        const next = Array.from({ length: vertices }, () => Array(vertices).fill(null));

        for (let i = 0; i < vertices; i++) {
            dist[i][i] = 0;
        }

        for (let u = 0; u < vertices; u++) {
            for (let v = 0; v < vertices; v++) {
                if (graph[u][v] !== Infinity) {
                    dist[u][v] = graph[u][v];
                    next[u][v] = v;
                }
            }
        }

        const iterationSnapshots = [];

        for (let k = 0; k < vertices; k++) {
            for (let i = 0; i < vertices; i++) {
                for (let j = 0; j < vertices; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];
                    }
                }
            }

            // Save the state of the distance matrix after each iteration
            iterationSnapshots.push(dist.map(row => row.slice()));
        }

        setDistances(dist);
        if (next !== null) {
            calculatePaths(next, dist);
        }
        setIterations(iterationSnapshots as number[][][]);
        setShowResults(true);
    };

    const calculatePaths = (next: number[][], dist: number[][]) => {
        const allPaths = [];

        for (let i = 0; i < vertices; i++) {
            for (let j = 0; j < vertices; j++) {
                if (i !== j) {
                    const path = constructPath(next, i, j);
                    if (path.length > 0) {
                        allPaths.push({
                            from: i + 1,  // Convert to 1-based indexing
                            to: j + 1,    // Convert to 1-based indexing
                            path: path.map(p => p === null ? '' : p + 1).join(' -> '),  // Convert to 1-based indexing
                            distance: dist[i][j]
                        });
                    }
                }
            }
        }

        setPaths(allPaths);
    };

    const constructPath = (next: number[][], start: number | null, end: number) => {
        if (start !== null) {
            if (next[start][end] === null) {
                return [];
            }
        }
        const path = [start];
        while (start !== end) {
            if (start !== null)
                start = next[start][end];
            if (start === null) {
                return [];
            }
            path.push(start);
        }
        return path;
    };
    const outputRef = useRef<HTMLDivElement>(null);
    return (
        <div className="m-4 flex flex-col md:flex-row gap-4">
            <div ref={outputRef}>
                <p className="font-bold text-2xl">Floyd-Warshall Algorithm</p>

                <div>
                    <label>Number of vertices: </label>
                    <input
                        type="number"
                        value={vertices}
                        onChange={handleVerticesChange}
                        min="1"
                    />
                </div>

                {vertices > 0 && (
                    <div>
                        <p>Enter Adjacency Matrix (use 'inf' for infinity):</p>
                        {graph.map((row, i) => (
                            <div key={i}>
                                {row.map((value, j) => (
                                    <input
                                        className="border rounded-md p-1"
                                        key={j}
                                        type="text"
                                        value={value === Infinity ? 'inf' : value}
                                        onChange={(e) => handleGraphChange(i, j, e.target.value)}
                                        style={{ width: '50px', margin: '2px' }}
                                    />
                                ))}
                            </div>
                        ))}
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-2" onClick={floydWarshall}>
                            Run Floyd-Warshall Algorithm
                        </button>
                    </div>
                )}

                {showResults && (
                    <div className="my-4">
                        <p className="my-1 font-bold">Distance Matrix Iterations:</p>

                        {iterations.map((iteration, index) => (
                            <div key={index}>
                                <i>Iteration {index + 1}</i>
                                <table className="border border-collapse my-2">
                                    <tbody>
                                        <tr className="border">
                                            <th className="p-2 border">-</th> {/* Empty cell */}
                                            {iteration[0].map((_, j) => (
                                                <th key={`header-${j}`} className="border p-2">{j + 1}</th>
                                            ))}
                                        </tr>
                                        {iteration.map((row, i) => (
                                            <tr className="border" key={`row-${i}`}>
                                                <th className="border p-2">{i + 1}</th>
                                                {row.map((value, j) => (
                                                    <td
                                                        className="border p-2 text-center"
                                                        key={`cell-${i}-${j}`}>
                                                        {value === Infinity ? 'inf' : value}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ))}




                        <i>Final Shortest Path Matrix</i>
                        <table className="border border-collapse">
                            <tbody>
                                <tr>
                                    <th className="border p-2">-</th> {/* Empty cell */}
                                    {distances[0].map((_, j) => (
                                        <th key={`final-header-${j}`} className="border p-2">{j + 1}</th>
                                    ))}
                                </tr>
                                {distances.map((row, i) => (
                                    <tr key={`final-row-${i}`}>
                                        <th className="border p-2">{i + 1}</th>
                                        {row.map((value, j) => (
                                            <td key={`final-cell-${i}-${j}`} className="border p-2 text-center">
                                                {value === Infinity ? 'inf' : value}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>


                        <p className="font-bold text-xl my-4">Paths:</p>
                        {paths.map((path, index) => (
                            <div key={index}>
                                <p>
                                    Shortest path from <span className="text-red-800 font-bold">{path.from}</span> to
                                    <span className="text-blue-800 font-bold"> {path.to}</span>: {path.path}, Distance: {path.distance}
                                </p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
            <div>
                { showResults && (
                    <ForceGraph2D
                        graphData={{
                            nodes: Array.from({ length: vertices }, (_, i) => ({ id: i })),
                            links: graph
                                .map((row, i) => row.map((value, j) => ({ source: i, target: j, value })))
                                .flat()
                                .filter(link => link.value !== Infinity)
                            
                        }}
                        linkWidth={2}
                        linkDirectionalArrowLength={3.5}
                        linkDirectionalArrowRelPos={1}
                        width={document.documentElement.clientWidth - (outputRef.current?.clientWidth ?? 0) - 100}
                        nodeCanvasObject={(node, ctx, globalScale) => {
                            const label = node.id;
                            const fontSize = 12 / globalScale;
                            ctx.font = `${fontSize}px Sans-Serif`;
                            const textWidth = ctx.measureText(String(label ?? '')).width;
                            const bckgDimensions = [textWidth, fontSize].map(n => n + fontSize * 0.2); // some padding
        
                            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                            ctx.fillRect((node.x ?? 0) - bckgDimensions[0] / 2, node.y ? node.y - bckgDimensions[1] / 2 : 0, bckgDimensions[0], bckgDimensions[1]);
        
                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#000';
                            ctx.fillText(String(label), node.x ?? 0, (node.y ?? 0));
        
                            node.__bckgDimensions = bckgDimensions; // to re-use in nodePointerAreaPaint
                        }}
                        nodePointerAreaPaint={(node, color, ctx) => {
                            ctx.fillStyle = color;
                            const bckgDimensions = node.__bckgDimensions;
                            // eslint-disable-next-line @typescript-eslint/no-unused-expressions
                            bckgDimensions && ctx.fillRect((node.x ?? 0) - bckgDimensions[0] / 2, node.y ? node.y - bckgDimensions[1] / 2 : 0, bckgDimensions[0], bckgDimensions[1]);
                        }}
                        linkColor={() => 'rgba(0, 0, 0, 1)'}
                    />
                )}
            </div>
        </div>
    );
}

export default WarshallAlgorithm;
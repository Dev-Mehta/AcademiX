/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useRef, useEffect } from "react";
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import ForceGraph2D from 'react-force-graph-2d';

interface PathResult {
    from: number;
    to: number;
    path: string;
    distance: number;
}

const WarshallAlgorithm = () => {
    const [vertices, setVertices] = useState<number>(4);
    const [graph, setGraph] = useState<(number | string)[][]>([]);
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [paths, setPaths] = useState<PathResult[]>([]);
    const [showResults, setShowResults] = useState(false);
    const [iterations, setIterations] = useState<number[][][]>([]);
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 500 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 500
                });
            }
        };

        updateDimensions(); // Set initial dimensions
        window.addEventListener('resize', updateDimensions);

        // Init default graph
        initGraph(4);

        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const initGraph = (v: number) => {
        // Create an empty graph with some defaults? Or just empty.
        // Let's create empty except diagonal 0.
        const newGraph = Array(v).fill(null).map(() => Array(v).fill(''));
        for (let i = 0; i < v; i++) newGraph[i][i] = 0;
        setGraph(newGraph);
        setVertices(v);
        setShowResults(false);
    };

    const handleVerticesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const v = parseInt(e.target.value);
        if (isNaN(v) || v < 1) return; // Don't update if invalid immediately or handle blur?
        if (v > 10) {
            // cap at 10 to prevent massive UI
            return;
        }
        initGraph(v);
    };

    const handleGraphChange = (row: number, col: number, value: string) => {
        const newGraph = [...graph];
        newGraph[row][col] = value;
        setGraph(newGraph);
        setErrorMessage("");
    };

    const parseGraph = () => {
        const parsedGraph: number[][] = [];
        for (let i = 0; i < vertices; i++) {
            const row: number[] = [];
            // Safety check: ensure graph[i] exists
            if (!graph[i]) {
                return null;
            }
            for (let j = 0; j < vertices; j++) {
                const val = graph[i][j];
                if (i === j) {
                    row.push(0);
                    continue;
                }
                const sVal = String(val).trim().toLowerCase();
                if (sVal === '' || sVal === 'inf' || sVal === 'infinity') {
                    row.push(Infinity);
                } else {
                    const num = parseFloat(sVal);
                    if (isNaN(num)) {
                        setErrorMessage(`Invalid value at[${i + 1},${j + 1}]: ${val} `);
                        return null;
                    }
                    row.push(num);
                }
            }
            parsedGraph.push(row);
        }
        return parsedGraph;
    };

    const floydWarshall = () => {
        const dist = parseGraph();
        if (!dist) return;

        const next = Array.from({ length: vertices }, () => Array(vertices).fill(null));

        // Initialize next
        for (let i = 0; i < vertices; i++) {
            for (let j = 0; j < vertices; j++) {
                if (dist[i][j] !== Infinity) {
                    next[i][j] = j;
                }
            }
        }

        const iterationSnapshots = [];
        // Initial state
        iterationSnapshots.push(dist.map(row => row.slice()));

        for (let k = 0; k < vertices; k++) {
            for (let i = 0; i < vertices; i++) {
                for (let j = 0; j < vertices; j++) {
                    if (dist[i][j] > dist[i][k] + dist[k][j]) {
                        dist[i][j] = dist[i][k] + dist[k][j];
                        next[i][j] = next[i][k];
                    }
                }
            }
            iterationSnapshots.push(dist.map(row => row.slice()));
        }

        setIterations(iterationSnapshots as number[][][]);
        calculatePaths(next, dist);
        setShowResults(true);
    };

    const constructPath = (next: any[][], u: number, v: number) => {
        if (next[u][v] === null) return [];
        const path = [u];
        while (u !== v) {
            u = next[u][v];
            path.push(u);
        }
        return path;
    };

    const calculatePaths = (next: any[][], dist: number[][]) => {
        const allPaths: PathResult[] = [];
        for (let i = 0; i < vertices; i++) {
            for (let j = 0; j < vertices; j++) {
                if (i !== j && dist[i][j] !== Infinity) {
                    const p = constructPath(next, i, j);
                    allPaths.push({
                        from: i + 1,
                        to: j + 1,
                        path: p.map(x => x + 1).join(' -> '),
                        distance: dist[i][j]
                    });
                }
            }
        }
        setPaths(allPaths);
    };

    // Links for visualization
    const getLinks = () => {
        // Based on INPUT graph, not Result graph? Usually visualizations show input topology.
        // Or result? Input is better for understanding "Shortest Path ON this graph".
        // The Floyd Warshall result adds "shortcut" edges conceptually.
        // Let's visualize the INPUT graph.
        const links: any[] = [];
        const parsed = parseGraph();
        if (!parsed) return [];

        for (let i = 0; i < vertices; i++) {
            for (let j = 0; j < vertices; j++) {
                if (i !== j && parsed[i][j] !== Infinity) {
                    links.push({ source: i, target: j, label: String(parsed[i][j]) }); // nodes 0-indexed for simplicity in data
                }
            }
        }
        return links;
    };

    return (
        <AlgorithmPageLayout
            title="Floyd-Warshall Algorithm"
            description="Find shortest paths in a directed weighted graph with positive or negative edge weights (but with no negative cycles)."
            resources={[
                { label: "Wikipedia", url: "https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm" }
            ]}
            controls={
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Number of Vertices (1-10)</label>
                        <Input
                            type="number"
                            min="1"
                            max="10"
                            value={vertices}
                            onChange={handleVerticesChange}
                        />
                    </div>

                    {vertices > 0 && (
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Adjacency Matrix (Weights)</label>
                            <div className="overflow-x-auto p-2 border rounded-md max-w-full">
                                <table className="border-collapse w-full">
                                    <tbody>
                                        {graph.map((row, i) => (
                                            <tr key={i}>
                                                {row.map((val, j) => (
                                                    <td key={j} className="p-1 min-w-[50px]">
                                                        <input
                                                            className={`w-full h-8 text-center border rounded text-sm ${i === j ? "bg-gray-100 text-gray-400" : ""} `}
                                                            value={i === j ? 0 : val}
                                                            onChange={(e) => handleGraphChange(i, j, e.target.value)}
                                                            disabled={i === j}
                                                            placeholder="inf"
                                                        />
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <p className="text-xs text-muted-foreground">Use 'inf' or leave empty for no edge.</p>
                        </div>
                    )}

                    {errorMessage && <p className="text-sm text-destructive">{errorMessage}</p>}

                    <Button onClick={floydWarshall} className="w-full">
                        Run Algorithm
                    </Button>
                </div>
            }
        >
            <div className="space-y-6" style={{overflowX: 'scroll'}}>
                {showResults && (
                    <>
                        <div className="p-4 border rounded-lg bg-slate-50">
                            <h3 className="font-bold text-lg mb-2">Shortest Paths</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 text-sm">
                                {paths.map((p, idx) => (
                                    <div key={idx} className="bg-white p-2 text-xs border rounded shadow-sm">
                                        <span className="font-bold">{p.from} → {p.to}</span>: {p.distance}
                                        <br />
                                        <span className="text-muted-foreground">{p.path}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 overflow-x-auto">
                            <h3 className="font-bold text-lg">Process Iterations</h3>
                            {/* <div className="flex md:flex-col md:w-[200px] gap-4 overflow-x-auto pb-4"> */}
                            <div className="flex  md:flex-col gap-4 overflow-x-auto pb-4 max-w-full">    
                                {iterations.map((iter, k) => (
                                    <div key={k} className="min-w-[200px] border p-2 rounded bg-white">
                                        <p className="text-center text-xs font-bold mb-1">
                                            {k === 0 ? "Initial" : `Step k = ${k} `}
                                        </p>
                                        {/* <table className="w-full text-center text-xs border-collapse"> */}
                                        <table className="w-full text-center text-xs border-collapse">
                                            <tbody>
                                                {iter.map((row, r) => (
                                                    <tr key={r}>
                                                        {row.map((val, c) => (
                                                            <td key={c} className={`border p - 1 ${val === Infinity ? "text-gray-400" : ""} `}>
                                                                {val === Infinity ? "∞" : val}
                                                            </td>
                                                        ))}
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}

                <div ref={containerRef} className="border rounded-lg overflow-hidden bg-white relative h-[500px]">
                    {/* Graph Visualization of INPUT */}
                    <ForceGraph2D
                        width={dimensions.width}
                        height={dimensions.height}
                        graphData={{
                            nodes: Array.from({ length: vertices }).map((_, i) => ({ id: i, label: String(i + 1) })),
                            links: getLinks() // dynamic func call or state? Func call on render is fine if fast.
                        }}
                        nodeLabel="label"
                        linkLabel="label"
                        linkDirectionalArrowLength={5}
                        linkDirectionalArrowRelPos={1}
                        linkCurvature={0.2}
                        nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
                            const label = node.label || String(node.id);
                            const fontSize = 14 / globalScale;
                            ctx.font = `${fontSize}px Sans-Serif`;
                            const textWidth = ctx.measureText(label).width;
                            const bckgDimensions = [textWidth, fontSize].map((n: number) => n + fontSize * 0.2);

                            ctx.fillStyle = 'rgba(255, 255, 255, 1)';
                            ctx.beginPath();
                            ctx.arc(node.x, node.y, 8, 0, 2 * Math.PI, false);
                            ctx.fill();
                            ctx.strokeStyle = '#000';
                            ctx.stroke();

                            ctx.textAlign = 'center';
                            ctx.textBaseline = 'middle';
                            ctx.fillStyle = '#000';
                            ctx.fillText(label, node.x, node.y);
                        }}
                    />
                </div>
            </div>
        </AlgorithmPageLayout>
    );
};

export default WarshallAlgorithm;

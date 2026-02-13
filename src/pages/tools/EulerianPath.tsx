/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import ForceGraph2D from 'react-force-graph-2d';

interface GraphData {
    nodes: any[];
    links: any[];
}

const EulerianPath = () => {
    const [edgesInput, setEdgesInput] = useState("0 1\n1 2\n2 0\n0 3\n3 4");
    const [graphData, setGraphData] = useState<GraphData>({ nodes: [], links: [] });
    const [result, setResult] = useState<{
        hasPath: boolean;
        hasCircuit: boolean;
        oddDegreeNodes: number[];
        path?: number[];
        status: string;
    } | null>(null);
    const [error, setError] = useState("");
    const containerRef = useRef<HTMLDivElement>(null);
    const [dimensions, setDimensions] = useState({ width: 600, height: 400 });

    useEffect(() => {
        const updateDimensions = () => {
            if (containerRef.current) {
                setDimensions({
                    width: containerRef.current.clientWidth,
                    height: 500
                });
            }
        };

        updateDimensions();
        window.addEventListener('resize', updateDimensions);
        // Handle init
        handleCalculate();
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const findEulerianPath = (adj: number[][], numEdges: number, startNode: number) => {
        const adjCopy = adj.map(row => [...row]);
        const path: number[] = [];
        const stack: number[] = [];

        stack.push(startNode);

        while (stack.length > 0) {
            const u = stack[stack.length - 1];
            if (adjCopy[u].length > 0) {
                const v = adjCopy[u].pop()!;
                // Remove edge u-v (undirected so remove v-u too)
                const idx = adjCopy[v].indexOf(u);
                if (idx > -1) {
                    adjCopy[v].splice(idx, 1);
                }
                stack.push(v);
            } else {
                path.push(stack.pop()!);
            }
        }
        return path.reverse(); // Standard Hierholzer builds in reverse
    };

    const handleCalculate = () => {
        setError("");
        setResult(null);

        try {
            const lines = edgesInput.trim().split('\n');
            const edges: [number, number][] = [];
            const nodesSet = new Set<number>();

            lines.forEach(line => {
                const parts = line.trim().split(/\s+/);
                if (parts.length >= 2) {
                    const u = parseInt(parts[0]);
                    const v = parseInt(parts[1]);
                    if (!isNaN(u) && !isNaN(v)) {
                        edges.push([u, v]);
                        nodesSet.add(u);
                        nodesSet.add(v);
                    }
                }
            });

            if (edges.length === 0) {
                // setError("No valid edges found.");
                // Just clear graph
                setGraphData({ nodes: [], links: [] });
                return;
            }

            const maxNodeId = Math.max(...Array.from(nodesSet));
            const numNodes = maxNodeId + 1; // Assuming 0-indexed contiguous or sparse? 
            // Better to map node IDs to 0..N-1 indices for algorithm, but let's assume raw IDs for visualization
            // For algorithm, we need adjacency list.

            // We'll use a Map for adjacency to handle sparse IDs
            const adj = new Map<number, number[]>();
            nodesSet.forEach(n => adj.set(n, []));

            edges.forEach(([u, v]) => {
                adj.get(u)?.push(v);
                adj.get(v)?.push(u); // Undirected
            });

            // Check degrees
            const oddDegreeNodes: number[] = [];
            let allEven = true;

            adj.forEach((neighbors, node) => {
                if (neighbors.length % 2 !== 0) {
                    oddDegreeNodes.push(node);
                    allEven = false;
                }
            });

            // Connectivity check (basic BFS/DFS from first node with degree > 0)
            const startNode = edges[0][0]; // arbitrary start
            const visited = new Set<number>();
            const queue = [startNode];
            visited.add(startNode);

            while (queue.length > 0) {
                const u = queue.shift()!;
                adj.get(u)?.forEach(v => {
                    if (!visited.has(v)) {
                        visited.add(v);
                        queue.push(v);
                    }
                });
            }

            // Check if all nodes with non-zero degree are visited
            let isConnected = true;
            adj.forEach((neighbors, node) => {
                if (neighbors.length > 0 && !visited.has(node)) {
                    isConnected = false;
                }
            });

            let status = "";
            let hasPath = false;
            let hasCircuit = false;
            let calculatedPath: number[] | undefined = undefined;

            if (!isConnected) {
                status = "Graph is not connected (ignoring isolated vertices). No Eulerian Path/Circuit.";
            } else {
                if (oddDegreeNodes.length === 0) {
                    status = "All vertices have even degree. Eulerian Circuit exists.";
                    hasPath = true;
                    hasCircuit = true;
                } else if (oddDegreeNodes.length === 2) {
                    status = `Exactly 2 vertices (${oddDegreeNodes.join(', ')}) have odd degree. Eulerian Path exists.`;
                    hasPath = true;
                    hasCircuit = false;
                } else {
                    status = `Checks failed: ${oddDegreeNodes.length} vertices have odd degree. No Eulerian Path/Circuit.`;
                }
            }

            // Visualization Data
            const nodes = Array.from(nodesSet).map(id => ({ id, group: oddDegreeNodes.includes(id) ? 2 : 1 }));
            const links = edges.map(([source, target]) => ({ source, target }));
            setGraphData({ nodes, links });

            // Try to find path if exists
            if (hasPath && isConnected) {
                // Convert map to 0..max array sparse or use simplified map logic
                // Simplified: map node ID -> 0..K
                // Actually, let's just stick to integer checks if IDs are small.
                // If IDs are large, we need remapping.
                // Assuming simplified small IDs for this tool.

                const start = oddDegreeNodes.length === 2 ? oddDegreeNodes[0] : startNode;

                // Need numeric adjacency for the helper function?
                // Let's rewrite finding logic to using Map
                // Or just skip exact path calculation if complex to adapt generic Hierholzer's to Map quickly without bugs.
                // But showing the path is key "visualization".
                // I'll try.

                // Deep copy adj
                const adjCopy = new Map<number, number[]>();
                adj.forEach((v, k) => adjCopy.set(k, [...v]));

                const p: number[] = [];
                const stackStr: number[] = [start];

                while (stackStr.length > 0) {
                    const u = stackStr[stackStr.length - 1];
                    const neighbors = adjCopy.get(u);

                    if (neighbors && neighbors.length > 0) {
                        const v = neighbors.shift()!; // Remove edge u-v
                        // Remove v-u
                        const vNeighbors = adjCopy.get(v);
                        if (vNeighbors) {
                            const idx = vNeighbors.indexOf(u);
                            if (idx > -1) vNeighbors.splice(idx, 1);
                        }
                        stackStr.push(v);
                    } else {
                        p.push(stackStr.pop()!);
                    }
                }
                calculatedPath = p.reverse();
            }

            setResult({
                hasPath,
                hasCircuit,
                oddDegreeNodes,
                status,
                path: calculatedPath
            });

        } catch (err) {
            console.error(err);
            setError("Invalid input format.");
        }
    };

    return (
        <AlgorithmPageLayout
            title="Eulerian Path & Circuit"
            description="An Eulerian path is a trail in a finite graph that visits every edge exactly once. An Eulerian circuit is an Eulerian path which starts and ends on the same vertex."
            resources={[
                { label: "Eulerian Path", url: "https://en.wikipedia.org/wiki/Eulerian_path" },
            ]}
            controls={
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Graph Edges (Source Target)</label>
                        <Textarea
                            className="font-mono h-32"
                            placeholder="0 1&#10;1 2&#10;2 0"
                            value={edgesInput}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setEdgesInput(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Enter one edge per line (e.g. "0 1"). Vertices are integers.</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button onClick={handleCalculate} className="w-full">
                        Analyze Graph
                    </Button>
                </div>
            }
        >
            <div className="space-y-6">
                {result && (
                    <div className={`p-4 border rounded-lg ${result.hasPath ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}>
                        <h3 className={`font-bold text-lg ${result.hasPath ? "text-green-900" : "text-red-900"}`}>
                            {result.hasPath ? "Eulerian Path Found!" : "No Eulerian Path"}
                        </h3>
                        <p className="text-sm mt-1">{result.status}</p>
                        {result.oddDegreeNodes.length > 0 && (
                            <p className="text-xs mt-2 text-muted-foreground">Odd Degree Vertices: {result.oddDegreeNodes.join(", ")}</p>
                        )}
                        {result.path && (
                            <div className="mt-4">
                                <strong className="text-sm">Path Traversal:</strong>
                                <div className="flex flex-wrap gap-1 mt-1 items-center font-mono text-sm">
                                    {result.path.map((node, i) => (
                                        <React.Fragment key={i}>
                                            <span className="bg-white border px-2 py-0.5 rounded shadow-sm">{node}</span>
                                            {i < result.path!.length - 1 && <span>→</span>}
                                        </React.Fragment>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div ref={containerRef} className="border rounded-lg overflow-hidden bg-slate-50 relative h-[500px]">

                    {graphData.nodes.length > 0 ? (
                        <ForceGraph2D
                            width={dimensions.width}
                            height={dimensions.height}
                            graphData={graphData}
                            nodeLabel="id"
                            nodeAutoColorBy="group"
                            linkDirectionalArrowLength={4}
                            linkDirectionalArrowRelPos={1}
                            linkCurvature={0.25}
                            nodeCanvasObject={(node: any, ctx: CanvasRenderingContext2D, globalScale: number) => {
                                const label = String(node.id)
                                const fontSize = 12 / globalScale

                                ctx.font = `${fontSize}px Sans-Serif`
                                ctx.textAlign = "center"
                                ctx.textBaseline = "middle"

                                // draw node circle
                                ctx.beginPath()
                                ctx.arc(node.x, node.y, 6, 0, 2 * Math.PI)
                                ctx.fillStyle = node.color || "#999"
                                ctx.fill()

                                // draw label
                                ctx.fillStyle = "#000"
                                ctx.fillText(label, node.x, node.y)
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            No graph to display.
                        </div>
                    )}
                </div>
            </div>
        </AlgorithmPageLayout>
    );
}

export default EulerianPath;
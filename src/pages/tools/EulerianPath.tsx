/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from 'react';
import { ForceGraph2D } from 'react-force-graph';

const EulerianPath = () => {
    const [graphData, setGraphData] = useState<any>({ nodes: [], links: [] });

    class Graph {
        V: any;
        adj: number[][];
        constructor(V: any) {
            this.V = V; // No. of vertices
            //A dynamic array of adjacency lists
            this.adj = Array.from(Array(V), () => []);
        }

        // functions to add edge
        addEdge(u: number, v: number) {
            this.adj[u].push(v);
            this.adj[v].push(u);
        }

        // This function removes edge u-v from graph.
        // It removes the edge by replacing adjacent
        // vertex value with -1.
        rmvEdge(u: number, v: number) {
            // Find v in adjacency list of u and replace
            // it with -1

            for (let i = 0; i < this.adj[u].length; i++) {
                if (this.adj[u][i] == v) {
                    this.adj[u][i] = -1;
                    break;
                }
            }

            // Find u in adjacency list of v and replace
            // it with -1

            for (let i = 0; i < this.adj[v].length; i++) {
                if (this.adj[v][i] == u) {
                    this.adj[v][i] = -1;
                    break;
                }
            }
        }
    }

    return (
        <div className="m-4">
            <p className="text-2xl prose"><a href="https://en.wikipedia.org/wiki/Eulerian_path">:Eulerian Path</a></p>
            <p>Euilerian Path is a path in a graph that visits every edge exactly once.</p>
            <p>It is not necessary to visit every vertex.</p>
            <p>It is necessary to visit every edge exactly once.</p>

            <textarea className="w-full h-48 p-2 my-2" placeholder="Enter the edges of the graph"></textarea>
            <p><button className="bg-indigo-500 text-white p-1 rounded-lg" onClick={() => {
                const edges = document.querySelector('textarea')?.value.split('\n').map((e) => e.split(' ').map((e) => parseInt(e)));
                if (!edges) return;
                const V = Math.max(...edges.flat()) + 1;
                const g = new Graph(V);
                edges.forEach((e) => g.addEdge(e[0], e[1]));
                const nodes = Array.from(Array(V), (_, i) => ({ id: i, group: 1 }));
                const links = edges.map(([source, target]) => ({ source, target }));
                setGraphData({ nodes, links });
            }}>Submit</button></p>

            <ForceGraph2D
                width={document.body.clientWidth * 0.9}
                height={700}
                graphData={graphData}
                nodeAutoColorBy={"group"}
                linkDirectionalArrowLength={3.5}
                linkDirectionalArrowRelPos={1}
                minZoom={0.5}
                enableZoomInteraction={true}
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
        </div>
    );
}

export default EulerianPath;
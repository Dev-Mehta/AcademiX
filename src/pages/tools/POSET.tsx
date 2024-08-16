/* eslint-disable @typescript-eslint/no-explicit-any */
import { useState } from "react";
import { ForceGraph2D } from "react-force-graph"
const POSET = () => {
    const [set, setSet] = useState<number[]>([]);
    const [number, setNumber] = useState<number>(0);
    const generateDivisors = (n: number) => {
        const divisors = [];
        for (let i = 1; i <= n; i++) {
            if (n % i === 0) {
                divisors.push(i);
            }
        }
        return divisors;
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [data, setData] = useState<any>({
        nodes: [
            { id: 1, group: 1 }
        ], links: [
            { source: 1, target: 1 }
        ]
    });

    const divides = (a: number, b: number) => {
        return b % a === 0;
    }

    const hasse = (set: number[]) => {
        let edges: any[] = [];
        for (let i = 0; i < set.length; i++) {
            for (let j = 0; j < set.length; j++) {
                if (divides(set[i], set[j])) {
                    edges.push([set[i], set[j]]);
                }
            }
            // remove reflexive edges
            edges.splice(edges.findIndex(([a, b]) => a === b
            ), 1);
            // remove transitive edges
            const edgeToDel: any[][] = [];
            for(let a = 0; a < edges.length; a++) {
                for(let b = 0; b < edges.length; b++) {
                    if(edges[a][1] === edges[b][0]) {
                        console.log(edges[a], edges[b]);
                        edgeToDel.push([edges[a][0], edges[b][1]]);
                    }
                }
            }
            console.log(edgeToDel);
            edges = edges.filter(([a, b]) => !edgeToDel.some(([c, d]) => a === c && b === d));

            console.log(edges)
        }
        const nodes = set.map((i) => ({ id: i, group: 1 }));
        const links = edges.map(([source, target]) => ({ source, target }));
        setData({ nodes, links });
        return edges;
    }
    const handleChange = (e: { target: { value: any; }; }) => {
        const value = e.target.value;
        if(value.trim() === '') return;
        const n = parseInt(value);
        setNumber(n);
        const divisors = generateDivisors(n);
        setSet(divisors);
        hasse(divisors);
    }
    
    return (
        <div className="m-4">
            <h1 className="text-3xl font-bold">POSET</h1>
            <p>Partial Order Set</p>
            <p>Definition: A set P is called a partial order set if it satisfies the following conditions:</p>
            <ul className="list-disc ml-8">
                <li>Reflexivity: <code>aRa</code> for all <code>a</code> in <code>P</code>.</li>
                <li>Anti-symmetry: If <code>aRb</code> and <code>bRa</code>, then <code>a</code> = <code>b</code></li>
                <li>Transitivity: If <code>aRb</code> and <code>bRc</code>, then <code>aRc</code></li>
            </ul>

            <p className="mt-2 text-xl font-bold">Hasse Diagram</p>
            <p>Definition: A Hasse diagram is a graphical representation of a partially ordered set, in the form of a drawing of its transitive reduction.</p>
            <p className="prose my-4">Explanation: <a href="https://en.wikipedia.org/wiki/Hasse_diagram#Diagram_design">:Hasse Diagram</a></p>
            <p>The tool given below generates the hasse diagram for divisor relation on the set of divisors of the number entered by the user.</p>
            <p>
                <a className="prose" href="https://en.wikipedia.org/wiki/Square-free_integer">:Square free numbers</a> will work the best as their graph is isomorphic to <a className="prose" href="https://en.wikipedia.org/wiki/Hypercube_graph">:Qn (n-dimensional cube).</a></p>
            <p className="my-4"></p>

            <input type="number" onChange={handleChange} placeholder="Enter the number" className="border border-gray-300 p-2 rounded-lg" />
            {set.length > 0 && <div className="my-2">
                <p>Divisor Set for {number}: {set.join(', ')}</p>
            </div>}
            <div className="flex flex-col gap-4">
                <div id="graph">
                    <ForceGraph2D 
                        width={document.body.clientWidth*0.9}
                        height={100}
                        graphData={data}
                        nodeAutoColorBy={"group"}
                        enablePanInteraction={false}
                        minZoom={2.5}
                        enableZoomInteraction={false}
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
            </div>
        </div>
    );
}

export default POSET;

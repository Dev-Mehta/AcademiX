/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, useEffect, useRef } from "react";
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import ForceGraph2D from 'react-force-graph-2d';

const POSET = () => {
    const [number, setNumber] = useState<number | "">("");
    const [graphData, setGraphData] = useState<{ nodes: any[], links: any[] }>({ nodes: [], links: [] });
    const [divisors, setDivisors] = useState<number[]>([]);
    const [isLattice, setIsLattice] = useState<boolean | null>(null);
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
        return () => window.removeEventListener('resize', updateDimensions);
    }, []);

    const calculatePOSET = () => {
        if (!number || typeof number !== 'number') return;

        const stringNum = String(number);
        const parsedNum = parseInt(stringNum);

        // Find all divisors
        const divs: number[] = [];
        for (let i = 1; i <= parsedNum; i++) {
            if (parsedNum % i === 0) divs.push(i);
        }
        setDivisors(divs);

        // Generate Hasse Diagram edges
        // Edge u -> v if u divides v and there is no w such that u divides w and w divides v
        const links: any[] = [];

        for (let i = 0; i < divs.length; i++) {
            for (let j = 0; j < divs.length; j++) {
                if (i === j) continue;
                const u = divs[i];
                const v = divs[j];

                if (v % u === 0) {
                    // Check if direct cover
                    let isCover = true;
                    for (let k = 0; k < divs.length; k++) {
                        const w = divs[k];
                        if (w !== u && w !== v && v % w === 0 && w % u === 0) {
                            isCover = false;
                            break;
                        }
                    }
                    if (isCover) {
                        links.push({ source: u, target: v });
                    }
                }
            }
        }

        const nodes = divs.map(id => ({ id }));
        setGraphData({ nodes, links });

        // Check if Lattice (simplified: for divisibility POSET of a number, it's always a lattice)
        setIsLattice(true);
    };

    return (
        <AlgorithmPageLayout
            title="POSET (Partially Ordered Set)"
            description="Visualize the divisibility lattice (Hasse Diagram) for a given number. A POSET consists of a set together with a binary relation that represents ordering."
            resources={[
                { label: "POSET", url: "https://en.wikipedia.org/wiki/Partially_ordered_set" },
                { label: "Hasse Diagrams", url: "https://en.wikipedia.org/wiki/Hasse_diagram#Diagram_design" }
            ]}
            controls={
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Enter Number</label>
                        <Input
                            type="number"
                            value={number}
                            onChange={(e) => setNumber(parseInt(e.target.value) || "")}
                            placeholder="e.g. 12"
                        />
                    </div>
                    <button
                        onClick={calculatePOSET}
                        className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 w-full bg-primary text-primary-foreground hover:bg-primary/90"
                    >
                        Generate Hasse Diagram
                    </button>
                    <p className="text-xs text-muted-foreground">Try simple numbers like 12, 24, 30, 36 first.</p>
                </div>
            }
        >
            <div className="space-y-6">
                {divisors.length > 0 && (
                    <div className="p-4 border rounded-lg bg-slate-50">
                        <h3 className="font-bold text-lg text-primary">Divisors of {number}</h3>
                        <div className="flex flex-wrap gap-2 mt-2">
                            {divisors.map(d => (
                                <span key={d} className="bg-white border px-3 py-1 rounded-full text-sm font-mono shadow-sm">
                                    {d}
                                </span>
                            ))}
                            {isLattice && (
                                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-bold">Lattice</span>
                            )}
                        </div>
                    </div>
                )}

                <div ref={containerRef} className="border rounded-lg overflow-hidden bg-white relative h-[500px]">
                    {graphData.nodes.length > 0 ? (
                        <ForceGraph2D
                            width={dimensions.width}
                            height={dimensions.height}
                            graphData={graphData}
                            nodeLabel="id"
                            nodeColor={() => "#4f46e5"}
                            linkDirectionalArrowLength={6}
                            linkDirectionalArrowRelPos={1}
                            dagMode="bu" // Bottom-Up layout for Hasse Diagram
                            dagLevelDistance={60}
                            nodeCanvasObject={(node: any, ctx: any, globalScale: any) => {
                                const label = String(node.id);
                                const fontSize = 14 / globalScale;
                                ctx.font = `${fontSize}px Sans-Serif`;
                                const textWidth = ctx.measureText(label).width;
                                const bckgDimensions = [textWidth, fontSize].map((n: number) => n + fontSize * 0.2);

                                ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
                                ctx.fillRect((node.x ?? 0) - bckgDimensions[0] / 2, (node.y ?? 0) - bckgDimensions[1] / 2, bckgDimensions[0], bckgDimensions[1]);

                                ctx.textAlign = 'center';
                                ctx.textBaseline = 'middle';
                                ctx.fillStyle = '#000';
                                ctx.fillText(label, node.x ?? 0, node.y ?? 0);
                            }}
                        />
                    ) : (
                        <div className="flex items-center justify-center h-full text-muted-foreground">
                            Enter a number to generate the diagram.
                        </div>
                    )}
                </div>
            </div>
        </AlgorithmPageLayout>
    );
};

export default POSET;

import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface NaiveSubStep {
    shift: number;
    text: string;
    pattern: string;
    match: boolean;
}

interface RabinKarpSubStep {
    shift: number;
    text: string;
    pattern: string;
    hash: number;
    remainder: number;
    spurious: boolean;
    exact: boolean;
}

interface PatternMatchingData {
    type: string;
    substeps: NaiveSubStep[] | RabinKarpSubStep[];
}

const PatternMatchingTable = ({ data }: { data: PatternMatchingData }) => {
    if (!data || !data.substeps || data.substeps.length === 0) return <p className="text-muted-foreground p-4">No steps recorded.</p>;

    const { type, substeps } = data;
    // Determine columns based on the first item type
    const firstStep = substeps[0];
    const columns = Object.keys(firstStep);

    return (
        <div className="space-y-2">
            <h2 className="text-lg font-semibold">{type} Algorithm Steps</h2>
            <div className="overflow-x-auto rounded-md border">
                <table className="w-full text-sm">
                    <thead className="bg-muted/50">
                        <tr>
                            {columns.map((col) => (
                                <th key={col} className="px-4 py-2 text-left font-medium capitalize border-b">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {substeps.map((step, index) => (
                            <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                {columns.map((col) => {
                                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                                    const val = (step as any)[col];
                                    return (
                                        <td key={col} className="px-4 py-2 border-r last:border-r-0">
                                            {typeof val === "boolean" ? (val ? "✅" : "❌") : val}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

function StringMatching() {
    const [text, setText] = useState("");
    const [pattern, setPattern] = useState("");
    const [result, setResult] = useState<number[]>([]);
    const [error, setError] = useState("");
    const [steps, setSteps] = useState<PatternMatchingData[]>([]);
    const [option, setOption] = useState("naive");

    const codeSnippet = `// Naive Algorithm
function naiveSearch(text, pattern) {
    let m = pattern.length;
    let n = text.length;
    for (let i = 0; i <= n - m; i++) {
        let j;
        for (j = 0; j < m; j++)
            if (text[i + j] != pattern[j])
                break;
        if (j == m)
            console.log("Pattern found at index " + i);
    }
}`;

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError("");

        if (!text || !pattern) {
            setError("Please enter both text and pattern.");
            return;
        }

        if (option === "naive") {
            const tmp: { type: string; substeps: NaiveSubStep[] }[] = [];
            tmp.push({ type: "Naive", substeps: [] });
            const localResult: number[] = [];

            for (let i = 0; i <= text.length - pattern.length; i++) {
                let j = 0;
                while (j < pattern.length && text[i + j] === pattern[j]) {
                    j++;
                }
                if (j === pattern.length) {
                    localResult.push(i);
                    tmp[0].substeps.push({
                        shift: i,
                        text: text.slice(i, i + pattern.length),
                        pattern: pattern,
                        match: true
                    });
                } else {
                    tmp[0].substeps.push({
                        shift: i,
                        text: text.slice(i, i + pattern.length),
                        pattern: pattern,
                        match: false
                    });
                }
            }
            setSteps(tmp);
            setResult(localResult);
        } else if (option === "rabin-karp") {
            const localResult: number[] = [];
            const tmp: { type: string, substeps: RabinKarpSubStep[] }[] = [];
            tmp.push({ type: "Rabin-Karp", substeps: [] });

            const d = 256;
            const q = 101;

            const rabinKarpHash = (str: string, m: number) => {
                let h = 0;
                for (let i = 0; i < m; i++) {
                    h = (d * h + str.charCodeAt(i)) % q;
                }
                return h;
            };

            const n = text.length;
            const m = pattern.length;
            const h = Math.pow(d, m - 1) % q; // Value of h for rolling hash
            let p = 0; // hash value for pattern
            let t = 0; // hash value for text

            // Precompute hashes
            for (let i = 0; i < m; i++) {
                p = (d * p + pattern.charCodeAt(i)) % q;
                t = (d * t + text.charCodeAt(i)) % q;
            }

            for (let i = 0; i <= n - m; i++) {
                let matchFound = false;
                let spurious = false;

                if (p === t) {
                    let j = 0;
                    while (j < m && pattern[j] === text[i + j]) {
                        j++;
                    }
                    if (j === m) {
                        localResult.push(i);
                        matchFound = true;
                    } else {
                        spurious = true;
                    }

                    tmp[0].substeps.push({
                        shift: i,
                        text: text.slice(i, i + m),
                        pattern: pattern,
                        hash: p,
                        remainder: t,
                        spurious: spurious,
                        exact: matchFound,
                    });
                } else {
                    tmp[0].substeps.push({
                        shift: i,
                        text: text.slice(i, i + m),
                        pattern: pattern,
                        hash: p,
                        remainder: t,
                        spurious: false,
                        exact: false,
                    });
                }

                if (i < n - m) {
                    t = (d * (t - text.charCodeAt(i) * h) + text.charCodeAt(i + m)) % q;
                    if (t < 0) t = (t + q);
                }
            }
            setSteps(tmp);
            setResult(localResult);
        }
    };

    return (
        <AlgorithmPageLayout
            title="String Matching"
            description="Finds all occurrences of a pattern string in a text string."
            resources={[
                { label: "What is String Searching", url: "https://en.wikipedia.org/wiki/String-searching_algorithm" },
                { label: "What is Rabin-Karp Algorithm", url: "https://en.wikipedia.org/wiki/Rabin%E2%80%93Karp_algorithm" }
            ]}
            codeSnippet={codeSnippet}
            controls={
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="text" className="text-sm font-medium leading-none">Text</label>
                        <Input
                            id="text"
                            placeholder="Enter text..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="pattern" className="text-sm font-medium leading-none">Pattern</label>
                        <Input
                            id="pattern"
                            placeholder="Enter pattern..."
                            value={pattern}
                            onChange={(e) => setPattern(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="algorithm" className="text-sm font-medium leading-none">Algorithm</label>
                        <select
                            id="algorithm"
                            className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            value={option}
                            onChange={(e) => setOption(e.target.value)}
                        >
                            <option value="naive">Naive</option>
                            <option value="rabin-karp">Rabin-Karp</option>
                        </select>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" className="w-full">
                        Find Pattern
                    </Button>
                </form>
            }
        >
            <div className="space-y-6">
                {result.length > 0 && (
                    <div className="bg-green-50/50 p-4 border rounded-lg">
                        <h3 className="font-bold text-green-900 mb-2">Result</h3>
                        <p>Pattern found at indices: <strong>{result.join(", ")}</strong></p>
                    </div>
                )}
                {steps.map((step, index) => (
                    <PatternMatchingTable key={index} data={step} />
                ))}
            </div>
        </AlgorithmPageLayout>
    );
}

export default StringMatching;
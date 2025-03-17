import { useEffect, useState } from "react";

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


const PatternMatchingTable = ({ data }) => {
    if (!data || !data.substeps) return <p>No data available</p>;

    const { type, substeps } = data;
    const columns = Object.keys(substeps[0]); // Get dynamic column headers

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-2">{type} Algorithm</h2>
            <div className="overflow-x-auto">
                <table className="min-w-full border border-gray-300">
                    <thead>
                        <tr className="bg-gray-200">
                            {columns.map((col) => (
                                <th key={col} className="px-4 py-2 border capitalize">{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {substeps.map((step: NaiveSubStep|RabinKarpSubStep, index: number) => (
                            <tr key={index} className="border">
                                {columns.map((col) => (
                                    <td key={col} className="px-4 py-2 border">
                                        {typeof (step as any)[col] === "boolean" ? ((step as any)[col] ? "✅" : "❌") : (step as any)[col]}
                                    </td>
                                ))}
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
    const [steps, setSteps] = useState<{ type: string; substeps: NaiveSubStep[] | RabinKarpSubStep[] }[]>([]);
    const [option, setOption] = useState("naive");
    const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        setError("");
        if (!text || !pattern) {
            setError("Please enter both text and pattern.");
            return;
        }
        if (option === "naive") {
            const naive = (text: string, pattern: string) => {
                const tmp: { type: string; substeps: NaiveSubStep[] }[] = [];
                tmp.push({ type: "Naive", substeps: [] });
                const result: number[] = [];
                for (let i = 0; i < text.length - pattern.length + 1; i++) {
                    let j = 0;
                    while (j < pattern.length && text[i + j] === pattern[j]) {
                        j++;
                    }
                    if (j === pattern.length) {
                        result.push(i);
                        const naiveSubStep: NaiveSubStep = {
                            shift: i,
                            text: text.slice(i, i + pattern.length),
                            pattern: pattern,
                            match: true
                        };
                        tmp[0].substeps.push(naiveSubStep);
                    }
                    else {
                        const naiveSubStep: NaiveSubStep = {
                            shift: i,
                            text: text.slice(i, i + pattern.length),
                            pattern: pattern,
                            match: false
                        };
                        tmp[0].substeps.push(naiveSubStep);
                    }
                }
                setSteps(tmp);
                return result;
            };
            setResult(naive(text, pattern));
        } else if (option === "rabin-karp") {
            const rabinKarp = (text: string, pattern: string) => {
                const result: number[] = [];
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

                const rabinKarp = (text: string, pattern: string) => {
                    const n = text.length;
                    const m = pattern.length;
                    const h = rabinKarpHash(pattern, m);
                    let p = 0;
                    let t = 0;
                    for (let i = 0; i < m; i++) {
                        p = (d * p + pattern.charCodeAt(i)) % q;
                        t = (d * t + text.charCodeAt(i)) % q;
                    }
                    for (let i = 0; i <= n - m; i++) {
                        if (p === t) {
                            let j = 0;
                            while (j < m && pattern[j] === text[i + j]) {
                                j++;
                            }
                            if (j === m) {
                                result.push(i);
                                const rabinKarpSubStep: RabinKarpSubStep = {
                                    shift: i,
                                    text: text.slice(i, i + m),
                                    pattern: pattern,
                                    hash: p,
                                    remainder: t,
                                    spurious: false,
                                    exact: true,
                                };
                                tmp[0].substeps.push(rabinKarpSubStep);
                            } else {
                                const rabinKarpSubStep: RabinKarpSubStep = {
                                    shift: i,
                                    text: text.slice(i, i + m),
                                    pattern: pattern,
                                    hash: p,
                                    remainder: t,
                                    spurious: true,
                                    exact: false,
                                };
                                tmp[0].substeps.push(rabinKarpSubStep);
                            }
                        }
                        else {
                            const rabinKarpSubStep: RabinKarpSubStep = {
                                shift: i,
                                text: text.slice(i, i + m),
                                pattern: pattern,
                                hash: p,
                                remainder: t,
                                spurious: false,
                                exact: false,
                            };
                            tmp[0].substeps.push(rabinKarpSubStep);
                        }
                        if (i < n - m) {
                            t = (d * (t - text.charCodeAt(i) * Math.pow(d, m - 1)) + text.charCodeAt(i + m)) % q;
                            if (t < 0) {
                                t = t + q;
                            }
                        }
                    }
                };
                rabinKarp(text, pattern);
                setSteps(tmp);
                return result;
            }
            setResult(rabinKarp(text, pattern));
        }
    }

    useEffect(() => {
        console.log(steps);
    }, [steps]);

    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="font-bold text-3xl my-4">String Matching</h1>
                <form className="flex flex-col gap-4">
                    <label>
                        <span className="mr-2">Text</span>
                        <input type="text" name="text" id="text" className='border p-2 rounded-md' onChange={(e) => { setText(e.target.value.trim()) }} />
                    </label>
                    <label>
                        <span className="mr-2">Pattern</span>
                        <input type="text" name="pattern" id="pattern" className='border p-2 rounded-md' onChange={(e) => { setPattern(e.target.value.trim()) }} />
                    </label>
                    <label>
                        <span className="mr-2">Algorithm</span>
                        <select
                            className="border p-2 rounded-md"
                            value={option} onChange={(e) => setOption(e.target.value)}>
                            <option value="naive">Naive</option>
                            <option value={"rabin-karp"}>Rabin-Karp</option>
                        </select>
                    </label>
                    <button
                        className="bg-blue-500 text-white p-2 rounded-md"
                        onClick={handleSubmit}>Submit</button>
                </form>
                {error && <p className="text-red-500">{error}</p>}
                {result.length > 0 && (
                    <div>
                        <h2>Result</h2>
                        <p>Pattern found at index: {result.join(", ")}</p>
                    </div>
                )}
                {steps.map((step, index) => (
                    <PatternMatchingTable key={index} data={step} />
                ))}
            </div>
        </div>
    );
}

export default StringMatching;
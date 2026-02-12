import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface MCMResult {
    minCost: number;
    dp: number[][];
    bestOrder: string;
}

function MCM() {
    const codeSnippet = `function matrixChainOrder(p) {
    let n = p.length;
    let m = Array(n).fill(0).map(() => Array(n).fill(0));
    let s = Array(n).fill(0).map(() => Array(n).fill(0));
    
    for (let L = 2; L < n; L++) {
        for (let i = 1; i < n - L + 1; i++) {
            let j = i + L - 1;
            m[i][j] = Number.MAX_VALUE;
            for (let k = i; k <= j - 1; k++) {
                let q = m[i][k] + m[k + 1][j] + p[i - 1] * p[k] * p[j];
                if (q < m[i][j]) {
                    m[i][j] = q;
                    s[i][j] = k;
                }
            }
        }
    }
    return m[1][n - 1];
}`;

    const [dimensions, setDimension] = useState("");
    const [result, setResult] = useState<MCMResult | null>(null);
    const [error, setError] = useState("");

    function toIntArray(intString: string) {
        if (!intString.trim()) return [];
        return intString.split(',').map(num => {
            const parsed = parseInt(num.trim(), 10);
            return isNaN(parsed) ? null : parsed;
        }).filter((num): num is number => num !== null);
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        setError("");
        const arr = toIntArray(dimensions);
        if (arr.length < 2) {
            setError("Please enter at least 2 dimensions to form at least 1 matrix.");
            setResult(null);
            return;
        }

        const n = arr.length;
        // dp[i][j] stores the minimum number of multiplications needed
        // to compute the matrix chain A[i]...A[j]
        // But here we use 0-based indexing for dimensions array.
        // Matrices are A1 (arr[0]xarr[1]), A2 (arr[1]xarr[2]), ... An-1 (arr[n-2]xarr[n-1])
        // We will stick to the logic used previously which seemed to be 0-based gap logic.

        const dp = Array.from({ length: n }, () => Array(n).fill(0));
        // text[i][j] stores the optimal parenthesis string for range i to j
        const text = Array.from({ length: n }, () => Array(n).fill(""));

        // Initialize single matrix names
        // Matrix k corresponds to dimension arr[k] x arr[k+1]? 
        // Let's assume arr has n dimensions p0, p1, ..., pn-1.
        // Matrices match gaps. Gap 0 -> dp[i][i] = 0.
        // Gap 1 -> dp[i][i+1] -> Matrix Ai+1 (dims p_i x p_{i+1}). Cost 0 if just one matrix.

        // Wait, the previous logic was:
        // cost = dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j];
        // This implies split at k (dimension index).
        // range i..j means dimensions p_i ... p_j.
        // This corresponds to chain of matrices defined by these dimensions.

        for (let len = 2; len < n; len++) {
            for (let i = 0; i < n - len; i++) {
                const j = i + len;
                dp[i][j] = Infinity;

                for (let k = i + 1; k < j; k++) {
                    const cost = dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;

                        // Construct string
                        // For base cases (len=2? No, len=1 gap), dp[i][i+1] is 0.
                        // We need names for base components.
                        const left = (k - i === 1) ? `A${i + 1}` : text[i][k];
                        const right = (j - k === 1) ? `A${k + 1}` : text[k][j];

                        // Wait, naming is tricky if we don't store it properly.
                        // Let's try to infer names.
                        // Start point i.
                        // Matrix 1 is p0 x p1 (indices 0, 1).
                        // So range (i, i+1) is one matrix. index i? No.
                        // Let's use simpler logic for string reconstruction or just simple parenthesis without names if it's cleaner.
                        // Or try to salvage:

                        text[i][j] = `(${left} x ${right})`;
                    }
                }
            }
        }

        // Final Fix for naming:
        // If the implementation above is correct, text[i][j] should have the string. 
        // But we need to handle the base case where we pull the name if it's empty (leaf node).
        // Actually, let's just use a recursive printer or something if the iterative one is hard.
        // But let's try to stick to the loop. 
        // Base cases: range of length 1 (gap 1) like dp[0][1] (p0, p1 -> Matrix 1).
        // This loop starts len=2 (gap 2). So it accesses dp[0][1] which is 0.
        // And text[0][1] is "".
        // So left = `A${i+1}` handles the base case.
        // i=0, k=1 -> left = A1. Correct.
        // k=1, j=2 -> right = A2. Correct.

        const bestOrder = text[0][n - 1] || `A1`; // Fallback if single matrix or n=2 (loop len=2 < 2 false)

        setResult({
            minCost: dp[0][n - 1],
            dp: dp,
            bestOrder: bestOrder
        });
    };

    return (
        <AlgorithmPageLayout
            title="Matrix Chain Multiplication"
            description="Finds the most efficient way to multiply a given sequence of matrices. The problem is not actually to perform the multiplications, but merely to decide in which order to perform the multiplications."
            resources={[
                { label: "Wikipedia: MCM", url: "https://en.wikipedia.org/wiki/Matrix_chain_multiplication" },
                { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/matrix-chain-multiplication-dp-8/" }
            ]}
            codeSnippet={codeSnippet}
            controls={
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="dimensions" className="text-sm font-medium leading-none">
                            Dimensions (comma separated)
                        </label>
                        <Input
                            id="dimensions"
                            placeholder="e.g. 10, 30, 5, 60"
                            value={dimensions}
                            onChange={(e) => setDimension(e.target.value)}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                        <p className="text-xs text-muted-foreground">
                            {'Enter dimensions $p_0, p_1, ..., p_n$. This corresponds to $n$ matrices where Matrix $A_i$ is $p_{i - 1} \\times p_i$.'}
                        </p>
                    </div>
                    <Button type="submit" className="w-full">
                        Calculate Min Cost
                    </Button>
                </form>
            }
        >
            {result ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 border rounded-lg bg-green-50/50">
                            <h3 className="font-bold text-lg mb-2 text-green-800">Minimum Cost</h3>
                            <p className="text-3xl font-mono">{result.minCost}</p>
                        </div>
                        <div className="p-4 border rounded-lg bg-blue-50/50">
                            <h3 className="font-bold text-lg mb-2 text-blue-800">Best Order</h3>
                            <p className="text-xl font-mono">{result.bestOrder}</p>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold">DP Table</h3>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm text-center table-fixed">
                                <tbody>
                                    {result.dp.map((row, i) => (
                                        <tr key={i} className="border-b">
                                            {row.map((val, j) => (
                                                <td key={j} className={`p-2 border ${val === Infinity ? 'text-gray-300' : ''} ${val === 0 ? 'bg-muted/30' : ''} ${i === 0 && j === result.dp.length - 1 ? 'bg-yellow-100 font-bold border-yellow-400' : ''}`}>
                                                    {val === Infinity ? "∞" : val}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>Enter dimensions and click "Calculate" to see the result.</p>
                </div>
            )}
        </AlgorithmPageLayout>
    );
}

export default MCM;
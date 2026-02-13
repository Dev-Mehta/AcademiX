import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface DPResult {
    dp: number[][];
    maxProfit: number;
    selectedItems: number[]; // Indices of selected items
}

function ZeroOneKnapsackProblem() {
    const codeSnippet = `function knapsack(W, val, wt) {
    let n = wt.length;
    let dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // Build table dp[][] in bottom-up manner
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= W; j++) {
            if (i === 0 || j === 0)
                dp[i][j] = 0;
            else {
                if (wt[i - 1] <= j)
                    dp[i][j] = Math.max(val[i - 1] + dp[i - 1][j - wt[i - 1]], dp[i - 1][j]);
                else
                    dp[i][j] = dp[i - 1][j];
            }
        }
    }
    return dp[n][W];
}`;

    const [weights, setWeights] = useState("");
    const [profits, setProfits] = useState("");
    const [capacity, setCapacity] = useState("");
    const [error, setError] = useState("");

    const [result, setResult] = useState<DPResult | null>(null);

    function toIntArray(intString: string) {
        if (!intString.trim()) return [];
        return intString.split(',').map(num => {
            const parsed = parseInt(num.trim(), 10);
            return isNaN(parsed) ? null : parsed;
        }).filter((num): num is number => num !== null);
    }

    const calculateZeroOneKnapsack = (W: number, wt: number[], val: number[]) => {
        const n = wt.length;
        const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= W; j++) {
                if (i === 0 || j === 0)
                    dp[i][j] = 0;
                else {
                    if (wt[i - 1] <= j) {
                        dp[i][j] = Math.max(val[i - 1] + dp[i - 1][j - wt[i - 1]], dp[i - 1][j]);
                    } else {
                        dp[i][j] = dp[i - 1][j];
                    }
                }
            }
        }

        // Backtracking to find selected items
        const selected: number[] = [];
        let w = W;
        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                selected.push(i - 1); // Store index of item (0-based)
                w -= wt[i - 1];
            }
        }

        return {
            dp,
            maxProfit: dp[n][W],
            selectedItems: selected.reverse() // Reverse to show in order of appearance
        };
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setResult(null);

        const weightArr = toIntArray(weights);
        const profitArr = toIntArray(profits);
        const cap = parseInt(capacity, 10);

        if (weightArr.length === 0 || profitArr.length === 0) {
            setError("Weights and Profits arrays should not be empty.");
            return;
        }

        if (weightArr.length !== profitArr.length) {
            setError("The number of weights and profits must be equal.");
            return;
        }

        if (isNaN(cap) || cap < 0) {
            setError("Capacity must be a non-negative number.");
            return;
        }

        const res = calculateZeroOneKnapsack(cap, weightArr, profitArr);
        setResult(res);
    };

    return (
        <AlgorithmPageLayout
            title="0/1 Knapsack Problem"
            description="Dynamic Programming approach where items cannot be broken. We either take an item or leave it."
            resources={[
                { label: "What is Knapsack Problem", url: "https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem" },
                // { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/0-1-knapsack-problem-dp-10/" }
            ]}
            codeSnippet={codeSnippet}
            controls={
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="weights" className="text-sm font-medium leading-none">
                            Weights (comma separated)
                        </label>
                        <Input
                            id="weights"
                            placeholder="e.g. 10, 20, 30"
                            value={weights}
                            onChange={(e) => setWeights(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="profits" className="text-sm font-medium leading-none">
                            Profits (comma separated)
                        </label>
                        <Input
                            id="profits"
                            placeholder="e.g. 60, 100, 120"
                            value={profits}
                            onChange={(e) => setProfits(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="capacity" className="text-sm font-medium leading-none">
                            Capacity
                        </label>
                        <Input
                            id="capacity"
                            type="number"
                            placeholder="e.g. 50"
                            value={capacity}
                            onChange={(e) => setCapacity(e.target.value)}
                        />
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <Button type="submit" className="w-full">
                        Calculate Max Profit
                    </Button>
                </form>
            }
        >
            {result ? (
                <div className="space-y-6">
                    <div className="bg-green-50/50 p-4 border rounded-lg">
                        <h3 className="font-bold text-green-900 mb-2">Maximum Profit</h3>
                        <div className="flex justify-between items-center">
                            <p className="text-3xl font-mono">{result.maxProfit}</p>
                            <div className="text-right">
                                <p className="text-sm font-medium">Selected Items (Indices):</p>
                                <div className="flex gap-1 justify-end mt-1">
                                    {result.selectedItems.map(idx => (
                                        <span key={idx} className="bg-green-200 text-green-800 px-2 py-1 rounded text-xs font-bold">
                                            Item {idx + 1}
                                        </span>
                                    ))}
                                    {result.selectedItems.length === 0 && <span className="text-muted-foreground text-sm">None</span>}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <h3 className="font-bold">DP Table</h3>
                        <p className="text-xs text-muted-foreground">Rows represent items (0 to n), Columns represent capacity (0 to W).</p>
                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm text-center">
                                <thead>
                                    <tr className="bg-muted">
                                        <th className="p-2 border">Item \ Cap</th>
                                        {result.dp[0].map((_, j) => (
                                            <th key={j} className="p-2 border min-w-[2rem]">{j}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.dp.map((row, i) => (
                                        <tr key={i} className={`border-b ${i > 0 && result.selectedItems.includes(i - 1) ? "bg-green-50" : ""}`}>
                                            <td className="p-2 border font-medium bg-muted/30">
                                                {i === 0 ? "Empty" : `Item ${i}`}
                                            </td>
                                            {row.map((val, j) => (
                                                <td key={j} className={`p-2 border ${i === result.dp.length - 1 && j === row.length - 1 ? 'bg-yellow-100 font-bold border-yellow-400' : ''}`}>
                                                    {val}
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
                    <p>Enter details and click "Calculate" to see the result.</p>
                </div>
            )}
        </AlgorithmPageLayout>
    );
}

export default ZeroOneKnapsackProblem;
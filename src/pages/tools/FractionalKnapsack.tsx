import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Item {
    id: number;
    profit: number;
    weight: number;
    ratio: number;
}

interface Step {
    step: number;
    itemSelected: string;
    itemWeight: number;
    itemProfit: number;
    fractionTaken: string;
    totalProfit: number;
    action: string;
    remainingCapacity: number;
}

function FractionalKnapsack() {
    const codeSnippet = `function fractionalKnapsack(items, capacity) {
  // Sort items based on their value-to-weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Total value of the knapsack
  let remainingCapacity = capacity;

  for (const item of items) {
    if (item.weight <= remainingCapacity) {
      // Take the whole item
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      // Take the fraction of the item that fits
      totalValue += item.ratio * remainingCapacity;
      break; // Knapsack is full
    }
  }

  return totalValue;
}`;

    const [weights, setWeights] = useState("");
    const [profits, setProfits] = useState("");
    const [capacity, setCapacity] = useState("");
    const [error, setError] = useState("");
    const [finalProfit, setFinalProfit] = useState<number | null>(null);
    const [steps, setSteps] = useState<Step[]>([]);

    function toIntArray(intString: string) {
        if (!intString.trim()) return [];
        return intString.split(',').map(num => {
            const parsed = parseInt(num.trim(), 10);
            return isNaN(parsed) ? null : parsed;
        }).filter((num): num is number => num !== null);
    }

    const calculateFractionalKnapsack = (items: Item[], capacityVal: number) => {
        let remainingCapacity = capacityVal;
        let totalValue = 0;

        // Check this logic: The original code showed sorting by ratio.
        // We should replicate that.
        const sortedItems = [...items].sort((a, b) => b.ratio - a.ratio);

        const currentSteps: Step[] = [];

        for (let i = 0; i < sortedItems.length; i++) {
            const item = sortedItems[i];
            let fraction = 0;

            if (remainingCapacity <= 0) break;

            if (item.weight <= remainingCapacity) {
                fraction = 1;
                remainingCapacity -= item.weight;
                totalValue += item.profit;
            } else {
                fraction = remainingCapacity / item.weight;
                totalValue += item.profit * fraction;
                remainingCapacity = 0;
            }

            currentSteps.push({
                step: i + 1,
                itemSelected: `Item ${item.id} (W:${item.weight}, P:${item.profit})`,
                itemWeight: item.weight,
                itemProfit: item.profit,
                fractionTaken: fraction === 1 ? "100%" : `${(fraction * 100).toFixed(2)}%`,
                totalProfit: totalValue,
                action: fraction === 1 ? "Taken completely" : "Taken partially",
                remainingCapacity: remainingCapacity
            });

            if (remainingCapacity === 0) break;
        }

        setSteps(currentSteps);
        return totalValue;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        const weightArr = toIntArray(weights);
        const profitArr = toIntArray(profits);
        const cap = parseFloat(capacity);

        if (weightArr.length === 0 || profitArr.length === 0) {
            setError("Weights and Profits arrays should not be empty.");
            return;
        }

        if (weightArr.length !== profitArr.length) {
            setError("The number of weights and profits must be equal.");
            return;
        }

        if (isNaN(cap) || cap <= 0) {
            setError("Capacity must be a positive number.");
            return;
        }

        const items: Item[] = weightArr.map((w, i) => ({
            id: i + 1,
            weight: w,
            profit: profitArr[i],
            ratio: profitArr[i] / w
        }));

        const maxProfit = calculateFractionalKnapsack(items, cap);
        setFinalProfit(maxProfit);
    };

    return (
        <AlgorithmPageLayout
            title="Fractional Knapsack Problem"
            description="A greedy algorithm that fills the knapsack with items to maximize profit. Items can be broken into smaller pieces."
            resources={[
                { label: "Wikipedia: Continuous Knapsack", url: "https://en.wikipedia.org/wiki/Continuous_knapsack_problem" },
                { label: "GeeksforGeeks", url: "https://www.geeksforgeeks.org/fractional-knapsack-problem/" }
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
            {steps.length > 0 ? (
                <div className="space-y-6">
                    <div className="bg-green-50/50 p-4 border rounded-lg">
                        <h3 className="font-bold text-green-900 mb-2">Total Profit</h3>
                        <p className="text-3xl font-mono">{finalProfit?.toFixed(2)}</p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm text-center">
                            <thead>
                                <tr className="bg-muted text-left">
                                    <th className="p-3 font-medium border-b">Item</th>
                                    <th className="p-3 font-medium border-b">Taken</th>
                                    <th className="p-3 font-medium border-b">Remaining Cap</th>
                                    <th className="p-3 font-medium border-b">Cumulative Profit</th>
                                </tr>
                            </thead>
                            <tbody>
                                {steps.map((step, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3 text-left">{step.itemSelected}</td>
                                        <td className="p-3">
                                            <span className={`px-2 py-1 rounded text-xs font-bold ${step.fractionTaken === "100%" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"}`}>
                                                {step.fractionTaken}
                                            </span>
                                        </td>
                                        <td className="p-3 font-mono">{step.remainingCapacity.toFixed(2)}</td>
                                        <td className="p-3 font-mono">{step.totalProfit.toFixed(2)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
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

export default FractionalKnapsack;
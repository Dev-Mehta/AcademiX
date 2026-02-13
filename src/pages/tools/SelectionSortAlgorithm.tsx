import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step {
    i: number;
    min_idx: number; // Index of minimum element found
    min_val: number; // Value of minimum element found
    arr: number[];
    beforeSwap: number[];
    sortedIndex: number; // Up to this index is sorted
}

function SelectionSortAlgorithm() {
    const codeSnippet = `function selectionSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[min_idx]) {
                min_idx = j;
            }
        }
        if (min_idx !== i) {
            let temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
        }
    }
    return arr;
}`;

    const [numbers, setNumbers] = useState("");
    const [steps, setSteps] = useState<Step[]>([]);
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
        const arr = toIntArray(numbers);

        if (arr.length === 0) {
            setError("Please enter a valid comma-separated list of numbers.");
            setSteps([]);
            return;
        }

        const newSteps: Step[] = [];
        const n = arr.length;

        for (let i = 0; i < n - 1; i++) {
            let min_idx = i;

            // Note: We are only visualizing the state AFTER finding the min_idx and swapping
            for (let j = i + 1; j < n; j++) {
                if (arr[j] < arr[min_idx]) {
                    min_idx = j;
                }
            }

            const beforeSwap = [...arr];
            const valAtI = arr[i];
            const valAtMin = arr[min_idx];

            if (min_idx !== i) {
                arr[i] = valAtMin;
                arr[min_idx] = valAtI;
            }

            newSteps.push({
                i: i,
                min_idx: min_idx,
                min_val: valAtMin,
                beforeSwap: beforeSwap,
                arr: [...arr],
                sortedIndex: i
            });
        }

        // Add final step to show complete array
        newSteps.push({
            i: n - 1,
            min_idx: n - 1,
            min_val: arr[n - 1],
            beforeSwap: [...arr],
            arr: [...arr],
            sortedIndex: n - 1
        });

        setSteps(newSteps);
    };

    return (
        <AlgorithmPageLayout
            title="Selection Sort"
            description="Sorts an array by repeatedly finding the minimum element from the unsorted part and putting it at the beginning."
            resources={[
                { label: "Selection Sort", url: "https://en.wikipedia.org/wiki/Selection_sort" },
                // { label: "Visualization", url: "https://visualgo.net/en/sorting" }
            ]}
            codeSnippet={codeSnippet}
            controls={
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label htmlFor="arr" className="text-sm font-medium leading-none">
                            Array (comma separated)
                        </label>
                        <Input
                            id="arr"
                            placeholder="e.g. 64, 25, 12, 22, 11"
                            value={numbers}
                            onChange={(e) => setNumbers(e.target.value)}
                        />
                        {error && <p className="text-sm text-destructive">{error}</p>}
                    </div>
                    <Button type="submit" className="w-full">
                        Sort
                    </Button>
                </form>
            }
        >
            {steps.length > 0 ? (
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse text-sm">
                        <thead>
                            <tr className="bg-muted text-left">
                                <th className="p-3 font-medium border-b">Step (i)</th>
                                <th className="p-3 font-medium border-b">Min Value Found</th>
                                <th className="p-3 font-medium border-b">State</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => {
                                const isFinal = index === steps.length - 1;
                                return (
                                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3 font-mono">{isFinal ? "Complete" : step.i}</td>
                                        <td className="p-3 font-mono">{isFinal ? "-" : step.min_val}</td>
                                        {/* <td className="p-3">
                                            <div className="flex gap-1">
                                                {step.arr.map((val, idx) => {
                                                    let className = "bg-secondary text-secondary-foreground";

                                                    if (idx <= step.sortedIndex) {
                                                        className = "bg-green-200 text-green-900 font-bold"; // Sorted part
                                                    } else if (!isFinal) {
                                                        if (idx === step.i || idx === step.min_idx) {
                                                            className = "bg-yellow-200 text-yellow-900 border-yellow-500 border"; // Swapped elements
                                                        }
                                                    }

                                                    return (
                                                        <span
                                                            key={idx}
                                                            className={`px-2 py-1 rounded text-xs font-mono transition-colors ${className}`}
                                                        >
                                                            {val}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td> */}
                                        <td className="p-3 space-y-2">
                                        {/* Before Swap */}
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs text-muted-foreground w-20">Before</span>
                                            {step.beforeSwap.map((val, idx) => {
                                                let className = "bg-secondary text-secondary-foreground";

                                                if (idx === step.min_idx) {
                                                    className = "bg-red-200 text-red-900 font-bold"; // Min found
                                                } else if (idx === step.i) {
                                                    className = "bg-yellow-200 text-yellow-900 border border-yellow-500"; // Current i
                                                }

                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`px-2 py-1 rounded text-xs font-mono ${className}`}
                                                    >
                                                        {val}
                                                    </span>
                                                );
                                            })}
                                        </div>

                                        {/* After Swap */}
                                        <div className="flex gap-1 items-center">
                                            <span className="text-xs text-muted-foreground w-20">After</span>
                                            {step.arr.map((val, idx) => {
                                                let className = "bg-secondary text-secondary-foreground";

                                                if (idx <= step.sortedIndex) {
                                                    className = "bg-green-200 text-green-900 font-bold"; // Sorted
                                                }

                                                return (
                                                    <span
                                                        key={idx}
                                                        className={`px-2 py-1 rounded text-xs font-mono ${className}`}
                                                    >
                                                        {val}
                                                    </span>
                                                );
                                            })}
                                        </div>
                                    </td>

                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>Enter numbers and click "Sort" to see the visualization.</p>
                </div>
            )}
        </AlgorithmPageLayout>
    );
}

export default SelectionSortAlgorithm;
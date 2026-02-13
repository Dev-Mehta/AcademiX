import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step {
    arr: number[];
    i: number;
    j: number;
    pivotIndex?: number;
    fixedIndices: Set<number>;
    processing: string;
    type: 'partition' | 'swap' | 'fix';
}

function QuickSortAlgorithm() {
    const codeSnippet = `function partition(arr, low, high) {
    let pivot = arr[high];
    let i = (low - 1);

    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            [arr[i], arr[j]] = [arr[j], arr[i]];
        }
    }
    [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
    return (i + 1);
}

function quickSort(arr, low, high) {
    if (low < high) {
        let pi = partition(arr, low, high);
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
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
        // Note: The visualization implementation below uses a slightly different logic (Hoare or similar manual tracking) 
        // than the standard simpler Lomuto partition shown in the snippet above to make visualization clearer.
        // We will stick to the existing logic but type it correctly.

        // Creating a deep copy for the sort function to work on
        const arrCopy = [...arr];
        quickSortRecursive(arrCopy, 0, arrCopy.length - 1, newSteps, new Set());
        setSteps(newSteps);
    };

    // Helper to log swap
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    function swap(arr: number[], i: number, j: number, newSteps: Step[], fixedIndices: Set<number>) {
        if (i === j) return;
        [arr[i], arr[j]] = [arr[j], arr[i]];
        // We record the state AFTER the swap
    }

    // Implementing the logic from the previous file which seemed to try to visualize the partitioning
    // However, the previous logic was a bit mixed. Let's implement standard Lomuto Partition for consistency with snippet.

    function partition(arr: number[], low: number, high: number, newSteps: Step[], fixedIndices: Set<number>) {
        const pivot = arr[high];
        let i = low - 1;

        newSteps.push({
            arr: [...arr],
            i: low,
            j: high,
            pivotIndex: high,
            fixedIndices: new Set(fixedIndices),
            processing: `Partitioning range [${low}, ${high}] with pivot ${pivot}`,
            type: 'partition'
        });

        for (let j = low; j <= high - 1; j++) {
            // Visualizing comparison could be added here

            if (arr[j] < pivot) {
                i++;
                if (i !== j) {
                    [arr[i], arr[j]] = [arr[j], arr[i]];
                    newSteps.push({
                        arr: [...arr],
                        i: i,
                        j: j,
                        pivotIndex: high,
                        fixedIndices: new Set(fixedIndices),
                        processing: `Swapped ${arr[i]} and ${arr[j]} (smaller than pivot)`,
                        type: 'swap'
                    });
                }
            }
        }

        if (i + 1 !== high) {
            [arr[i + 1], arr[high]] = [arr[high], arr[i + 1]];
            newSteps.push({
                arr: [...arr],
                i: i + 1,
                j: high,
                pivotIndex: i + 1, // Pivot is now here
                fixedIndices: new Set(fixedIndices),
                processing: `Moved pivot to correct position ${i + 1}`,
                type: 'swap'
            });
        }

        return i + 1;
    }

    function quickSortRecursive(arr: number[], low: number, high: number, newSteps: Step[], fixedIndices: Set<number>) {
        if (low < high) {
            const pi = partition(arr, low, high, newSteps, fixedIndices);

            // Mark pivot as fixed
            fixedIndices.add(pi);
            newSteps.push({
                arr: [...arr],
                i: pi,
                j: pi,
                pivotIndex: pi,
                fixedIndices: new Set(fixedIndices),
                processing: `Pivot ${arr[pi]} fixed at index ${pi}`,
                type: 'fix'
            });

            quickSortRecursive(arr, low, pi - 1, newSteps, fixedIndices);
            quickSortRecursive(arr, pi + 1, high, newSteps, fixedIndices);
        } else if (low === high) {
            fixedIndices.add(low);
            newSteps.push({
                arr: [...arr],
                i: low,
                j: low,
                pivotIndex: low,
                fixedIndices: new Set(fixedIndices),
                processing: `Element ${arr[low]} is sorted`,
                type: 'fix'
            });
        }
    }

    return (
        <AlgorithmPageLayout
            title="Quick Sort"
            description="An efficient, in-place sorting algorithm that uses a divide-and-conquer strategy to sort elements."
            resources={[
                { label: "Quick Sort", url: "https://en.wikipedia.org/wiki/Quicksort" },
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
                            placeholder="e.g. 10, 7, 8, 9, 1, 5"
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
                <div className="space-y-4">
                    <div className="flex gap-4 text-sm justify-center">
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-blue-200 border border-blue-400"></span> Pivot</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-yellow-200 border border-yellow-400"></span> Swapping/Active</div>
                        <div className="flex items-center gap-2"><span className="w-4 h-4 bg-green-200 border border-green-400"></span> Fixed/Sorted</div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm">
                            <thead>
                                <tr className="bg-muted text-left">
                                    <th className="p-3 font-medium border-b w-1/4">Step</th>
                                    <th className="p-3 font-medium border-b">State</th>
                                </tr>
                            </thead>
                            <tbody>
                                {steps.map((step, index) => (
                                    <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="p-3">
                                            <div className="font-medium text-xs text-muted-foreground mb-1">
                                                {step.type.toUpperCase()}
                                            </div>
                                            {step.processing}
                                        </td>
                                        <td className="p-3">
                                            <div className="flex gap-1 flex-wrap">
                                                {step.arr.map((val, idx) => {
                                                    let className = "bg-secondary text-secondary-foreground";
                                                    if (step.fixedIndices.has(idx)) {
                                                        className = "bg-green-200 text-green-900 font-bold border-green-400 border";
                                                    } else if (idx === step.pivotIndex) {
                                                        className = "bg-blue-200 text-blue-900 font-bold border-blue-400 border";
                                                    } else if (step.type === 'swap' && (idx === step.i || idx === step.j)) {
                                                        className = "bg-yellow-200 text-yellow-900 border-yellow-400 border";
                                                    }

                                                    return (
                                                        <span
                                                            key={idx}
                                                            className={`min-w-[2rem] h-8 flex items-center justify-center rounded text-xs font-mono transition-colors border ${className}`}
                                                        >
                                                            {val}
                                                        </span>
                                                    );
                                                })}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <p>Enter numbers and click "Sort" to see the visualization.</p>
                </div>
            )}
        </AlgorithmPageLayout>
    );
}

export default QuickSortAlgorithm;
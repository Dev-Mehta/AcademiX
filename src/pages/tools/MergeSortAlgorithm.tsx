import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step {
    key: string;
    value: string;
    type: 'split' | 'merge' | 'single' | 'start';
}

function MergeSortAlgorithm() {
    const codeSnippet = `function merge(arr, left, mid, right) {
    const n1 = mid - left + 1;
    const n2 = right - mid;

    // Create temp arrays
    const L = new Array(n1);
    const R = new Array(n2);

    // Copy data to temp arrays L[] and R[]
    for (let i = 0; i < n1; i++)
        L[i] = arr[left + i];
    for (let j = 0; j < n2; j++)
        R[j] = arr[mid + 1 + j];

    let i = 0, j = 0, k = left;

    // Merge the temp arrays back into arr[left..right]
    while (i < n1 && j < n2) {
        if (L[i] <= R[j]) {
            arr[k] = L[i];
            i++;
        } else {
            arr[k] = R[j];
            j++;
        }
        k++;
    }
    // ... Copy remaining elements
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
        newSteps.push({ key: "Start", value: `[${arr.join(', ')}]`, type: 'start' });

        mergeSort(arr, 0, arr.length - 1, newSteps);
        setSteps(newSteps);
    };

    function merge(arr: number[], left: number, mid: number, right: number, steps: Step[]) {
        const n1 = mid - left + 1;
        const n2 = right - mid;

        const L = new Array(n1);
        const R = new Array(n2);

        for (let i = 0; i < n1; i++) L[i] = arr[left + i];
        for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];

        let i = 0, j = 0, k = left;

        steps.push({
            key: `Merging`,
            value: `[${L.join(', ')}] and [${R.join(', ')}]`,
            type: 'merge'
        });

        while (i < n1 && j < n2) {
            if (L[i] <= R[j]) {
                arr[k] = L[i];
                i++;
            } else {
                arr[k] = R[j];
                j++;
            }
            k++;
        }

        while (i < n1) {
            arr[k] = L[i];
            i++;
            k++;
        }

        while (j < n2) {
            arr[k] = R[j];
            j++;
            k++;
        }

        steps.push({
            key: `Merged Result`,
            value: `[${arr.slice(left, right + 1).join(', ')}]`,
            type: 'merge'
        });
    }

    function mergeSort(arr: number[], left: number, right: number, steps: Step[]) {
        if (left >= right) {
            steps.push({
                key: `Single Element`,
                value: `[${arr[left]}]`,
                type: 'single'
            });
            return;
        }

        const mid = Math.floor((left + right) / 2);

        const currentArray = `[${arr.slice(left, right + 1).join(', ')}]`;
        const leftPart = `[${arr.slice(left, mid + 1).join(', ')}]`;
        const rightPart = `[${arr.slice(mid + 1, right + 1).join(', ')}]`;

        steps.push({
            key: `Splitting`,
            value: `${currentArray} -> ${leftPart} & ${rightPart}`,
            type: 'split'
        });

        mergeSort(arr, left, mid, steps);
        mergeSort(arr, mid + 1, right, steps);
        merge(arr, left, mid, right, steps);
    }

    return (
        <AlgorithmPageLayout
            title="Merge Sort"
            description="Divide and Conquer algorithm. It divides the input array into two halves, calls itself for the two halves, and then merges the two sorted halves."
            resources={[
                { label: "What is Merge Sort", url: "https://en.wikipedia.org/wiki/Merge_sort" },
                
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
                            placeholder="e.g. 12, 11, 13, 5, 6, 7"
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
                                <th className="p-3 font-medium border-b w-1/4">Action</th>
                                <th className="p-3 font-medium border-b">Detail</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step, index) => (
                                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="p-3">
                                        <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide
                                            ${step.type === 'split' ? 'bg-blue-100 text-blue-800' :
                                                step.type === 'merge' ? 'bg-purple-100 text-purple-800' :
                                                    step.type === 'single' ? 'bg-gray-100 text-gray-800' :
                                                        'bg-green-100 text-green-800'}`}>
                                            {step.key}
                                        </span>
                                    </td>
                                    <td className="p-3 font-mono text-sm">{step.value}</td>
                                </tr>
                            ))}
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

export default MergeSortAlgorithm;
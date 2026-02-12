import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface BubbleSortStep {
  key: string;
  value: number[];
  i: number;
  j: number;
  beforeSwap: number[];
}

function BubbleSortAlgorithm() {
  const codeSnippet = `function bubbleSort(arr) {
    let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
        }
      }
    }
    return arr;
  }`;

  const [numbers, setNumbers] = useState("");
  const [steps, setSteps] = useState<BubbleSortStep[]>([]);

  function toIntArray(intString: string) {
    const strArray = intString.split(',');
    const intArray = strArray.map(num => {
      try {
        const parsed = parseInt(num.trim(), 10);
        if (isNaN(parsed)) {
          throw new Error(`Invalid number: "${num.trim()}"`);
        }
        return parsed;
      } catch (error) {
        console.error((error as Error).message);
        return Number.MIN_VALUE;
      }
    });
    return intArray;
  }

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newSteps: BubbleSortStep[] = [];
    const arr = toIntArray(numbers);
    const n = arr.length;

    for (let i = 0; i < n - 1; i++) {
      for (let j = 0; j < n - i - 1; j++) {
        if (arr[j] > arr[j + 1]) {
          const temp = [...arr];
          [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
          newSteps.push({ key: `${i},${j}`, value: [...arr], i, j, beforeSwap: temp });
        }
      }
    }
    setSteps(newSteps);
  };

  return (
    <AlgorithmPageLayout
      title="Bubble Sort"
      description="A simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order."
      resources={[
        { label: "Wikipedia: Bubble Sort", url: "https://en.wikipedia.org/wiki/Bubble_sort" },
        { label: "Visualization", url: "https://visualgo.net/en/sorting" }
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
              placeholder="e.g. 5, 3, 8, 4, 2"
              value={numbers}
              onChange={(e) => setNumbers(e.target.value)}
            />
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
                <th className="p-3 font-medium border-b">[i, j]</th>
                <th className="p-3 font-medium border-b">Before Swap</th>
                <th className="p-3 font-medium border-b">After Swap</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => (
                <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="p-3 font-mono">{step.key}</td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {step.beforeSwap.map((val, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs font-mono transition-colors ${idx === step.j || idx === step.j + 1
                              ? "bg-yellow-200 text-yellow-900 font-bold"
                              : "bg-secondary text-secondary-foreground"
                            }`}
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-1">
                      {step.value.map((val, idx) => (
                        <span
                          key={idx}
                          className={`px-2 py-1 rounded text-xs font-mono transition-colors ${idx === step.j || idx === step.j + 1
                              ? "bg-green-200 text-green-900 font-bold"
                              : "bg-secondary text-secondary-foreground"
                            }`}
                        >
                          {val}
                        </span>
                      ))}
                    </div>
                  </td>
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

export default BubbleSortAlgorithm;
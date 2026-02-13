import React, { useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Step {
  i: number;
  key: number;
  swappingWith: number;
  arr: number[];
  beforeSwap: number[];
  index: number;
  type: 'compare' | 'swap' | 'insert' | 'complete';
}

function InsertionSortAlgorithm() {
  const codeSnippet = `function insertionSort(arr) {
    let n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j = j - 1;
        }
        arr[j + 1] = key;
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
      return;
    }

    const newSteps: Step[] = [];
    // Initial state
    newSteps.push({
      i: 0,
      key: 0,
      swappingWith: 0,
      arr: [...arr],
      beforeSwap: [...arr],
      index: 0,
      type: 'compare' // Initial view
    });

    // Running the algorithm logic to generate steps
    // Note: The original logic didn't exactly match standard insertion sort step-by-step visualization essentially.
    // Let's keep the logic close to the original but structured for display.

    const workingArr = [...arr];
    for (let i = 1; i < workingArr.length; i++) {
      const key = workingArr[i];
      let j = i - 1;

      // Capture comparison state
      newSteps.push({
        i,
        key,
        swappingWith: workingArr[j],
        arr: [...workingArr],
        beforeSwap: [...workingArr],
        index: j,
        type: 'compare'
      });

      while (j >= 0 && workingArr[j] > key) {
        workingArr[j + 1] = workingArr[j];
        newSteps.push({
          i,
          key,
          swappingWith: workingArr[j], // Value being moved
          arr: [...workingArr], // Array after move
          beforeSwap: [...workingArr], // Not perfectly accurate 'before' but sufficient for seq
          index: j,
          type: 'swap'
        });
        j = j - 1;
      }
      workingArr[j + 1] = key;
      newSteps.push({
        i,
        key,
        swappingWith: key,
        arr: [...workingArr],
        beforeSwap: [...workingArr],
        index: j + 1,
        type: 'insert'
      });
    }

    // Final completion step
    newSteps.push({
      i: workingArr.length,
      key: 0,
      swappingWith: 0,
      arr: [...workingArr],
      beforeSwap: [...workingArr],
      index: 0,
      type: 'complete'
    });

    setSteps(newSteps);
  };

  return (
    <AlgorithmPageLayout
      title="Insertion Sort"
      description="Builds the final sorted array (or list) one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort."
      resources={[
        { label: "Wikipedia: Insertion Sort", url: "https://en.wikipedia.org/wiki/Insertion_sort" },
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
                <th className="p-3 font-medium border-b">Step</th>
                <th className="p-3 font-medium border-b">Action</th>
                <th className="p-3 font-medium border-b">State</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => {
                if (step.type === 'complete') {
                  return (
                    <tr key={index} className="border-b bg-green-50/50">
                      <td className="p-3 font-mono">Final</td>
                      <td className="p-3">Sorted</td>
                      <td className="p-3">
                        <div className="flex gap-1">
                          {step.arr.map((val, idx) => (
                            <span key={idx} className="bg-green-200 text-green-900 px-2 py-1 rounded text-xs font-mono font-bold">
                              {val}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  );
                }

                return (
                  <tr key={index} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="p-3 font-mono">{index + 1}</td>
                    <td className="p-3">
                      {step.type === 'compare' && `Compare ${step.key} with ${step.swappingWith}`}
                      {step.type === 'swap' && `Move ${step.swappingWith} forward`}
                      {step.type === 'insert' && `Insert ${step.key} at position ${step.index}`}
                    </td>
                    <td className="p-3">
                      <div className="flex gap-1">
                        {step.arr.map((val, idx) => {
                          let className = "bg-secondary text-secondary-foreground";
                          if (step.type === 'compare' && (idx === step.i || idx === step.index)) {
                            className = "bg-yellow-200 text-yellow-900 font-bold";
                          } else if (step.type === 'insert' && idx === step.index) {
                            className = "bg-blue-200 text-blue-900 font-bold";
                          } else if (idx < step.i) {
                            className = "bg-green-100 text-green-900"; // Sorted portion
                          }

                          return (
                            <span
                              key={idx}
                              className={`px-2 py-1 rounded text-xs font-mono transition-colors ${className}`}
                            >
                              {val}
                            </span>
                          )
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

export default InsertionSortAlgorithm;

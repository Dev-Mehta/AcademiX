import React, { useState, useEffect } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { dracula, CopyBlock } from 'react-code-blocks'

function QuickSortAlgorithm() {
    const codeSnippet = `// Partition function
function partition(arr, low, high)
{

    // Choose the pivot
    let pivot = arr[high];

    // Index of smaller element and indicates
    // the right position of pivot found so far
    let i = low - 1;

    // Traverse arr[low..high] and move all smaller
    // elements to the left side. Elements from low to
    // i are smaller after every iteration
    for (let j = low; j <= high - 1; j++) {
        if (arr[j] < pivot) {
            i++;
            swap(arr, i, j);
        }
    }

    // Move pivot after smaller elements and
    // return its position
    swap(arr, i + 1, high);
    return i + 1;
}

// Swap function
function swap(arr, i, j)
{
    let temp = arr[i];
    arr[i] = arr[j];
    arr[j] = temp;
}

// The QuickSort function implementation
function quickSort(arr, low, high)
{
    if (low < high) {

        // pi is the partition return index of pivot
        let pi = partition(arr, low, high);

        // Recursion calls for smaller elements
        // and greater or equals elements
        quickSort(arr, low, pi - 1);
        quickSort(arr, pi + 1, high);
    }
}

// Main driver code
let arr = [ 10, 7, 8, 9, 1, 5 ];
let n = arr.length;

// Call QuickSort on the entire array
quickSort(arr, 0, n - 1);
for (let i = 0; i < arr.length; i++) {
    console.log(arr[i] + " ");
}
`

    const [numbers, setNumbers] = useState("");
    const [steps, setSteps] = useState([]);



    function toIntArray(intString: string) {
        const strArray = intString.split(','); // Splitting the string into an array
        const intArray = strArray.map(num => {
            try {
                const parsed = parseInt(num.trim(), 10);
                if (isNaN(parsed)) {
                    throw new Error(`Invalid number: "${num.trim()}"`);
                }
                return parsed;
            } catch (error: unknown) {
                console.error((error as Error).message);
                return Number.MIN_VALUE; // or handle it as needed
            }
        });

        return intArray;
    }

  

    const handleSubmit = (event) => {
        event.preventDefault();
        const arr = toIntArray(numbers);
        setSteps([]);
        const newSteps = [];
        quickSort(arr, 0, arr.length - 1, newSteps, new Set());
        setSteps(newSteps);
    };

    function swap(arr, i, j, newSteps, fixedIndices) {
        [arr[i], arr[j]] = [arr[j], arr[i]];
        newSteps.push({
            arr: [...arr],
            i: i,
            j: j,
            fixedIndices: new Set(fixedIndices),
            processing: `Swapping ${arr[i]} and ${arr[j]}`
        });
    }
    
    function partition(arr, low, high, newSteps, fixedIndices) {
        const pivot = arr[low];
        let i = low + 1;
        let j = high;
    
        newSteps.push({
            arr: [...arr],
            i: low,
            j: high,
            fixedIndices: new Set(fixedIndices),
            processing: `Pivot selected: ${pivot}`
        });
    
        while (i <= j) {
            while (i <= high && arr[i] <= pivot) i++;
            while (j >= low && arr[j] > pivot) j--;
    
            if (i < j) {
                swap(arr, i, j, newSteps, fixedIndices);
            }
        }
    
        swap(arr, low, j, newSteps, fixedIndices);
    
        // Mark the pivot position as fixed after placing it correctly
        fixedIndices.add(j);
        newSteps.push({
            arr: [...arr],
            i: j,
            j: j,
            fixedIndices: new Set(fixedIndices),
            processing: `Pivot ${arr[j]} fixed at position ${j}`
        });
    
        return j;
    }
    
    function quickSort(arr, low, high, newSteps, fixedIndices) {
        if (low < high) {
            const pi = partition(arr, low, high, newSteps, fixedIndices);
            quickSort(arr, low, pi - 1, newSteps, fixedIndices);
            quickSort(arr, pi + 1, high, newSteps, fixedIndices);
        } else if (low === high) {
            fixedIndices.add(low);
            newSteps.push({
                arr: [...arr],
                i: low,
                j: low,
                fixedIndices: new Set(fixedIndices),
                processing: `Single element sorted at index ${low}`
            });
        }
    }
    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Quick Sort</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Quicksort'>:Explanation</a></p>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Quicksort#Lomuto_partition_scheme'>:Pseudo Code</a></p>

                <Accordion type="single" collapsible className="">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold">Algorithm?</AccordionTrigger>
                        <AccordionContent className='font-mono w-full'>

                            <CopyBlock
                                text={codeSnippet}
                                language="JavaScript"
                                theme={dracula}
                                codeBlock></CopyBlock>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className='flex flex-col gap-2'>
                    Array (comma seperated): <input type="text" name="arr" id="arr" className='border p-2 rounded-md' onChange={(e) => { setNumbers(e.target.value) }} />
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(event) => { handleSubmit(event) }}>Calculate</button>
                </form>
                <table className='border-collapse font-mono my-4 border border-slate-400 w-full'>
                <thead>
                    <tr>
                        <th className="px-2 border border-slate-400">[i,j]</th>
                        <th className="px-2 border border-slate-400">Array</th>
                        <th className="px-2 border border-slate-400">Processing</th>
                    </tr>
                </thead>
                <tbody>
                {steps.length > 0 && steps.map((step, index) => (
                        <tr key={index}>
                            <td className="px-2 mx-2 border border-slate-400">[{step.i},{step.j}]</td>
                            <td className="px-2 mx-2 border border-slate-400">
                                {step.arr.map((val, idx) => {
                                    let className = "px-1";
                                    if (step.fixedIndices.has(idx)) className = "bg-green-300 px-1"; // Fixed element
                                    else if (idx === step.i || idx === step.j) className = "bg-yellow-300 px-1"; // Swap
                                    if (idx === step.i) className = "bg-blue-300 px-1"; // Pivot
                                    return <span key={idx} className={className}>{val} </span>;
                                })}
                            </td>
                            <td className="px-2 mx-2 border border-slate-400">{step.processing}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="mt-2">Color Legend: <span className="bg-yellow-300 px-1">Swap</span>, <span className="bg-blue-300 px-1">Pivot</span>, <span className="bg-green-300 px-1">Fixed</span></div>
                      
            </div>
        </div>
    )
}

export default QuickSortAlgorithm
import React, { useState, useEffect } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'


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

    let i = 0, j = 0;
    let k = left;

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

    // Copy the remaining elements of L[], if there are any
    while (i < n1) {
        arr[k] = L[i];
        i++;
        k++;
    }

    // Copy the remaining elements of R[], if there are any
    while (j < n2) {
        arr[k] = R[j];
        j++;
        k++;
    }
}

function mergeSort(arr, left, right) {
    if (left >= right)
        return;

    const mid = Math.floor(left + (right - left) / 2);
    mergeSort(arr, left, mid);
    mergeSort(arr, mid + 1, right);
    merge(arr, left, mid, right);
}`;
    const [numbers, setNumbers] = useState("");
    const [steps, setSteps] = useState([]);

    function toIntArray(intString) {
        const strArray = intString.split(",");
        const intArray = strArray.map((num) => {
            try {
                const parsed = parseInt(num.trim(), 10);
                if (isNaN(parsed)) {
                    throw new Error(`Invalid number: "${num.trim()}"`);
                }
                return parsed;
            } catch (error) {
                console.error((error).message);
                return Number.MIN_VALUE;
            }
        });

        return intArray;
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log("Handling submit");
        const arr = toIntArray(numbers); // Convert input numbers to an integer array
        const steps = [];
        mergeSort(arr, 0, arr.length - 1, steps);
        setSteps(steps);
    };

    function merge(arr, left, mid, right, steps) {
        const n1 = mid - left + 1;
        const n2 = right - mid;
    
        const L = new Array(n1);
        const R = new Array(n2);
    
        for (let i = 0; i < n1; i++) L[i] = arr[left + i];
        for (let j = 0; j < n2; j++) R[j] = arr[mid + 1 + j];
    
        let i = 0, j = 0, k = left;
    
        // Log merging step with involved values
        steps.push({ 
            key: `Merging: [${L.join(',')}] and [${R.join(',')}]`, 
            value: `[${arr.slice(left, right + 1).join(',')}]`
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
    
        // Log the merged result
        steps.push({ 
            key: `Merged`, 
            value: `[${arr.slice(left, right + 1).join(',')}]`
        });
    }
    
    function mergeSort(arr, left, right, steps) {
        if (left >= right) {
            // Avoid repeating the same single element multiple times
            steps.push({ 
                key: `Single`, 
                value: `[${arr[left]}]`
            });
            return;
        }
    
        const mid = Math.floor((left + right) / 2);
    
        // Log splitting step with involved values
        const currentArray = `[${arr.slice(left, right + 1).join(',')}]`;
        const leftPart = `[${arr.slice(left, mid + 1).join(',')}]`;
        const rightPart = `[${arr.slice(mid + 1, right + 1).join(',')}]`;
        steps.push({ 
            key: `Splitting`, 
            value: `${currentArray} -> ${leftPart} and ${rightPart}`
        });
    
        mergeSort(arr, left, mid, steps);
        mergeSort(arr, mid + 1, right, steps);
        merge(arr, left, mid, right, steps);
    }
    
    

    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Merge Sort</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Merge_sort'>:Explanation</a></p>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Merge_sort#Algorithm'>:Implementation</a></p>

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
                <div id="output">
                    <table className="border-collapse font-mono my-4 border border-slate-400 w-full shadow-lg rounded-md">
                        <thead>
                            <tr>
                                <th className="px-2 border border-slate-400">Step</th>
                                <th className="px-2 border border-slate-400">Array</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.length > 0 &&
                                steps.map((step, index) => (
                                    <tr key={index} className='odd:bg-slate-100 even:bg-slate-200 hover:bg-slate-300 transition duration-200'>
                                        <td className="px-4 py-2 border border-slate-400">{step.key}</td>
                                        <td className="px-4 py-2 border border-slate-400">{step.value}</td>
                                    </tr>
                                ))
                            }
                        </tbody>
                    </table>

                </div>
            </div>
        </div>
    )
}

export default MergeSortAlgorithm
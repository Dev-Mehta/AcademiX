import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'

function SelectionSortAlgorithm() {
    const codeSnippet = `let n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        let min_idx = i;

        for (let j = i + 1; j < n; j++) {
            if (arr && arr[j] < arr[min_idx]) {
            
                min_idx = j;
            }
        }
        let temp = arr[i];
        arr[i] = arr[min_idx];
        arr[min_idx] = temp;
}`
    const [numbers, setNumbers] = useState("")
    const [steps, setSteps] = useState<{ i: number | null; min_val: number | null; arr: (number | null)[]; beforeSwap: any; index: number }[]>([])
    function toIntArray(intString: string) {
        const strArray = intString.split(','); // Splitting the string into an array
        if (strArray.length === 1) {
            if (strArray[0] === "") {
                return [Number.MIN_VALUE];
            }
            const parsed = parseInt(strArray[0].trim(), 10);
            if (isNaN(parsed)) {
                return [Number.MIN_VALUE];
            }
            else {
                return [parsed];
            }
        }
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
    const [error, setError] = useState("");
    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        console.log('handling submit')
        const newSteps = [];
        const arr = toIntArray(numbers);
        if (arr[0] === Number.MIN_VALUE) {
            setError("Please make sure array is not empty");
        }
        const n = arr.length;
        if (arr.length == 1) {
            steps.push({ "i": arr[0], "min_val": arr[0], "arr": arr, "beforeSwap": arr, "index": 0 });
            setSteps(steps);
            return;
        }
        for (let i = 0; i < n - 1; i++) {
            let min_idx = i;

            for (let j = i + 1; j < n; j++) {
                if (arr !== null) {
                    if (arr[j] < arr[min_idx]) {
                        min_idx = j;
                        console.log(newSteps)
                    }
                }
            }
            const beforeSwap = JSON.parse(JSON.stringify(arr));
            const temp = arr[i];
            arr[i] = arr[min_idx];
            arr[min_idx] = temp;
            newSteps.push({ "i": arr[min_idx], "min_val": arr[i], "arr": arr, "beforeSwap": beforeSwap, "index": i });
            console.log(arr);
        }
        setSteps(newSteps);
        console.log(steps, "steps")
    }
    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Selection Sort</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Selection_sort'>:    Explanation</a></p>
                <Accordion type="single" collapsible className="">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold">Algorithm</AccordionTrigger>
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
                    {error &&
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                            <span className="block sm:inline"><strong className="font-bold">Error!</strong> {error}</span>
                        </div>
                    }
                </form>
                <div id="output">
                    <table className='border-collapse font-mono my-4 border border-slate-400 w-full'>
                        <thead>
                            <tr>
                                <th className="px-2 border border-slate-400">Current Item(i)</th>
                                <th className="px-2 border border-slate-400">Mininum Item</th>
                                <th className="px-2 border border-slate-400">Before Swap Array</th>
                                <th className="px-2 border border-slate-400">After Swap Array</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.length > 0 && steps.map((step: { i: number | null; min_val: number | null; arr: (number | null)[]; beforeSwap: any; index: number }, index: number) => {
                                console.log(`debugging step`, step)
                                return (
                                    <tr key={index}>
                                        <td className="px-2 mx-2 border border-slate-400">{step.i}</td>
                                        <td className="px-2 mx-2 border border-slate-400">{step.min_val}</td>
                                        <td className='px-2 mx-2 border border-slate-400'>
                                            {step.beforeSwap.map(
                                                (val: number | null, index: number) => {
                                                    return val === step.i || val === step.min_val ? (
                                                        <span key={index} className="bg-yellow-300 underline mx-1 px-1 font-bold rounded-sm shadow-sm">
                                                            {val}
                                                        </span>
                                                    ) : index < step.index ? (
                                                        <span key={index} className="mx-1 px-1 rounded-sm bg-green-300 text-slate-700">
                                                            {val}
                                                        </span>
                                                    ) : (
                                                        <span key={index} className="mx-1 px-1 rounded-sm bg-red-300 text-slate-700">
                                                            {val}
                                                        </span>
                                                    );
                                                }
                                            )}</td>
                                        <td className='px-2 mx-2 border border-slate-400'>
                                            {step.arr.map(
                                                (val: number | null, index: number) => {
                                                    return val === step.i || val === step.min_val ? (
                                                        <span key={index} className="bg-yellow-300 underline mx-1 px-1 font-bold rounded-sm shadow-sm">
                                                            {val}
                                                        </span>
                                                    ) : index <= step.index ? (
                                                        <span key={index} className="mx-1 px-1 rounded-sm bg-green-300 text-slate-700">
                                                            {val}
                                                        </span>
                                                    ) : (
                                                        <span key={index} className="mx-1 px-1 rounded-sm bg-red-300 text-slate-700">
                                                            {val}
                                                        </span>
                                                    );
                                                }
                                            )}</td>
                                    </tr>
                                );
                            })}
                            {/* show final sorted array */}
                            {steps.length > 0 && (
                                <tr>
                                    <td className="px-2 mx-2 border border-slate-400">-</td>
                                    <td className="px-2 mx-2 border border-slate-400">-</td>
                                    <td className='px-2 mx-2 border border-slate-400'>-</td>
                                    <td className='px-2 mx-2 border border-slate-400'>
                                        {steps[steps.length - 1].arr.map(
                                            (val: number | null, index: number) => {
                                                return (
                                                    <span key={index} className="mx-1 px-1 rounded-sm bg-green-300 text-slate-700">
                                                        {val}
                                                    </span>
                                                );
                                            }
                                        )}</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default SelectionSortAlgorithm
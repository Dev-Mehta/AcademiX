import React, { useState } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion";
import { CopyBlock, dracula } from 'react-code-blocks';

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
    const strArray = intString.split(',');
    const intArray = strArray.map(num => {
      const parsed = parseInt(num.trim(), 10);
      return isNaN(parsed) ? null : parsed;
    }).filter(num => num !== null);
    return intArray.length ? intArray : null;
  }

  interface Step {
    i: number;
    key: number;
    swappingWith: number;
    arr: number[];
    beforeSwap: number[];
    index: number;
  }

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setError("");
    const arr = toIntArray(numbers);
    if (!arr) {
      setError("Please enter a valid comma-separated list of numbers.");
      return;
    }

    const newSteps: Step[] = [];
    for (let i = 1; i < arr.length; i++) {
      const key = arr[i];
      let j = i - 1;
      const beforeSwap = [...arr];
      while (j >= 0 && arr[j] > key) {
        newSteps.push({ i, key, swappingWith: arr[j], arr: [...arr], beforeSwap: [...arr], index: j });
        arr[j + 1] = arr[j];
        j = j - 1;
      }
      arr[j + 1] = key;
      newSteps.push({ i, key, swappingWith: arr[j + 1], arr: [...arr], beforeSwap: [...beforeSwap], index: j + 1 });
    }
    newSteps.push({ i: arr.length, key: 0, swappingWith: Number.MIN_VALUE, arr: [...arr], beforeSwap: [...arr], index: 0 });
    setSteps(newSteps);
  };

  return (
    <div className='m-4 gap-4 justify-center items-center flex flex-col'>
      <div className="w-[80%]">
        <h1 className="text-2xl font-bold">Insertion Sort</h1>
        <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Insertion_sort'>Explanation</a></p>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger className="text-xl font-bold">Algorithm</AccordionTrigger>
            <AccordionContent className='font-mono w-full'>
              <CopyBlock text={codeSnippet} language="JavaScript" theme={dracula} codeBlock />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        <form className='flex flex-col gap-2'>
          <label>Array (comma separated):</label>
          <input type="text" className='border p-2 rounded-md' onChange={(e) => setNumbers(e.target.value)} />
          <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={handleSubmit}>Calculate</button>
          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">{error}</div>}
        </form>
        <div id="output">
          <table className='border-collapse font-mono my-4 border border-slate-400 w-full'>
            <thead>
              <tr>
                <th className="border border-slate-400">Iteration</th>
                <th className="border border-slate-400">Key</th>
                <th className="border border-slate-400">Swapping With</th>
                <th className="border border-slate-400">Before Swap</th>
                <th className="border border-slate-400">After Swap</th>
              </tr>
            </thead>
            <tbody>
              {steps.map((step, index) => (
                (step.key === step.swappingWith ? null :
                  step.swappingWith === Number.MIN_VALUE ?
                    <tr key={index}>
                      <td className='border border-slate-400'>-</td>
                      <td className='border border-slate-400'>-</td>
                      <td className='border border-slate-400'>-</td>
                      <td className='border border-slate-400'>
                        -
                      </td>
                      <td className='border border-slate-400'>
                        {step.arr.map((val, idx) => (
                          <span key={idx} className="bg-green-300 mx-1 px-1 rounded-sm">{val}</span>
                        ))}
                      </td>
                    </tr> :
                    <tr key={index}>
                      <td className="border border-slate-400">{step.i}</td>
                      <td className="border border-slate-400 font-bold">{step.key}</td>
                      <td className="border border-slate-400 font-bold">{step.swappingWith}</td>
                      <td className='border border-slate-400'>
                        {step.beforeSwap.map((val, idx) => (
                          <span key={idx} className={val === step.key || val === step.swappingWith ? "bg-yellow-300 font-bold underline mx-1 px-1 rounded-sm" : "bg-red-300 mx-1 px-1 rounded-sm"}>{val}</span>
                        ))}
                      </td>
                      <td className='border border-slate-400'>
                        {step.arr.map((val, idx) => (
                          <span key={idx} className={idx < step.i ? "bg-green-300 mx-1 px-1 rounded-sm" : "bg-red-300 mx-1 px-1 rounded-sm"}>{val}</span>
                        ))}
                      </td>
                    </tr>
                )))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default InsertionSortAlgorithm;

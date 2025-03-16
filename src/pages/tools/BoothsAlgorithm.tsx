/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useState } from 'react'

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"

const addBinary = (a: string, b: string) => {
    let sum = '';
    let carry = 0;
    for (let i = a.length - 1; i >= 0; i--) {
        const bitA = a[i];
        const bitB = b[i];
        const bitSum = parseInt(bitA) + parseInt(bitB) + carry;
        sum = (bitSum % 2) + sum;
        carry = Math.floor(bitSum / 2);
    }
    return sum;
}

const negate = (num: string) => {
    let neg = '';
    for (let i = 0; i < num.length; i++) {
        neg += num[i] === '0' ? '1' : '0';
    }
    return addBinary(neg, '0'.repeat(num.length - 1) + '1');
}

const BoothsAlgorithm = () => {
    const [result, setResult] = useState<any[]>([]);
    const [num1Bin, setNum1Bin] = useState<string>('');
    const [num2Bin, setNum2Bin] = useState<string>('');
    const [steps, setSteps] = useState<any[]>([]);
    
    const boothAlgorithm = async (num1: string, num2: string) => {
        // Hit endpoint /api/booths-algorithm?num1={num1}&num2={num2}
        // returns json object with steps
        // Example response:
        // {
        //     "result": 20,
        //     "steps": [
        //         ...
        //     ]
        // }
        const response = await fetch(`https://academix-backend-nlqg.onrender.com/api/booths-algorithm/?num1=${num1}&num2=${num2}`)
            .then(response => {
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
        return response.steps;
    }

    const handleSubmit  = async (e: React.FormEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const steps = await boothAlgorithm(num1Bin, num2Bin);
        setSteps(steps);
        setResult(steps.slice(0, 1));
    }
    const numToBin = (num: string) => {
        if (num.trim() === '' || num.trim() === '-') return '';
        num = num.trim();
        const numBin = parseInt(num, 10).toString(2);

        if (numBin.charAt(0) === '-' && numBin !== '-') {
            let pos = numBin.substring(1);
            if (pos.length < 8) {
                pos = '0'.repeat(8 - pos.length) + pos;
            }
            const comp = negate(pos);
            return comp;
        }
        if (numBin.length < 8) {
            return '0'.repeat(8 - numBin.length) + numBin;
        }
        return numBin;
    }
    const handleNum1Bin = (e: FormEvent<HTMLInputElement>) => {
        setNum1Bin(numToBin(e.currentTarget.value));
    }
    const handleNum2Bin = (e: FormEvent<HTMLInputElement>) => {
        setNum2Bin(numToBin(e.currentTarget.value));
    }
    const showNext = () => {
        setResult(steps.slice(0, result.length + 1));
    }
    const clearEverything = () => {
        setNum1Bin('');
        setNum2Bin('');
        setResult([]);
        setSteps([]);
    }
    const autoShowNext = () => {
        if (result.length === steps.length) {
            return;
        }
        let i = 0;
        const interval = setInterval(() => {
            if (i === steps.length) {
                clearInterval(interval);
                return;
            }
            setResult(steps.slice(0, i + 1));
            i++;
        }, 1000);
    }
    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className='w-[80%]'>
            <Accordion type="single" collapsible className="" defaultValue={'item-1'}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl font-bold">What is Booth's Algorithm?</AccordionTrigger>
                <AccordionContent className="prose text-lg w-full">
                    <p>In 1957 most people had never heard of computers; many of those who had believed the word referred to a calculating clerk, or perhaps a mechanical gadget to help you shoot down an aeroplane.</p>
                    <p>In the final year of my engineering degree at Oxford, I came across one of Andrew Booth&#39;s early books, `Electronic Digital Calculators&#39;. I was intrigued by his ideas and arranged to visit him at Birkbeck College, where I was taken on as a research student.</p>
                    <p>At this time Booth was head of the sub-department of Numerical Automation, a section of the Maths department of Birkbeck. The sub-department was housed in an old wartime emergency water tank, which you approached by rickety wooden steps leading down from the street behind the College.</p>
                    <p>The sub-department had a small population - Booth, his wife Kathleen who developed many early ideas on programming, a secretary, and a few research students working in such divers fields as linguistics, character recognition, crystallography and the behaviour of thin films. Booth himself had a country house at Fenny Compton, where he did much of his work. He tended to be in College only about three days a week.</p>
                    <p>The sub-department was equipped with two computers of Booth&#39;s own design and manufacture - the APE(X)C and the machine I made most use of, the MAC 1. Both machines shared the same architecture.</p>
                    <p>The MAC 1 was built into a frame about the shape and size of an upright piano. The base was full of heavy power supplies with large transformers. The `keyboard&#39; was a sloping panel with neon lamps to show the internal state of the machine and</p>
                    <p>a row of buttons for data input. The logic was built on to vertical panels, with the valves out of sight facing backward and the other components to the front so as to be immediately accessible.</p>
                        <p>The machine weighed about 400 lbs and used about 230 thermionic valves, mostly double triodes.</p>
                    <p>From the programmer&#39;s point of view the MAC 1 had a simplicity which is only beginning to be approached by the latest risc architectures. The cpu had two 32-bit registers, called the accumulator and the register.</p>
                    <p>The main memory was a rotating magnetic drum with 32 tracks. Each track held 32 words of 32 bits each. Ten bits were enough to address any word in the memory.</p>
                    <p>Input was through a five hole electromechanical paper tape reader of Booth&#39;s own design, and output was through a standard five hole 10 cps paper tape punch, as used in those days for ticker tape.</p>
                        <p>The machine used 32-bit instructions, and had a two-address order code. The instructions were arranged starting with the two addresses, followed by a function field, a counter field, and a vector bit.</p>
                    <p>The first address generally gave the data address, and the second indicated where the next instruction was coming from. Each address was five bits of track number and five of word number on the track.</p>
                    <p>The function field, containing four bits, could specify the following instructions: load to accumulator from memory; add memory to accumulator; subtract memory from accumulator; AND and OR operations; store accumulator to memory; multiply; rotate right using accumulator and register; input to accumulator from paper tape; output from accumulator to paper tape punch; conditional branch on top bit of accumulator; stop.</p>
                    <p>The machine was serial. Each revolution of the drum took 32 `major&#39; cycles, and inside each major cycle there were 32 minor cycles or bit pulses. A simple data operation such as a 32-bit addition took 32 minor cycles. However, the number of cycles actually used for any operation was controlled by the counter field, which specified a six-bit starting value. The operation would be halted as soon as the counter overflowed.</p>
                        <p>For most commands the `correct&#39; starting value for the counter was 32, but for shifts any value could be used sensibly.</p>
                            <p>The vector bit specified a vector operation, which meant that the command was repeated for the whole revolution of a drum, using each memory location in turn. This was chiefly useful for multiplication, where the command actually specified one stage of the Booth algorithm.</p>
                                <p>The complete multiplication was done by loading the multiplier into the register, writing the multiplicand into every location on a given track, and executing a `vector multiply&#39;. The operation would take exactly one drum revolution and leave a 64-bit product in the arithmetic unit.</p>
                    <p>As far as I am aware, the APE(X)C and MAC 1 machines were the first to incorporate the Booth multiplication algorithm, which gives correct results when multiplying twos complement signed numbers.</p>
                    <p>Much of Booth&#39;s early work was in crystallography, and involved a great deal of calculation with desk calculators. Multiplication was done by adding the multiplicand repeatedly for each digit of the multiplier, and shifting the partial product one place after each sequence of additions.</p>
                        <p>A well known trick in those days was to speed up multiplication by using subtraction as well as addition. For example, a string of nines in the multiplier could be handled by subtracting once, shifting along several times, and adding.</p>
                    <p>Booth formalised this observation and applied it to binary multiplication, where it led to a remarkably simple rule:</p>
                    <ul>
                    <li>Examine each pair of digits in the multiplier, creating the first pair by appending a dummy `0&#39; at the least significant end: then</li>
                    <li>if the pair is 01, add the multiplicand;</li>
                    <li>if the pair is 10, subtract the multiplicand;</li>
                    <li>otherwise, do nothing.</li>
                    <li>Shift both partial product and multiplier one place right, allowing the next pair of digits to be examined.</li>
                    <li>Repeat as many times as there are digits in the multiplier.</li>
                    </ul>
                </AccordionContent>
                </AccordionItem>
            </Accordion>
            <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#The_algorithm'>:Explanation</a></p>
            <p className='text-xl my-2 prose'><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#How_it_works">:How it works?</a></p>
            <p className='my-4 text-2xl font-bold border-b-2 border-b-indigo-400 w-full'>Calculator</p>
            <form className='flex flex-col gap-2 w-96'>
                Multiplicand: <input value={parseInt(num1Bin, 2).toString()} type='number' placeholder='Enter the multiplicand' onChange={handleNum1Bin} className='border p-2 rounded-md' />
                Multiplier: <input value={parseInt(num2Bin, 2).toString()} type='number' placeholder='Enter the multiplier' onChange={handleNum2Bin} className='border p-2 rounded-md' />
                <button type='submit' className='bg-blue-500 text-white p-2 rounded-md' onClick={handleSubmit}>Calculate</button>
            </form>
            <div className="my-2 flex gap-2">
                {result.length > 0 && (
                    <>
                        <button className='bg-blue-500 text-white p-2 rounded-md' onClick={() => clearEverything()}>Clear</button>
                        <button className='bg-green-500 text-white p-2 rounded-md' onClick={() => showNext()}>Next</button>
                        <button className='bg-red-500 text-white p-2 rounded-md' onClick={() => setResult(steps)}>Show All</button>
                        <button className='bg-yellow-500 text-white p-2 rounded-md' onClick={() => autoShowNext()}>Animate</button>
                    </>
                )}
            </div>
            <table className='border-collapse font-mono my-4 border border-slate-400 w-full'>
                <thead>
                    <tr>
                        <th className="px-2 border border-slate-400">Accumulator</th>
                        <th className="px-2 border border-slate-400">Multiplier</th>
                        <th className="px-2 border border-slate-400">Q<sub>-1</sub></th>
                        <th className='border border-slate-400'>Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {result.map((step: any, index: number) => (
                        <tr key={index}>
                            {step.operation === 'Shift Right' ? <td className="px-2 mx-2 border border-slate-400"><span className='bg-blue-200 underline'>{step.ac[0]}</span><span className='bg-yellow-200 underline'>{step.ac[1]}</span>{step.ac.substring(2)}</td> : <td className="px-2 mx-2 border border-slate-400">{step.ac}</td>}
                            {step.qr[step.qr.length - 1] === '1' && step.q_1 === '0' && step.operation === 'A = A + M' ? <td className="px-2 mx-2 border border-slate-400">{step.qr.substring(0, 7)}<span className="bg-green-200">{step.qr[7]}</span></td> : step.qr[step.qr.length - 1] === '0' && step.q_1 === '1' && step.operation === 'A = A - M' ? <td className="px-2 mx-2 border border-slate-400">{step.qr.substring(0, 7)}<span className="bg-green-200">{step.qr[7]}</span></td> : <td className="px-2 mx-2 border border-slate-400">{step.qr}</td>}
                            {step.qr[step.qr.length - 1] === '1' && step.q_1 === '0' && step.operation === 'A = A + M' ? <td className="px-2 mx-2 border border-slate-400 bg-green-200">{step.q_1}</td> : step.qr[step.qr.length - 1] === '0' && step.q_1 === '1' && step.operation === 'A = A - M' ? <td className="px-2 mx-2 border border-slate-400 bg-green-200">{step.q_1}</td> : <td className="px-2 mx-2 border border-slate-400">{step.q_1}</td>}
                            <td className="px-2 mx-2 border border-slate-400">{step.operation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            </div>
        </div>
    )
}

export default BoothsAlgorithm;
export { addBinary, negate };

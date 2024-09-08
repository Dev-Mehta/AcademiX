/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useState } from 'react'

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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const shiftRight = (ac: string, qr: string, q_1: string) => {
        // arithmetic shift right
        const shifted = ac[0] + ac + qr + q_1;
        return shifted;
    }

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
        const response = await fetch(`http://127.0.0.1:8000/api/booths-algorithm/?num1=${num1}&num2=${num2}`)
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
        <div className='m-4'>
            <p className='text-3xl my-4 font-extrabold'>Booth's Multiplication Algorithm</p>
            <p className='text-xl prose'><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">:What is Booth's Multiplication Algorithm</a></p>
            <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#The_algorithm'>:Explanation</a></p>
            <p className='text-xl my-2 prose'><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#How_it_works">:How it works?</a></p>
            <p className='my-4 text-2xl font-bold border-b-2 border-b-indigo-400 w-28'>Calculator</p>
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
            <table className='table-auto border-collapse font-mono my-4 border border-slate-400'>
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
    )
}

export default BoothsAlgorithm;
export { addBinary, negate };
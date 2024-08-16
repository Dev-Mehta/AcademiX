/* eslint-disable @typescript-eslint/no-explicit-any */
import { FormEvent, useEffect, useState } from 'react'

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
    return addBinary(neg, '0'.repeat(num.length-1) + '1');
}

const BoothsAlgorithm = () => {
    const [result, setResult] = useState<any[]>([]);
    const [num1Bin, setNum1Bin] = useState<string>('');
    const [num2Bin, setNum2Bin] = useState<string>('');
    
    const shiftRight = (ac: string, qr: string, q_1: string) => {
        // arithmetic shift right
        const shifted = ac[0] + ac + qr + q_1;
        return shifted;
    }

    const boothAlgorithm = (num1: string, num2: string) => {
        // use 5 bit for all operations
        // give steps in json to visualize
        const steps: any = [];
        let ac = '00000000';
        let qr = num1;
        let q_1 = '0';
        steps.push({ ac, qr, q_1, operation: 'Initial' });
        for (let i = 0; i < num1.length; i++) {
            const lastBit = qr[qr.length - 1];
            if (lastBit + q_1 === '01') {
                ac = addBinary(ac, num2);
                steps.push({ ac, qr, q_1, operation: 'A = A - M' });
            } else if (lastBit + q_1 === '10') {
                ac = addBinary(ac, negate(num2));
                steps.push({ ac, qr, q_1, operation: 'A = A + M' });
            }
            const whole = shiftRight(ac, qr, q_1);
            ac = whole.substring(0, 8);
            qr = whole.substring(8, 16);
            q_1 = whole[16];
            steps.push({ ac, qr, q_1, operation: 'Shift Right' });
        }  
        let bin = ac + qr;
        let negated = false;
        if(bin[0] === '1'){
            bin = negate(bin);
            negated = true;
        }
        console.log(bin);

        let num = parseInt(bin, 2);
        if(negated){
            num = -num;
        }
        steps.push({ ac, qr, q_1:num, operation: 'Result' });
        return steps;
    }

    useEffect(() => {
        if(num1Bin.trim() === '' || num2Bin.trim() === '') return;
        const r = boothAlgorithm(num1Bin, num2Bin);
        setResult(r);
    }, [num1Bin, num2Bin]);


    const numToBin = (num: string) => {
        if(num.trim() === '' || num.trim() === '-') return '';
        num = num.trim();
        const numBin = parseInt(num, 10).toString(2);
        
        if(numBin.charAt(0) === '-' && numBin !== '-') {
            let pos = numBin.substring(1);
            if(pos.length < 8){
                pos = '0'.repeat(8 - pos.length) + pos;
            }
            const comp =  negate(pos);
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
    return (
        <div className='m-4'>
            <p className='text-3xl my-4 font-extrabold'>Booth's Multiplication Algorithm</p>
            <p className='text-xl prose'><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">:What is Booth's Multiplication Algorithm</a></p>
            <p className='text-xl my-2 prose'><a  href='https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#The_algorithm'>:Explanation</a></p>
            <p className='text-xl my-2 prose'><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#How_it_works">:How it works?</a></p>
            <p className='my-4 text-2xl font-bold border-b-2 border-b-indigo-400 w-28'>Calculator</p>
            <form className='flex flex-col gap-2 w-96'>
                Multiplicand: <input type='number' placeholder='Enter the multiplicand' onChange={handleNum1Bin} className='border p-2 rounded-md' />
                Multiplier: <input type='number' placeholder='Enter the multiplier' onChange={handleNum2Bin} className='border p-2 rounded-md' />
            </form>
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
                            {step.qr[step.qr.length - 1] === '1' && step.q_1 === '0' && step.operation === 'A = A + M' ? <td className="px-2 mx-2 border border-slate-400">{step.qr.substring(0,7)}<span className="bg-green-200">{step.qr[7]}</span></td> : step.qr[step.qr.length - 1] === '0' && step.q_1 === '1' && step.operation === 'A = A - M' ? <td className="px-2 mx-2 border border-slate-400">{step.qr.substring(0,7)}<span className="bg-green-200">{step.qr[7]}</span></td> : <td className="px-2 mx-2 border border-slate-400">{step.qr}</td>}
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
export  { addBinary, negate };
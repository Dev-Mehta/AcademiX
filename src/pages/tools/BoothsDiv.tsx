/* eslint-disable @typescript-eslint/no-explicit-any */
import React from 'react';
import { FormEvent, useEffect, useState } from 'react';

const subtractBinary = (a: string, b: string) => {
    return addBinary(a, negate(b));
};

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
};

const negate = (num: string) => {
    let neg = '';
    for (let i = 0; i < num.length; i++) {
        neg += num[i] === '0' ? '1' : '0';
    }
    return addBinary(neg, '0'.repeat(num.length-1) + '1');
};

const BoothsDivisionAlgorithm = () => {
    const [result, setResult] = useState<any[]>([]);
    const [num1Bin, setNum1Bin] = useState<string>('');
    const [num2Bin, setNum2Bin] = useState<string>('');
    const [remainder,setRemainder] = useState<string>('');
    const [quotient, setQuotient] = useState<string>('');
    const [opr, setOpr] = useState<boolean>(false);
    
    const shiftLeft = (ac: string, qr: string) => {
        return ac.substring(1) + qr.charAt(0) 
    };

    const boothDivisionAlgorithm = (num1: string, num2: string) => {

        

        const steps: any = [];
        let ac = '0'.repeat(num1.length);
        let qr = num1;
        const negM = num2

        steps.push({num2 ,ac, qr, operation: 'Initial' });

        for (let i = 0; i < num1.length; i++) {
            ac = shiftLeft(ac, qr);
            qr = qr.substring(1) + '_';
            steps.push({num2 ,ac, qr, operation: 'shift left' });

            

            ac = subtractBinary(ac, negM);
            steps.push({ num2,ac, qr, operation: 'Subtracted M' });

            if (ac[0] === '1') {
                qr = qr.substring(0, qr.length - 1) + '0';
                ac = addBinary(ac, num2); // Restore ac
                steps.push({ num2,ac, qr, operation: 'Restored AC' });
            } else {
                qr = qr.substring(0, qr.length - 1) + '1';
                // steps.push({ num2,ac, qr, operation: 'Subtracted M' });
            }
        }

        setRemainder(ac)
        setQuotient(qr)
        setOpr(true)

        steps.push({ num2 , ac,qr , operation: 'Result' });
        return steps;
    };

    useEffect(() => {
        if(num1Bin.trim() === '' || num2Bin.trim() === '') return;
    //     let new_num2 ='0'.repeat(num1Bin.length-num2Bin.length)+num2Bin
    // setNum2Bin(new_num2)
    console.log(parseInt(parseInt(num1Bin, 2).toString(10)))
    
        const r = boothDivisionAlgorithm(num1Bin, num2Bin);
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
    };

    const handleNum1Bin = (e: FormEvent<HTMLInputElement>) => {
        setNum1Bin(numToBin(e.currentTarget.value));
    };
    const handleNum2Bin = (e: FormEvent<HTMLInputElement>) => {
        setNum2Bin(numToBin(e.currentTarget.value));
    };

    return (<>
        <div className='m-4'>
            <p className='text-3xl my-4 font-extrabold'>Booth's Division Algorithm</p>
            <p className='text-xl prose'><a href="https://en.wikipedia.org/wiki/Division_algorithm#Restoring_division">:What is Booth's Division Algorithm</a></p>
            <p className='my-4 text-2xl font-bold border-b-2 border-b-indigo-400 w-28'>Calculator</p>
            <form className='flex flex-col gap-2 w-96'>
                Dividend: <input type='number' placeholder='Enter the dividend' onChange={handleNum1Bin}  className='border p-2 rounded-md' />
                Divisor: <input type='number' placeholder='Enter the divisor' onChange={handleNum2Bin}  className='border p-2 rounded-md' />
            </form>
            <p>{num1Bin}</p>
            <p>{num2Bin}</p>
            <table className='table-auto border-collapse font-mono my-4 border border-slate-400'>
                <thead>
                    <tr>
                    <th className="px-2 border border-slate-400">Divisor</th>
                        <th className="px-2 border border-slate-400">Accumulator</th>
                        <th className="px-2 border border-slate-400">Quotient</th>
                        <th className="px-2 border border-slate-400">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {result?.map((step: any, index: number) => (
                        <tr key={index}>
                            <td className="px-2 mx-2 border border-slate-400">{step.num2}</td>
                            <td className="px-2 mx-2 border border-slate-400">{step.ac}</td>
                            <td className="px-2 mx-2 border border-slate-400">{step.qr}</td>
                            <td className="px-2 mx-2 border border-slate-400">{step.operation}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {opr && (
    <>
        <p>The remainder is: {remainder} which is: {parseInt(remainder, 2).toString(10)}</p>
        <p>The quotient is: {quotient} which is: {parseInt(quotient, 2).toString(10)}</p>
    </>
)}
 
        </div>
        </>
    );
};

export default BoothsDivisionAlgorithm;
export { addBinary, negate };

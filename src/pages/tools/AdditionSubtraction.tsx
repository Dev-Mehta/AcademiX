import React, { useEffect, useState } from 'react';
import { negate } from './BoothsAlgorithm';

const AdditionSubtraction = () => {
    const [number1, setNumber1] = useState(0);
    const [number2, setNumber2] = useState(0);

    const [element1, setElement1] = useState<JSX.Element | null>(null);
    const [binary1, setBinary1] = useState('');
    const [binary2, setBinary2] = useState('');

    const [element2, setElement2] = useState<JSX.Element | null>(null);
    const [carries, setCarries] = useState<number[]>([]);

    const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(e.target.value);

        if (number < -128 || number > 127) {
            return;
        }
        setNumber1(number);
    }

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        const number = parseInt(e.target.value);

        if (number < -128 || number > 127) {
            return;
        }
        setNumber2(number);
    }
    useEffect(() => {
        let bin = number1.toString(2);
        if (number1 < 0) {
            bin = bin.substring(1);
            if (bin.length < 8) {
                bin = '0'.repeat(8 - bin.length) + bin;
            }
            bin = negate(bin);
        }
        else {
            bin = bin.padStart(8, '0');
        }
        let html = `<div class='flex'>`;
        for (let i = 0; i < bin.length; i++) {
            if (bin[i] === '1') {
                html += `<div style='margin: 1px' class='w-4 h-4 bg-green-500 rounded-full'></div>`
            }
            else {
                html += `<div style='margin: 1px' class='w-4 h-4 bg-gray-400 rounded-full'></div>`
            }
        }
        html += `</div>`;
        setBinary1(bin);
        setElement1(<div dangerouslySetInnerHTML={{ __html: html }}></div>);
    }, [number1]);

    useEffect(() => {
        let bin = number2.toString(2);
        if (number2 < 0) {
            bin = bin.substring(1);
            if (bin.length < 8) {
                bin = '0'.repeat(8 - bin.length) + bin;
            }
            bin = negate(bin);
        }
        else {
            bin = bin.padStart(8, '0');
        }
        let html = `<div class='flex'>`;
        for (let i = 0; i < bin.length; i++) {
            if (bin[i] === '1') {
                html += `<div style='margin: 1px' class='w-4 h-4 bg-green-500 rounded-full'></div>`
            }
            else {
                html += `<div style='margin: 1px' class='w-4 h-4 bg-gray-400 rounded-full'></div>`
            }
        }
        html += `</div>`;
        setBinary2(bin);
        setElement2(<div dangerouslySetInnerHTML={{ __html: html }}></div>);
    }, [number2]);

    useEffect(() => {
        // set the carries
        const carries: number[] = [];
        for (let i = 0; i < 8; i++) {
            carries.push(0);
        }
        let carry = 0;
        for (let i = 7; i >= 0; i--) {
            const a = parseInt(binary1[i]);
            const b = parseInt(binary2[i]);
            let sum = a + b + carry;
            if (sum > 1) {
                carry = 1;
                sum = sum % 2;
            }
            else {
                carry = 0;
            }
            carries[i - 1] = carry;
        }
        setCarries([...carries]);
    }, [binary1, binary2]);


    return (
        <>
            <div className="flex flex-col sm:flex-row gap-2">
                <div className='m-2'>
                    <input type="number" onChange={handleChange1} placeholder='Enter number: ' className='border border-gray-400 rounded-md mt-2 p-2' />
                    <div className='mt-2'>
                        <p>{element1}</p>
                        <p>Decimal: {number1}</p>
                        <p>Binary: {binary1}</p>
                    </div>
                </div>
                <div className="m-2">
                    <input type="number" onChange={handleChange2} placeholder='Enter number: ' className='border border-gray-400 rounded-md mt-2 p-2' />
                    <div className='mt-2'>
                        <p>{element2}</p>
                        <p>Decimal: {number2}</p>
                        <p>Binary: {binary2}</p>
                    </div>
                </div>
            </div>

            <div className='m-4'>
                <h1>Result</h1>
                <p>Decimal: {number1 + number2}</p>
                <p>Binary: {parseInt(binary1, 2) + parseInt(binary2, 2)}</p>
                <table className='font-mono'>
                    <tbody>
                        <tr>
                            <td><span className="mr-4">Carries</span></td>
                            {carries.map((bit) => (
                                <td><span className="m-1">{bit}</span></td>
                            ))}
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr>
                            <td>Num 1</td>
                            {binary1.split('').map((bit) => (
                                <td><span className="m-1">{bit}</span></td>
                            ))}
                        </tr>
                        <tr className="">
                            <td>Num 2</td>
                            {binary2.split('').map((bit) => (
                                <td><span className="m-1">{bit}</span></td>
                            ))}
                        </tr>
                        <tr>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                            <td>-</td>
                        </tr>
                        <tr className="">
                            <td>Result</td>
                            {parseInt((number1 + number2).toString()).toString(2).padStart(8, '0').split('').map((bit) => (
                                <td><span className="m-1">{bit}</span></td>
                            ))}
                        </tr>
                    </tbody>
                </table>
            </div>
        </>
    );
};


export default AdditionSubtraction;
import { useState } from "react";

const NumberConversion = () => {
    const [number, setNumber] = useState('');
    const [binary, setBinary] = useState('');
    const [octal, setOctal] = useState('');
    const [hexadecimal, setHexadecimal] = useState('');

    const handleNumberChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.trim() === '') return;
        setNumber(value);
        setBinary(Number(value).toString(2));
        setOctal(Number(value).toString(8));
        setHexadecimal(Number(value).toString(16));
    };

    const handleBinaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.trim() === '') return;
        setBinary(value);
        setNumber(parseInt(value, 2).toString());
        setOctal(parseInt(value, 2).toString(8));
        setHexadecimal(parseInt(value, 2).toString(16));
    };

    const handleOctalNumber = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.trim() === '') return;
        setOctal(value);
        setNumber(parseInt(value, 8).toString());
        setBinary(parseInt(value, 8).toString(2));
        setHexadecimal(parseInt(value, 8).toString(16));
    }

    const handleHexadecimalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        if(value.trim() === '') return;
        setHexadecimal(value);
        setNumber(parseInt(value, 16).toString());
        setBinary(parseInt(value, 16).toString(2));
        setOctal(parseInt(value, 16).toString(8));
    }

    return (
        <div className="m-4">
            <h1 className="text-3xl font-bold">Number Conversion</h1>
            <div className="font-mono">
                <p className="my-2">
                    <label>Dec:&nbsp;</label>
                    <input type="number" value={number} onChange={handleNumberChange} className="border border-gray-300 p-2 rounded-lg w-1/4" />
                </p>
                <p className="my-2">
                    <label>Bin:&nbsp;</label>
                    <input type="number" value={binary} onChange={handleBinaryChange} className="border border-gray-300 p-2 rounded-lg w-1/4" />
                </p>
                <p className="my-2">
                    <label>Oct:&nbsp;</label>
                    <input type="number" value={octal} className="border border-gray-300 p-2 rounded-lg w-1/4" onChange={handleOctalNumber} />
                </p>
                <p>
                    <label>Hex: </label>
                    <input type="text" value={hexadecimal.toUpperCase()} className="border border-gray-300 p-2 rounded-lg w-1/4" onChange={handleHexadecimalChange} />
                </p>
            </div>
        </div>
    );
}

export default NumberConversion;
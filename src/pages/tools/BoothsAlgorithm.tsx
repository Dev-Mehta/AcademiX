/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState, FormEvent } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export const addBinary = (a: string, b: string) => {
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

export const negate = (num: string) => {
    let neg = '';
    for (let i = 0; i < num.length; i++) {
        neg += num[i] === '0' ? '1' : '0';
    }
    return addBinary(neg, '0'.repeat(num.length - 1) + '1');
}

interface BoothStep {
    ac: string;
    qr: string; // Multiplier/Quotient Register?
    q_1: string; // Q-1
    operation: string;
    comment?: string;
}

const BoothsAlgorithm = () => {
    const [result, setResult] = useState<BoothStep[]>([]);
    const [num1Bin, setNum1Bin] = useState<string>('');
    const [num2Bin, setNum2Bin] = useState<string>('');
    const [steps, setSteps] = useState<BoothStep[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const boothAlgorithm = async (num1: string, num2: string) => {
        try {
            setLoading(true);
            const response = await fetch(`${import.meta.env.VITE_API_URL}/booths-algorithm/?num1=${num1}&num2=${num2}`);
            if (!response.ok) throw new Error("API Request failed");
            const data = await response.json();
            return data.steps;
        } catch (error) {
            console.error('Error:', error);
            setError("Failed to fetch steps from backend.");
            return [];
        } finally {
            setLoading(false);
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        let n1 = num1Bin;
        let n2 = num2Bin;

        // Ensure valid inputs
        if (!n1) n1 = "00000000";
        if (!n2) n2 = "00000000";

        const stepsData = await boothAlgorithm(n1, n2);
        setSteps(stepsData);
        setResult(stepsData.length > 0 ? [stepsData[0]] : []); // Show first step initially
    }

    const numToBin = (num: string) => {
        if (num.trim() === '' || num.trim() === '-') return '';
        const parsed = parseInt(num.trim(), 10);
        if (isNaN(parsed)) return '';

        let numBin = Math.abs(parsed).toString(2);

        // Pad to at least 8 bits or appropriate length
        // Logic from original file:
        if (parsed < 0) {
            if (numBin.length < 8) {
                numBin = '0'.repeat(8 - numBin.length) + numBin;
            }
            return negate(numBin);
        } else {
            if (numBin.length < 8) {
                return '0'.repeat(8 - numBin.length) + numBin;
            }
            return numBin;
        }
    }

    const handleNum1Change = (e: FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        // Store as binary for internal logic, but input works with decimal
        const bin = numToBin(val);
        setNum1Bin(bin);
    }

    const handleNum2Change = (e: FormEvent<HTMLInputElement>) => {
        const val = e.currentTarget.value;
        const bin = numToBin(val);
        setNum2Bin(bin);
    }

    // Display values need to be converted back from binary for the input field?
    // Original code: input value={parseInt(num1Bin, 2).toString()}
    // This is tricky if num1Bin is partial or invalid. 
    // Let's deduce decimal from binary for display, assuming 2's complement if handling negative.
    const binToDecInfo = (bin: string) => {
        if (!bin) return "";
        // If we assumed 8-bit signed...
        // For now let's just use what was there but handle empty/NaN
        if (bin.length === 0) return "";
        // Converting 2's complement back to dec is hard with simple parseInt if negative.
        // But original code used parseInt(num1Bin, 2). This interprets as unsigned.
        // Example: 11111111 -> 255. But could be -1.
        // Let's assume user inputs DECIMAL, we convert to BINARY.
        // We should store DECIMAL state for input fields and BINARY for logic?
        // Original code stored BINARY in state `num1Bin`.
        return parseInt(bin, 2).toString();
    };

    // Better approach: separate state for inputs (decimal strings) and logic (binary strings).
    // But to minimize rewrite risk, I will trust the original logic's intent but maybe 
    // allow typing in the box better.
    // Actually, checking `handleNum1Bin` in original:
    // It takes `e.currentTarget.value` (decimal string), converts to binary, sets `num1Bin`.
    // Input value is `parseInt(num1Bin, 2).toString()`.
    // This effectively makes the input "controlled" via binary conversion.
    // If I type "5", `numToBin` -> "00000101". `parseInt` -> "5". Input shows "5".
    // If I type "-5", `numToBin` -> "11111011". `parseInt` -> "251". Input shows "251".
    // THIS IS CONFUSING for the user. Typing -5 changes it to 251 instantly?
    // I should probably fix this UX.
    // I will introduce local state for decimal inputs.

    const [dec1, setDec1] = useState("");
    const [dec2, setDec2] = useState("");

    const handleDec1Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDec1(val);
        setNum1Bin(numToBin(val));
    };

    const handleDec2Change = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setDec2(val);
        setNum2Bin(numToBin(val));
    };

    const showNext = () => {
        if (result.length < steps.length) {
            setResult(steps.slice(0, result.length + 1));
        }
    }

    const showAll = () => {
        setResult(steps);
    }

    const clearEverything = () => {
        setDec1("");
        setDec2("");
        setNum1Bin("");
        setNum2Bin("");
        setResult([]);
        setSteps([]);
    }

    const autoShowNext = () => {
        if (result.length === steps.length) return;
        let i = result.length;
        const interval = setInterval(() => {
            if (i >= steps.length) {
                clearInterval(interval);
                return;
            }
            // Need functional update or ref because closure captures stale state if not careful?
            // Actually simpler to just rely on re-renders if using generic loop
            // But setInterval in React useEffect is safer.
            // Let's just do a simple loop with delay for now or basic interval
            setResult(prev => {
                if (prev.length < steps.length) {
                    return steps.slice(0, prev.length + 1);
                }
                clearInterval(interval);
                return prev;
            });
            i++;
        }, 500);
    }

    const explanation = `Booth's multiplication algorithm is a multiplication algorithm that multiplies two signed binary numbers in two's complement notation.`;

    return (
        <AlgorithmPageLayout
            title="Booth's Algorithm"
            description="Multiplication algorithm for signed binary numbers in two's complement notation."
            resources={[
                { 
                    label: "What is Booth's Algorithm", url: "https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#The_algorithm"
                 },
                 { 
                    label: "How it works", url: "https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm#How_it_works"
                 },
            ]}
            controls={
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Multiplicand (Decimal)</label>
                        <Input
                            type="number"
                            placeholder="Enter multiplicand (e.g. 5)"
                            value={dec1}
                            onChange={handleDec1Change}
                        />
                        <p className="text-xs text-muted-foreground">Binary: {num1Bin}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Multiplier (Decimal)</label>
                        <Input
                            type="number"
                            placeholder="Enter multiplier (e.g. -3)"
                            value={dec2}
                            onChange={handleDec2Change}
                        />
                        <p className="text-xs text-muted-foreground">Binary: {num2Bin}</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex gap-2">
                        <Button type="submit" disabled={loading} className="flex-1">
                            {loading ? "Calculating..." : "Calculate"}
                        </Button>
                        {steps.length > 0 && (
                            <Button type="button" variant="outline" onClick={clearEverything}>Clear</Button>
                        )}
                    </div>
                </form>
            }
        >
            <div className="space-y-4">
                {steps.length > 0 && (
                    <div className="flex flex-wrap gap-2 justify-center mb-4">
                        <Button size="sm" onClick={showNext} disabled={result.length === steps.length}>Next Step</Button>
                        <Button size="sm" variant="secondary" onClick={autoShowNext} disabled={result.length === steps.length}>Animate</Button>
                        <Button size="sm" variant="secondary" onClick={showAll} disabled={result.length === steps.length}>Show All</Button>
                    </div>
                )}

                {result.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="w-full border-collapse text-sm text-center">
                            <thead>
                                <tr className="bg-muted text-left">
                                    <th className="p-3 font-medium border-b">AC</th>
                                    <th className="p-3 font-medium border-b">QR</th>
                                    <th className="p-3 font-medium border-b">Q<sub>-1</sub></th>
                                    <th className="p-3 font-medium border-b">Operation</th>
                                </tr>
                            </thead>
                            <tbody>
                                {result.map((step, index) => {
                                    // Highlighting logic from original
                                    const isShift = step.operation === 'Shift Right';
                                    const highlightQR = (step.qr.endsWith('1') && step.q_1 === '0' && step.operation === 'A = A + M') ||
                                        (step.qr.endsWith('0') && step.q_1 === '1' && step.operation === 'A = A - M');

                                    return (
                                        <tr key={index} className="border-b transition-colors hover:bg-muted/50 font-mono">
                                            <td className="p-2 border-r">
                                                {isShift ? (
                                                    <span>
                                                        <span className="bg-blue-200">{step.ac[0]}</span>
                                                        <span className="bg-yellow-200">{step.ac[1] || ''}</span>
                                                        {step.ac.substring(2)}
                                                    </span>
                                                ) : step.ac}
                                            </td>
                                            <td className="p-2 border-r">
                                                {highlightQR ? (
                                                    <span>
                                                        {step.qr.substring(0, step.qr.length - 1)}
                                                        <span className="bg-green-200 font-bold">{step.qr[step.qr.length - 1]}</span>
                                                    </span>
                                                ) : step.qr}
                                            </td>
                                            <td className={`p-2 border-r ${highlightQR ? "bg-green-200 font-bold" : ""}`}>
                                                {step.q_1}
                                            </td>
                                            <td className="p-2 text-left">
                                                {step.operation}
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p>{loading ? "Waiting for server..." : "Enter numbers and click 'Calculate' to see the visualization."}</p>
                    </div>
                )}
            </div>
        </AlgorithmPageLayout>
    );
}

export default BoothsAlgorithm;

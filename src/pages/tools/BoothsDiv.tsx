/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { FormEvent, useEffect, useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { addBinary, negate } from './BoothsAlgorithm';

const subtractBinary = (a: string, b: string) => {
    return addBinary(a, negate(b));
};

interface DivStep {
    divisor: string;
    ac: string;
    qr: string;
    operation: string;
    description?: string;
}

const BoothsDivisionAlgorithm = () => {
    const [result, setResult] = useState<DivStep[]>([]);

    // Inputs (Decimal Strings)
    const [dividendDec, setDividendDec] = useState("");
    const [divisorDec, setDivisorDec] = useState("");

    // Logic (Binary Strings)
    const [num1Bin, setNum1Bin] = useState<string>(''); // Dividend
    const [num2Bin, setNum2Bin] = useState<string>(''); // Divisor

    // Results
    const [remainder, setRemainder] = useState<string>('');
    const [quotient, setQuotient] = useState<string>('');
    const [isCalculated, setIsCalculated] = useState<boolean>(false);
    const [steps, setSteps] = useState<DivStep[]>([]);
    const [error, setError] = useState("");

    const shiftLeft = (ac: string, qr: string) => {
        // Shift AC and QR left as a combined unit.
        // AC gets shifted left, LSB comes from MSB of QR.
        // QR gets shifted left.
        const combined = ac + qr;
        const shifted = combined.substring(1) + '_'; // Placeholder
        // Split back
        // But original logic was: ac = ac.substring(1) + qr.charAt(0);
        return ac.substring(1) + qr.charAt(0);
    };

    const performDivision = (dividendBin: string, divisorBin: string) => {
        const stepsLog: DivStep[] = [];

        // Ensure lengths match typically or standardized to N bits.
        // Original code: ac = '0'.repeat(num1.length).
        // Let's stick to 8 bit logic or length of input.
        // If inputs are 8-bit, we proceed.

        const n = dividendBin.length;
        let ac = '0'.repeat(n);
        let qr = dividendBin;
        const m = divisorBin;
        const negM = negate(m); // Two's complement of divisor for subtraction

        stepsLog.push({ divisor: m, ac, qr, operation: 'Initialize' });

        for (let i = 0; i < n; i++) {
            // 1. Shift Left
            ac = ac.substring(1) + qr.charAt(0);
            qr = qr.substring(1) + '_'; // Temporary LSB

            stepsLog.push({ divisor: m, ac, qr, operation: 'Shift Left', description: 'Shift AC and QR left' });

            // 2. Subtract M (Add -M)
            const acAfterSub = addBinary(ac, negM);

            // Check sign of AC (MSB)
            // Original logic used subtractBinary direct.
            // Let's use the helper.

            // Note: addBinary/negate logic assumes fixed width usually? 
            // If result overflows, we might need trimming.
            // addBinary returns string of same length?
            // Let's verify addBinary behavior from BoothsAlgorithm.
            // It loops a.length-1 to 0. It preserves length.

            let tempAc = acAfterSub;

            // Check if negative. logic: MSB is 1.
            if (tempAc[0] === '1') {
                // Negative
                // Restore logic: AC = AC + M
                stepsLog.push({ divisor: m, ac: tempAc, qr, operation: 'Subtract M', description: `AC = AC - M (${ac} - ${m})` });

                // RESTORE (Original logic says "Restored AC" if ac[0] === '1')
                // Original logic: "qr = qr... + '0'"
                // "ac = addBinary(ac, num2)" (Restoring)

                // Wait, original logic lines 56-62:
                // ac = subtractBinary(ac, negM); -> This line effectively does AC = AC - (-M)? Or AC - M?
                // `const subtractBinary = (a, b) => addBinary(a, negate(b))`
                // So subtractBinary(ac, negM) -> add(ac, negate(negate(M))) -> add(ac, M). 
                // That seems wrong if `negM` implies `-M`.
                // If `m` is divisor, `negM` is `-Divisor`.
                // We want AC - Divisor. So AC + (-Divisor).
                // So AC + negM.
                // The original code `subtractBinary(ac, negM)` means `ac - negM`. `ac - (-Divisor)` = `ac + Divisor`.
                // This seems contradictory to standard restoring division which subtracts first.
                // Let's assume standard restoring division:
                // Step 1: Shift.
                // Step 2: Subtract M from AC. (AC = AC - M).
                // Step 3: Check AC. If < 0, Restore (AC = AC + M), set q0 = 0. Else set q0 = 1.

                // My fix:
                // Calculate `subResult = addBinary(ac, negate(m))`.

                const subResult = addBinary(ac, negate(m));
                stepsLog.push({ divisor: m, ac: subResult, qr, operation: 'Subtract M', description: 'AC <- AC - M' });

                if (subResult[0] === '1') {
                    // Result is negative.
                    // Set q0 = 0.
                    qr = qr.substring(0, qr.length - 1) + '0';
                    // Restore: AC = AC + M.
                    // subResult + m
                    ac = addBinary(subResult, m);
                    stepsLog.push({ divisor: m, ac, qr, operation: 'Restore', description: 'AC < 0, so restore AC and set q0 = 0' });
                } else {
                    // Result is positive.
                    // Set q0 = 1.
                    // No restore needed. AC = subResult.
                    ac = subResult;
                    qr = qr.substring(0, qr.length - 1) + '1';
                    stepsLog.push({ divisor: m, ac, qr, operation: 'Set q0 = 1', description: 'AC >= 0, so keep AC and set q0 = 1' });
                }

            } else {
                // The logic in original file was a bit confused on variables.
                // Let's implement correct Restoring Division logic as derived above.
                // The loop continues.
            }
        }

        setRemainder(ac);
        setQuotient(qr);
        setIsCalculated(true);
        stepsLog.push({ divisor: m, ac, qr, operation: 'Result', description: `Quotient: ${qr}, Remainder: ${ac}` });

        return stepsLog;
    };

    const numToBin = (numStr: string) => {
        if (!numStr) return "";
        const num = parseInt(numStr, 10);
        if (isNaN(num)) return "";

        // Handle negative input? Booth division typically unsigned or 2's comp?
        // Restoring division is typically for unsigned integers.
        // If inputs are signed, it's more complex.
        // Let's assume Unsigned for simple restoring division or convert to absolute.
        // The original logic `num.trim() === '-'` implies signed support attempt but looks messy.
        // I will stick to 8-bit unsigned for simplicity and robustness.

        let bin = Math.abs(num).toString(2);
        bin = bin.padStart(8, '0');
        return bin;
    };

    // Calculate whenever inputs change AND are valid
    const handleCalculate = (e: FormEvent) => {
        e.preventDefault();
        setError("");

        if (!dividendDec || !divisorDec) {
            setError("Please enter both numbers");
            return;
        }

        const bin1 = numToBin(dividendDec);
        const bin2 = numToBin(divisorDec);

        if (parseInt(divisorDec) === 0) {
            setError("Division by zero");
            return;
        }

        setNum1Bin(bin1);
        setNum2Bin(bin2);

        const resSteps = performDivision(bin1, bin2);
        setSteps(resSteps);
        setResult([resSteps[0]]);
        setIsCalculated(true);
    };

    const showNext = () => {
        if (result.length < steps.length) {
            setResult(steps.slice(0, result.length + 1));
        }
    }

    const showAll = () => {
        setResult(steps);
    }

    const clearAll = () => {
        setDividendDec("");
        setDivisorDec("");
        setNum1Bin("");
        setNum2Bin("");
        setSteps([]);
        setResult([]);
        setIsCalculated(false);
    }

    const codeSnippet = `function restoringDivision(Q, M) {
    let A = 0;
    let n = Q.length; // Number of bits
    
    for (let i = 0; i < n; i++) {
        // Left Shift A, Q
        A = (A << 1) | ((Q >> (n - 1)) & 1);
        Q = Q << 1;
        
        // Subtract M
        A = A - M;
        
        if (A < 0) {
            // A < 0, Restore A
            A = A + M;
            // Q[0] = 0 (Already 0 from shift)
        } else {
            // A >= 0, Set Q[0] = 1
            Q = Q | 1;
        }
    }
    return { Quotient: Q, Remainder: A };
}`;

    return (
        <AlgorithmPageLayout
            title="Restoring Division Algorithm"
            description="A division algorithm for binary result. It operates on unsigned integers."
            resources={[
                { label: "Wikipedia: Division Algorithm", url: "https://en.wikipedia.org/wiki/Division_algorithm#Restoring_division" }
            ]}
            codeSnippet={codeSnippet}
            controls={
                <form onSubmit={handleCalculate} className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Dividend (Decimal)</label>
                        <Input
                            type="number"
                            min="0"
                            placeholder="e.g. 10"
                            value={dividendDec}
                            onChange={(e) => setDividendDec(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Binary: {numToBin(dividendDec)}</p>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Divisor (Decimal)</label>
                        <Input
                            type="number"
                            min="1"
                            placeholder="e.g. 3"
                            value={divisorDec}
                            onChange={(e) => setDivisorDec(e.target.value)}
                        />
                        <p className="text-xs text-muted-foreground">Binary: {numToBin(divisorDec)}</p>
                    </div>

                    {error && <p className="text-sm text-destructive">{error}</p>}

                    <div className="flex gap-2">
                        <Button type="submit" className="flex-1">Calculate</Button>
                        {isCalculated && <Button type="button" variant="outline" onClick={clearAll}>Clear</Button>}
                    </div>
                </form>
            }
        >
            <div className="space-y-4">
                {isCalculated && (
                    <div className="flex gap-2 justify-center mb-4">
                        <Button size="sm" onClick={showNext} disabled={result.length === steps.length}>Next Step</Button>
                        <Button size="sm" variant="secondary" onClick={showAll} disabled={result.length === steps.length}>Show All</Button>
                    </div>
                )}

                {result.length > 0 ? (
                    <div className="space-y-4">
                        {isCalculated && result.length === steps.length && (
                            <div className="p-4 bg-green-50 border rounded-lg flex justify-around">
                                <div>
                                    <span className="font-bold text-green-900">Quotient (Q): </span>
                                    <span className="font-mono">{parseInt(quotient, 2)} ({quotient})</span>
                                </div>
                                <div>
                                    <span className="font-bold text-green-900">Remainder (A): </span>
                                    <span className="font-mono">{parseInt(remainder, 2)} ({remainder})</span>
                                </div>
                            </div>
                        )}

                        <div className="overflow-x-auto">
                            <table className="w-full border-collapse text-sm text-center">
                                <thead>
                                    <tr className="bg-muted text-left">
                                        <th className="p-3 font-medium border-b">Operation</th>
                                        <th className="p-3 font-medium border-b">Accumulator (A)</th>
                                        <th className="p-3 font-medium border-b">Quotient (Q)</th>
                                        <th className="p-3 font-medium border-b">Description</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.map((step, index) => (
                                        <tr key={index} className="border-b transition-colors hover:bg-muted/50 font-mono">
                                            <td className="p-2 border-r text-left whitespace-nowrap">{step.operation}</td>
                                            <td className="p-2 border-r">{step.ac}</td>
                                            <td className="p-2 border-r">{step.qr}</td>
                                            <td className="p-2 text-left text-xs text-muted-foreground">{step.description}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                        <p>Enter numbers sets to divide.</p>
                    </div>
                )}
            </div>
        </AlgorithmPageLayout>
    );
};

export default BoothsDivisionAlgorithm;

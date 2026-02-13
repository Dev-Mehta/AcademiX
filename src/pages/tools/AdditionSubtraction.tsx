import React, { useEffect, useState } from 'react';
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { negate } from './BoothsAlgorithm';

const AdditionSubtraction = () => {
    const [number1, setNumber1] = useState<number>(0);
    const [number2, setNumber2] = useState<number>(0);

    const [binary1, setBinary1] = useState('');
    const [binary2, setBinary2] = useState('');
    const [carries, setCarries] = useState<number[]>([]);
    const [resultBinary, setResultBinary] = useState('');

    // We will stick to 8-bit for simplicity as per original, or maybe let it scale?
    // Original code was strictly 8-bit. Let's keep it 8-bit to be safe visually.

    const toBinary8Bit = (num: number) => {
        let bin = Math.abs(num).toString(2);
        if (num < 0) {
            // pad first
            if (bin.length < 8) {
                bin = '0'.repeat(8 - bin.length) + bin;
            }
            // then negate
            bin = negate(bin);
        } else {
            bin = bin.padStart(8, '0');
        }
        // Ensure strictly 8 chars matching original logic's expected length?
        // negate function returns string length.

        // If the number is too big for 8 bits, this logic might break. 
        // Original code clamped input -128 to 127. I will do the same.
        return bin.slice(-8); // Keep last 8 bits if it overflows?
    };

    const handleChange1 = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < -128) val = -128;
        if (val > 127) val = 127;
        setNumber1(val);
    }

    const handleChange2 = (e: React.ChangeEvent<HTMLInputElement>) => {
        let val = parseInt(e.target.value);
        if (isNaN(val)) val = 0;
        if (val < -128) val = -128;
        if (val > 127) val = 127;
        setNumber2(val);
    }

    useEffect(() => {
        const bin1 = toBinary8Bit(number1);
        const bin2 = toBinary8Bit(number2);
        setBinary1(bin1);
        setBinary2(bin2);

        // Calculate carries and result
        const c: number[] = new Array(8).fill(0);
        let carry = 0;
        let resBin = "";

        // Loop from LSB (index 7) to MSB (index 0)
        for (let i = 7; i >= 0; i--) {
            const a = parseInt(bin1[i]);
            const b = parseInt(bin2[i]);
            let sum = a + b + carry;

            if (sum >= 2) {
                resBin = (sum % 2) + resBin;
                carry = 1;
            } else {
                resBin = sum + resBin;
                carry = 0;
            }

            // Store carry for the NEXT position (to the left)
            // carries[i] should probably represent the carry INTO position i? 
            // Or carry generated AT position i?
            // Original code: carries[i-1] = carry. So carry generated at i is shown above i-1.
            // That makes sense for visual addition.
            if (i > 0) {
                c[i - 1] = carry;
            }
        }
        setCarries(c);
        setResultBinary(resBin);

    }, [number1, number2]);

    const BitRow = ({ label, bits, className = "" }: { label: string, bits: string | number[], className?: string }) => (
        <div className={`flex items-center gap-2 font-mono ${className}`}>
            <span className="w-16 text-right font-bold text-sm text-muted-foreground">{label}</span>
            <div className="flex gap-1">
                {(typeof bits === 'string' ? bits.split('') : bits).map((bit, idx) => (
                    <div key={idx} className={`w-8 h-8 flex items-center justify-center border rounded ${label === "Carries" && bit === 0 ? "invisible" : ""} ${label === "Carries" ? "text-red-500 font-bold border-red-200 bg-red-50" : "bg-white"}`}>
                        {bit}
                    </div>
                ))}
            </div>
        </div>
    );

    // Visualization of bits with circles as previously done
    const BitCircles = ({ bin }: { bin: string }) => (
        <div className="flex gap-1 h-4">
            {bin.split('').map((b, i) => (
                <div key={i} className={`w-3 h-3 rounded-full ${b === '1' ? 'bg-green-500' : 'bg-gray-200'}`} />
            ))}
        </div>
    );

    return (
        <AlgorithmPageLayout
            title="Binary Addition"
            description="Visualizes binary addition of two 8-bit signed integers (Two's Complement)."
            resources={[
                { label: "Two's Complement", url: "https://en.wikipedia.org/wiki/Two%27s_complement" },
                { label: "Binary Arithmetic", url: "https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic" }
            ]}
            controls={
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Number 1 (-128 to 127)</label>
                        <Input
                            type="number"
                            value={number1}
                            onChange={handleChange1}
                            min={-128}
                            max={127}
                            className="text-lg"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Binary: {binary1}</span>
                            <BitCircles bin={binary1} />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Number 2 (-128 to 127)</label>
                        <Input
                            type="number"
                            value={number2}
                            onChange={handleChange2}
                            min={-128}
                            max={127}
                            className="text-lg"
                        />
                        <div className="flex justify-between items-center text-xs text-muted-foreground">
                            <span>Binary: {binary2}</span>
                            <BitCircles bin={binary2} />
                        </div>
                    </div>
                    <div className="pt-2 text-xs text-muted-foreground">
                        💡 Uses 8-bit Two's Complement representation
                    </div>
                </div>
            }
        >
            <div className="flex flex-col items-center justify-center p-6 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <div className="flex flex-col gap-2">
                    {/* Carries Row */}
                    <BitRow label="Carries" bits={carries} />

                    {/* Number 1 */}
                    <BitRow label="Num 1" bits={binary1} />

                    {/* Number 2 */}
                    <BitRow label="Num 2" bits={binary2} />

                    {/* Separator Line */}
                    <div className="w-full h-px bg-slate-300 ml-16 my-1"></div>

                    {/* Result */}
                    <BitRow label="Result" bits={resultBinary} className="font-bold text-blue-700" />
                </div>

                <div className="mt-8 text-center space-y-2">
                    <p className="text-lg font-medium">
                        Decimal Result: <span className="font-bold text-2xl">{number1 + number2}</span>
                    </p>
                    <p className="text-sm text-muted-foreground">
                        {number1} + {number2} = {number1 + number2}
                    </p>
                </div>
            </div>
        </AlgorithmPageLayout>
    );
};

export default AdditionSubtraction;
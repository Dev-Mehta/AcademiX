import React, { ChangeEvent, useState } from "react";
import AlgorithmPageLayout from '@/components/AlgorithmPageLayout';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

const NumberConversion = () => {
    const [decimal, setDecimal] = useState("");
    const [binary, setBinary] = useState("");
    const [octal, setOctal] = useState("");
    const [hexadecimal, setHexadecimal] = useState("");
    const [error, setError] = useState("");
    const [activeBase, setActiveBase] = useState<string>("");

    const clearAll = () => {
        setDecimal("");
        setBinary("");
        setOctal("");
        setHexadecimal("");
        setError("");
        setActiveBase("");
    }

    const handleDecimalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setDecimal(value);
        setActiveBase("decimal");
        if (value === "") {
            clearAll();
            return;
        }

        const num = parseInt(value, 10);
        if (!isNaN(num) && num >= 0) {
            setBinary(num.toString(2));
            setOctal(num.toString(8));
            setHexadecimal(num.toString(16).toUpperCase());
            setError("");
        } else {
            setError("Invalid Decimal Number");
        }
    };

    const handleBinaryChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setBinary(value);
        setActiveBase("binary");
        if (value === "") {
            clearAll();
            return;
        }

        const num = parseInt(value, 2);
        if (!isNaN(num)) {
            setDecimal(num.toString(10));
            setOctal(num.toString(8));
            setHexadecimal(num.toString(16).toUpperCase());
            setError("");
        } else {
            setError("Invalid Binary Number");
        }
    };

    const handleOctalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setOctal(value);
        setActiveBase("octal");
        if (value === "") {
            clearAll();
            return;
        }

        const num = parseInt(value, 8);
        if (!isNaN(num)) {
            setDecimal(num.toString(10));
            setBinary(num.toString(2));
            setHexadecimal(num.toString(16).toUpperCase());
            setError("");
        } else {
            setError("Invalid Octal Number");
        }
    }

    const handleHexadecimalChange = (e: ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setHexadecimal(value);
        setActiveBase("hexadecimal");
        if (value === "") {
            clearAll();
            return;
        }

        const num = parseInt(value, 16);
        if (!isNaN(num)) {
            setDecimal(num.toString(10));
            setBinary(num.toString(2));
            setOctal(num.toString(8));
            setError("");
        } else {
            setError("Invalid Hexadecimal Number");
        }
    }

    const getConversionSteps = () => {
        if (!decimal || error) return null;

        const num = parseInt(decimal, 10);
        if (isNaN(num)) return null;

        return (
            <div className="space-y-4">
                <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-primary">Decimal: {decimal}</h3>
                    <p className="text-sm text-muted-foreground mt-1">Conversions to other bases</p>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    <Card className="border-2 border-blue-200 bg-blue-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-blue-600">Binary (Base 2)</p>
                                    <p className="text-2xl font-mono font-bold mt-1">{binary}</p>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <p>{binary.length} bits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-orange-200 bg-orange-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-orange-600">Octal (Base 8)</p>
                                    <p className="text-2xl font-mono font-bold mt-1">{octal}</p>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <p>{octal.length} digits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="border-2 border-purple-200 bg-purple-50/50">
                        <CardContent className="p-4">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-purple-600">Hexadecimal (Base 16)</p>
                                    <p className="text-2xl font-mono font-bold mt-1">{hexadecimal}</p>
                                </div>
                                <div className="text-right text-xs text-muted-foreground">
                                    <p>{hexadecimal.length} digits</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                <div className="mt-6 p-4 bg-slate-100 rounded-lg">
                    <h4 className="font-semibold mb-2 text-sm">Quick Reference:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs text-muted-foreground">
                        <div>• Binary uses digits: 0, 1</div>
                        <div>• Octal uses digits: 0-7</div>
                        <div>• Decimal uses digits: 0-9</div>
                        <div>• Hex uses: 0-9, A-F</div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <AlgorithmPageLayout
            title="Number Base Conversion"
            description="Convert numbers between Decimal, Binary, Octal, and Hexadecimal formats instantly."
            resources={[
                { label: "Radix (Base)", url: "https://en.wikipedia.org/wiki/Radix" },
                { label: "Positional Notation", url: "https://en.wikipedia.org/wiki/Positional_notation" }
            ]}
            controls={
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-blue-600">Decimal (Base 10)</label>
                        <Input
                            type="text"
                            value={decimal}
                            onChange={handleDecimalChange}
                            placeholder="e.g. 255"
                            className="font-mono text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-green-600">Binary (Base 2)</label>
                        <Input
                            type="text"
                            value={binary}
                            onChange={handleBinaryChange}
                            placeholder="e.g. 11111111"
                            className="font-mono text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-orange-600">Octal (Base 8)</label>
                        <Input
                            type="text"
                            value={octal}
                            onChange={handleOctalChange}
                            placeholder="e.g. 377"
                            className="font-mono text-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none text-purple-600">Hexadecimal (Base 16)</label>
                        <Input
                            type="text"
                            value={hexadecimal}
                            onChange={handleHexadecimalChange}
                            placeholder="e.g. FF"
                            className="font-mono text-lg uppercase"
                        />
                    </div>

                    {error && (
                        <div className="p-3 bg-red-50 text-red-600 border border-red-200 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div className="pt-2 text-xs text-muted-foreground">
                        💡 Type in any box to see instant conversion
                    </div>
                </div>
            }
        >
            {decimal && !error ? (
                getConversionSteps()
            ) : (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                    <div className="text-6xl mb-4">🔢</div>
                    <p className="text-lg font-medium text-muted-foreground">Enter a number to see conversions</p>
                    <p className="text-sm text-muted-foreground mt-2">Type in any input field on the left to get started</p>
                </div>
            )}
        </AlgorithmPageLayout>
    );
}

export default NumberConversion;
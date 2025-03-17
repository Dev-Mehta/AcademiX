import React, { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks'

function MCM() {
    const codeSnippet = `function matrixChainMultiplication(dimensions) {
    const n = dimensions.length - 1;
    const table = Array.from({ length: n }, () => Array(n).fill(0));
    const order = Array.from({ length: n }, () => Array(n).fill(0));

    for (let length = 2; length <= n; length++) {
        for (let i = 0; i < n - length + 1; i++) {
            let j = i + length - 1;
            table[i][j] = Infinity;

            for (let k = i; k < j; k++) {
                const cost = table[i][k] + table[k + 1][j] + dimensions[i] * dimensions[k + 1] * dimensions[j + 1];
                if (cost < table[i][j]) {
                    table[i][j] = cost;
                    order[i][j] = k;
                }
            }
        }
    }

    function getOrder(i, j) {
        if (i === j) return \`A\${i + 1}\`;
        const k = order[i][j];
        const leftOrder = getOrder(i, k);
        const rightOrder = getOrder(k + 1, j);
        return \`(\${leftOrder} x \${rightOrder})\`;
    }

    const bestOrder = getOrder(0, n - 1);

    return { minCost: table[0][n - 1], table, bestOrder };
}`
    const [dimensions, setDimension] = useState('')
    const [result, setResult] = useState(null)
    function toIntArray(intString: string) {
        const strArray = intString.split(','); // Splitting the string into an array
        const intArray = strArray.map(num => {
            try {
                const parsed = parseInt(num.trim(), 10);
                if (isNaN(parsed)) {
                    throw new Error(`Invalid number: "${num.trim()}"`);
                }
                return parsed;
            } catch (error: unknown) {
                console.error((error as Error).message);
                return Number.MIN_VALUE; // or handle it as needed
            }
        });

        return intArray;
    }

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        let arr = toIntArray(dimensions);
        const n = arr.length;
        const dp = Array.from({ length: n }, () => Array(n).fill(0));
        const order = Array.from({ length: n }, () => Array(n).fill(0));
        const orderStr = Array.from({ length: n }, () => Array(n).fill(""));

        for (let len = 2; len < n; len++) {
            for (let i = 0; i < n - len; i++) {
                let j = i + len;
                dp[i][j] = Infinity;
                for (let k = i + 1; k < j; k++) {
                    let cost = dp[i][k] + dp[k][j] + arr[i] * arr[k] * arr[j];
                    if (cost < dp[i][j]) {
                        dp[i][j] = cost;
                        order[i][j] = k;
                        const leftOrder = orderStr[i][k] || `A${i + 1}`;
                        const rightOrder = orderStr[k][j] || `A${j}`;
                        orderStr[i][j] = `(${leftOrder} x ${rightOrder})`;
                    }
                }
            }
        }
        // we got our dp and its min cost would be on dp[0][n-1]
        const bestOrder = orderStr[0][n - 1];

        setResult({ bestOrder, dp, minCost:dp[0][n-1] });
    }

    return (
        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Matrix Chain Multiplication</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Matrix_chain_multiplication'>:Explanation</a></p>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Matrix_chain_multiplication#A_dynamic_programming_algorithm'>:Implementation</a></p>

                <Accordion type="single" collapsible className="">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold">Algorithm?</AccordionTrigger>
                        <AccordionContent className='font-mono w-full'>

                            <CopyBlock
                                text={codeSnippet}
                                language="JavaScript"
                                theme={dracula}
                                codeBlock></CopyBlock>
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className='flex flex-col gap-2'>
                    Enter Dimensions (comma seperated): <input type="text" name="dimensions" id="dimensions" className='border p-2 rounded-md' onChange={(e) => { setDimension(e.target.value) }} />
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(event) => { handleSubmit(event) }}>Calculate</button>
                </form>
                {result &&
                    (<>
                        <div id='minimum_cost' className='pt-4'>
                            Minimum Cost is {result.minCost}
                        </div>
                        <div id="dp" className='pt-2'>
                            <h1>DP Table:</h1>
                            <table className="border-collapse border border-gray-300 w-full text-center">
                                <tbody>
                                    {result.dp.map((row) => (
                                        <tr className="odd:bg-gray-100 even:bg-gray-200">
                                            {row.map((val) => (
                                                <td className="border border-gray-300 p-2 text-gray-700">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div id="best-order" className='py-3'>
                            Best Order: {result.bestOrder}
                        </div>
                    </>)
                }
            </div>
        </div>
    )
}

export default MCM
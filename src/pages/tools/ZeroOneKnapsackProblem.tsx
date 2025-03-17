import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks';
function ZeroOneKnapsackProblem() {
    const codeSnippet = `// Returns the maximum value that
// can be put in a knapsack of capacity W

function knapsack(W, val, wt) {
    let n = wt.length;
    let dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

    // Build table dp[][] in bottom-up manner
    for (let i = 0; i <= n; i++) {
        for (let j = 0; j <= W; j++) {

            // If there is no item or the knapsack's capacity is 0
            if (i === 0 || j === 0)
                dp[i][j] = 0;
            else {
                let pick = 0;

                // Pick ith item if it does not exceed the capacity of knapsack
                if (wt[i - 1] <= j)
                    pick = val[i - 1] + dp[i - 1][j - wt[i - 1]];

                // Don't pick the ith item
                let notPick = dp[i - 1][j];

                dp[i][j] = Math.max(pick, notPick);
            }
        }
    }
    return dp[n][W];
}
`
    const [matrix, setMatrix] = useState<number[][]>([]);
    const [weights, setWeights] = useState("");
    const [profits, setProfits] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [displayError, setDisplayError] = useState<string | boolean>(false)
    const [finalProfit, setFinalProfit] = useState<number | null>(null)
    const [selected, setSelected] = useState<number[]>([])
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
                return null; // or handle it as needed
            }
        });

        return intArray;
    }
    const zeroOneKnapsack = (W: number, wt: number[], val: number[]) => {
        const n = wt.length;
        const dp = Array.from({ length: n + 1 }, () => Array(W + 1).fill(0));

        // Build table dp[][] in bottom-up manner
        for (let i = 0; i <= n; i++) {
            for (let j = 0; j <= W; j++) {

                // If there is no item or the knapsack's capacity is 0
                if (i === 0 || j === 0)
                    dp[i][j] = 0;
                else {
                    let pick = 0;

                    // Pick ith item if it does not exceed the capacity of knapsack
                    if (wt[i - 1] <= j)
                        pick = val[i - 1] + dp[i - 1][j - wt[i - 1]];

                    // Don't pick the ith item
                    const notPick = dp[i - 1][j];

                    dp[i][j] = Math.max(pick, notPick);
                }
            }
        }

        setMatrix(dp)
        const selected = Array(n).fill(0);
        let w = W;
        for (let i = n; i > 0; i--) {
            if (dp[i][w] !== dp[i - 1][w]) {
                selected[i - 1] = 1;  // Mark this item as selected
                w -= wt[i - 1];  // Reduce the remaining capacity
            }
        }
        setSelected(selected)
        return dp[n][W];
    }
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const weight_arr = toIntArray(weights).filter((num): num is number => num !== null);
        const profit_arr = toIntArray(profits).filter((num): num is number => num !== null);
        if (weight_arr.length == profit_arr.length) {
            setDisplayError(false)

            const max_profit = zeroOneKnapsack(capacity, weight_arr, profit_arr);
            console.log(max_profit);
            setFinalProfit(max_profit);
        } else {
            setFinalProfit(null);
            setDisplayError("The number of items in weights and profits array should be equal.")
        }
    }

    return (

        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Zero One Knapsack Problem (Bottom-Up DP)</h1>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Knapsack_problem'>:Explanation</a></p>
                <p className='text-xl my-2 prose'><a href='https://en.wikipedia.org/wiki/Knapsack_problem#0-1_knapsack_problem'>:Pseudocode</a></p>
                <Accordion type="single" collapsible className="">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold">Algorithm</AccordionTrigger>
                        <AccordionContent className=' w-full font-mono'>

                            <CopyBlock
                                text={codeSnippet}
                                language="JavaScript"
                                theme={dracula}
                                codeBlock></CopyBlock>

                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <h1 className='text-lg font-bold my-2'>0-1 Knapsack Solver</h1>
                <form className='flex flex-col gap-2'>
                    Weights (comma seperated): <input type="text" name="weights" id="weights" required className='border p-2 rounded-md' onChange={(e) => { setWeights(e.target.value) }} />
                    Profits (comma seperated): <input type="text" name="profits" id="profits" required className='border p-2 rounded-md' onChange={(e) => { setProfits(e.target.value) }} />
                    Capacity: <input type="number" name="capacity" id="capacity" required className='border p-2 rounded-md' onChange={(e) => { setCapacity(parseInt(e.target.value)) }} />
                    <p className='text-xs'>Make sure that number of weights and profits are equal otherwise a error will be shown.</p>
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(e) => { handleSubmit(e) }}>Calculate</button>
                    {displayError && (
                        <div className='bg-red-200 text-red-600 p-3 rounded-md'>
                            {displayError}
                        </div>
                    )}


                </form>
                <div className='py-4'>
                    {finalProfit && (<>Final Profit: {finalProfit}</>)}
                </div>
                {matrix.length > 0 && (
                    <div className="py-4">
                        Dynamic Programming Table:
                        <table className="border-collapse border border-gray-300 w-full text-center">
                            <tbody>
                                {matrix.map((row: number[], rowIndex) => (
                                    <tr key={rowIndex} className="odd:bg-gray-100 even:bg-gray-200">
                                        {row.map((i, colIndex) => (
                                            <td
                                                key={colIndex}
                                                className="border border-gray-300 p-2 text-gray-700"
                                            >
                                                {i}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {selected.length > 0 && (
                    <div className='py-3'>
                        Items Selected:
                        <table className="border-collapse border border-gray-300 w-full text-center">
                            <tr className='bg-gray-500'>
                                {selected.map((_, index) =>
                                    (<th className="border border-gray-300 p-2 text-gray-100">{index + 1}</th>)
                                )}
                            </tr>
                            <tr className='bg-gray-100'>
                                {selected.map((i) =>
                                    (<td className="border border-gray-300 p-2 text-gray-700">{i}</td>)
                                )}
                            </tr>
                        </table>
                    </div>
                )}
            </div>
        </div>
    )
}

export default ZeroOneKnapsackProblem
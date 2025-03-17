import { useState } from 'react'
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "../../components/accordion"
import { CopyBlock, dracula } from 'react-code-blocks';

// creating a class for knapsack item


function FractionalKnapsack() {
    const codeSnippet = `class Item {
  constructor(value, weight) {
    this.value = value;
    this.weight = weight;
    this.ratio = value / weight; // Value-to-weight ratio
  }
}

function fractionalKnapsack(items, capacity) {
  // Sort items based on their value-to-weight ratio in descending order
  items.sort((a, b) => b.ratio - a.ratio);

  let totalValue = 0; // Total value of the knapsack
  let remainingCapacity = capacity;

  for (const item of items) {
    if (item.weight <= remainingCapacity) {
      // Take the whole item
      totalValue += item.value;
      remainingCapacity -= item.weight;
    } else {
      // Take the fraction of the item that fits
      totalValue += item.ratio * remainingCapacity;
      break; // Knapsack is full
    }
  }

  return totalValue;
}

// Example usage
const items = [
  new Item(60, 10),
  new Item(100, 20),
  new Item(120, 30)
];
const capacity = 50;

const maxValue = fractionalKnapsack(items, capacity);
console.log("Maximum value in knapsack:", maxValue);
`
    const [weights, setWeights] = useState("");
    const [profits, setProfits] = useState("");
    const [capacity, setCapacity] = useState(0);
    const [displayError, setDisplayError] = useState<string | boolean>(false)
    const [finalProfit, setFinalProfit] = useState<number | null>(null)
    const [steps, setSteps] = useState<Array<{ step: number; itemSelected: string; itemWeight: number; itemProfit: number; fractionTaken: string; totalProfit: string; action: string; remainingCapacity: number }>>([]);
    class Item {
        profit: number;
        weight: number;
        ratio: number;

        constructor(profit: number, weight: number) {
            this.profit = profit;
            this.weight = weight;
            this.ratio = profit / weight
        }
    }
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

        return intArray.filter((num): num is number => num !== null);
    }
    const FractionalKnapsack = (W: number, arr: Array<Item>) => {
        // W = total Weight capacity
        // arr = array of Items
        let remainingCapacity = W;
        let totalValue = 0;
        const sortedItems = arr.sort((a, b) => b.ratio - a.ratio);
        const currentSteps = [];
        for (let i = 0; i < sortedItems.length; i++) {
            const item = sortedItems[i];
            let fraction = 0;
            if (item.weight <= remainingCapacity) {
                fraction = 1;
                remainingCapacity -= item.weight;
                totalValue += item.profit;
            } else if (remainingCapacity > 0) {
                fraction = remainingCapacity / item.weight;
                totalValue += item.profit * fraction;
                remainingCapacity = 0;
            }
            currentSteps.push({
                step: i + 1,
                itemSelected: `Item ${i + 1}`,
                itemWeight: item.weight,
                itemProfit: item.profit,
                fractionTaken: fraction === 1 ? "Whole" : `${(fraction * 100).toFixed(2)}%`,
                totalProfit: totalValue.toFixed(2),
                action: fraction === 1 ? "Whole item taken" : "Fraction of item taken",
                remainingCapacity: remainingCapacity
            })
            if (remainingCapacity === 0) {
                break;
            }
        }
        setSteps(currentSteps);
        return totalValue;
    }
    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault()
        const weight_arr = toIntArray(weights);
        const profit_arr = toIntArray(profits);
        if (weight_arr.length == profit_arr.length && capacity > 0 && weight_arr.length > 0) {
            setDisplayError(false)
            const items = []
            for (let i = 0; i < weight_arr.length; i++) {
                items.push(new Item(profit_arr[i], weight_arr[i]));
            }
            const max_profit = FractionalKnapsack(capacity, items);
            console.log(max_profit);
            setFinalProfit(max_profit);
        } else {
            setFinalProfit(null);
            if (weight_arr.length === 0) {
                setDisplayError("Weights and Profits array should not be empty.")
            } else if (capacity <= 0) {
                setDisplayError("Capacity should be greater than 0.")
            } else {
                setDisplayError("The number of items in weights and profits array should be equal.")
            }
        }
    }

    return (

        <div className='m-4 gap-4 justify-center items-center flex flex-col'>
            <div className="w-[80%]">
                <h1 className="text-2xl font-bold">Fractional Knapsack Problem (Greedy)</h1>
                <p className='text-lg my-2 prose'><a href='https://en.wikipedia.org/wiki/Continuous_knapsack_problem'>:Explanation</a></p>
                <p className='text-lg my-2 prose'><a href='https://en.wikipedia.org/wiki/Continuous_knapsack_problem#Problem_definition'>:Definition</a></p>
                <p className='text-lg my-2 prose'><a href='https://en.wikipedia.org/wiki/Continuous_knapsack_problem#Solution_technique'>:Solution Technique</a></p>
                <Accordion type="single" collapsible className="">
                    <AccordionItem value="item-1">
                        <AccordionTrigger className="text-xl font-bold">Algorithm</AccordionTrigger>
                        <AccordionContent className='font-mono w-full'>
                            <CopyBlock
                                text={codeSnippet}
                                language="javascript"
                                showLineNumbers={true}
                                codeBlock={true}
                                theme={dracula}
                            />
                        </AccordionContent>
                    </AccordionItem>
                </Accordion>
                <form className='flex flex-col gap-2'>
                    Weights (comma seperated): <input type="text" name="weights" id="weights" required className='border p-2 rounded-md' onChange={(e) => { setWeights(e.target.value) }} />
                    Profits (comma seperated): <input type="text" name="profits" id="profits" required className='border p-2 rounded-md' onChange={(e) => { setProfits(e.target.value) }} />
                    Capacity: <input type="number" name="capacity" id="capacity" required className='border p-2 rounded-md' onChange={(e) => { setCapacity(parseInt(e.target.value)) }} />
                    <p className='text-xs'>Make sure that number of weights and profits are equal otherwise a error will be shown.</p>
                    <button type='button' className='bg-blue-500 text-white p-2 rounded-md' onClick={(e) => { handleSubmit(e) }}>Calculate</button>

                    {displayError ? (<div className='bg-red-200 text-red-600 p-3 rounded-md'>
                        {displayError && displayError}
                    </div>) : null}
                </form>
                <div>
                    {steps.length > 0 && 
                        <table className='py-4 my-4 border-collapse border border-gray-300 w-full text-center'>
                        <thead>
                            <tr className='odd:bg-gray-100 even:bg-gray-200'>
                                <th>Step</th>
                                <th>Selected Item</th>
                                <th>Weight of Item</th>
                                <th>Profit of Item</th>
                                <th>Fraction Taken</th>
                                <th>Remaining Capacity</th>
                                <th>Total Profit</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {steps.map((step) => (
                                <tr key={step.step} className='odd:bg-gray-100 even:bg-gray-200'>
                                    <td>{step.step}</td>
                                    <td>{step.itemSelected}</td>
                                    <td>{step.itemWeight}</td>
                                    <td>{step.itemProfit}</td>
                                    <td>{step.fractionTaken}</td>
                                    <td>{step.remainingCapacity}</td>
                                    <td>{step.totalProfit}</td>
                                    <td>{step.action}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    }
                {finalProfit && (<div className='text-md font-bold'>Final Profit: {finalProfit}</div>)}
            </div>
        </div>
        </div >
    )
}

export default FractionalKnapsack
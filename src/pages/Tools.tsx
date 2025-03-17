import { Link } from "lucide-react";
import { useEffect } from "react";
const Tools = () => {
    useEffect(() => {
        (window as any).Nutshell.start();
    }, [])
    return (
        <div className="flex flex-col items-center p-2">
            <div className="m-4">
                <h1 className="font-bold text-3xl my-4">Tools</h1>
                <h1 className="font-bold text-xl my-4">Computer Organization & Architecture</h1>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">:What is Booth's Algorithm</a>
                        <a href="/tools/booths-algorithm" className="ml-1 text-indigo-600 hover:underline">Booth's Algorithm</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems">:What is Number Conversion</a>
                        <a href="/tools/number-conversion" className="ml-1 text-indigo-600 hover:underline">Number Conversion</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic">:What is Binary Arithmetic</a>
                        <a href="/tools/binary-arithmetic" className="ml-1 text-indigo-600 hover:underline">Binary Arithmetic</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Division_algorithm#Restoring_division">:What is Booth's Division Algorithm</a>
                        <a href="/tools/division-algorithm" className="ml-1 text-indigo-600 hover:underline">Booth's Division Algorithm</a>
                    </div>
                </div>

                {/* <div className="m-4"> */}
                <h1 className="font-bold text-xl my-4">Discrete Mathematics</h1>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Partially_ordered_set">:What is POSET</a>
                        <a href="/tools/poset" className="ml-1 text-indigo-600 hover:underline">POSET</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm">:What is Floyd-Warshall Algorithm</a>
                        <a href="/tools/warshall-algorithm" className="ml-1 text-indigo-600 hover:underline">Floyd-Warshall Algorithm</a>
                    </div>
                </div>
                {/* </div> */}
                {/* <div className="m-4"> */}
                <h1 className="font-bold text-xl my-4">Design and Analysis of Algorithms</h1>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Bubble_sort">:What is Bubble Sort</a>
                        <a href="/tools/bubble-sort" className="ml-1 text-indigo-600 hover:underline">Bubble Sort</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Selection_sort">:What is Selection Sort</a>
                        <a href="/tools/selection-sort" className="ml-1 text-indigo-600 hover:underline">Selection Sort</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Insertion_sort">:What is Insertion Sort</a>
                        <a href="/tools/insertion-sort" className="ml-1 text-indigo-600 hover:underline">Insertion Sort</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Merge_sort">:What is Merge Sort</a>
                        <a href="/tools/merge-sort" className="ml-1 text-indigo-600 hover:underline">Merge Sort</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Quicksort">:What is Quick Sort</a>
                        <a href="/tools/quick-sort" className="ml-1 text-indigo-600 hover:underline">Quick Sort</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Continuous_knapsack_problem">:What is Fractional Knapsack</a>
                        <a href="/tools/fractional-knapsack" className="ml-1 text-indigo-600 hover:underline">Fractional Knapsack</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Knapsack_problem">:What is 0/1 Knapsack</a>
                        <a href="/tools/0-1-knapsack" className="ml-1 text-indigo-600 hover:underline">0/1 Knapsack</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/Matrix_chain_multiplication">:What is Matrix Chain Multiplication</a>
                        <a href="/tools/matrix-chain-multiplication" className="ml-1 text-indigo-600 hover:underline">MCM</a>
                    </div>
                </div>
                <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                    <Link className="text-lg mr-4" size="18" />
                    <div className="gap-1">
                        <a className=""
                            href="https://en.wikipedia.org/wiki/String-searching_algorithm">:What is String Matching</a>
                        <a href="/tools/string-matching" className="ml-1 text-indigo-600 hover:underline">String Matching</a>
                    </div>
                </div>
                {/* </div> */}
            </div>
        </div>
    )
}

export default Tools;

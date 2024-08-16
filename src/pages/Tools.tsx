const Tools = () => {
    return (
        <div className="m-4">
            <h1 className="font-bold text-3xl my-4">Tools</h1>
            <h1 className="font-bold text-xl my-4">Computer Organization & Architecture</h1>
            <ul className="list-disc ml-8">
                <li><a className="text-indigo-800" href="/tools/booths-algorithm">Booth's Multiplication Algorithm</a> <a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">:Definition</a></li>
                <li><a className="text-indigo-800" href="/tools/number-conversion">Number Conversion</a> <a href="https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems">:Conversion to and from other numeral systems</a></li>
                <li><a className="text-indigo-800" href="/tools/binary-arithmetic">Simple Binary Arithmetic</a> <a href="https://en.wikipedia.org/wiki/Hamming_code">:Definition</a></li>
            </ul>
        </div>
    )
}

export default Tools;
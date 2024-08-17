const Home = () => {
    return (
        <div className="m-4 gap-4 md:w-[70%]">
            <p className="md:text-4xl font-extrabold my-4">AcademiX - Academics Extended</p>
            <h1 className="md:text-2xl my-2 text-indigo-900">What is AcademiX?</h1>
            <p className=""><a href="/" className="underline">AcademiX</a> is a place where you can interlink computer science topics and get an idea of why we study a topic x in our bachelors degree.</p>
            <h1 className="md:text-2xl mt-4">Use tools by AcademiX</h1>
            <p className="">Currently at <a href="/tools" className="underline">AcademiX</a>, you can use the following tools:</p>
            <ul className="list-disc ml-8">
                <li><a href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">:Booth's Multiplication Algorithm</a> - <a className="text-indigo-800 underline" href="/tools/booths-algorithm">Link</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems">:Number Conversion</a> - <a className="text-indigo-800 underline" href="/tools/number-conversion">Link</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic">:Binary Arithmetic</a> - <a className="text-indigo-800 underline" href="/tools/binary-arithmetic">Link</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Partially_ordered_set">:POSET</a> - <a className="text-indigo-800 underline" href="/tools/poset">Link</a></li>
                <li><a href="https://en.wikipedia.org/wiki/Eulerian_path">:Eulerian Path</a> - <a className="text-indigo-800 underline" href="/tools/eulerian-path">Link</a></li>
            </ul>
        </div>
    )
}

export default Home;
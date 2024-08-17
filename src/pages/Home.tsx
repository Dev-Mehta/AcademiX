const Home = () => {
    return (
        <div className="m-4 gap-4 md:w-[70%]">
            <p className="md:text-4xl font-extrabold my-4">AcademiX - Academics Extended</p>
            <div id="WhatisAcademiX">
                <p className="md:text-2xl my-2 text-indigo-900">What is AcademiX?</p>
                <p className="my-2">Academix is an attempt to make computer science topics more interactive and easy to understand. You might be sitting in your discrete mathematics class and wondering why do we study this topic? Nobody uses set theory in real life, right? And you would be totally correct[*]</p>
                <p>[*] - We might not use set theory or for the matter any topic like we do in an academic setting. We would be using these topics intutively and unknowingly in our day to day life.</p>
                <p className="my-2">We, at academix have just one little goal - we want you to think of the nitty gritty details of a computer science subject not as a means to pass an exam and get a bachelors degree, but as a tool in your toolbox that you can use to solve real world problems.</p>
                <p className=""><a href="/" className="underline">AcademiX</a> is a place where you can interlink computer science topics and get an idea of why we study a topic x in our bachelors degree.</p>
            </div>
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
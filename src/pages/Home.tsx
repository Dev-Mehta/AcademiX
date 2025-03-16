import {useState} from 'react';
import { useEffect } from 'react';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '../components/accordion';
import { Link } from "lucide-react"
const Home = () => {
    const [articles, setArticles] = useState([]);
    
    const fetchArticles = async () => {
        const res = await fetch('https://academix-backend-nlqg.onrender.com/api/get-all-articles');
        const data = await res.json();
        const articles_random_5 = data.sort(() => Math.random() - Math.random()).slice(0, 5);
        setArticles(articles_random_5);
    }

    useEffect(() => {
        fetchArticles();
        (window as any).Nutshell.start();
        (window as any).Nutshell.setOptions({
            dontEmbedHeadings: true,
        });
    }, []);

    return (
        <div className="m-4 gap-4 flex flex-col justify-center items-center">
            <p className="md:text-4xl font-extrabold my-4">AcademiX - Academics Extended</p>
            <Accordion type={"multiple"} collapsible className="w-[70%]" defaultValue={['item-1', '2', '3']}>
                <AccordionItem value="item-1">
                    <AccordionTrigger className="text-2xl font-bold">What is AcademiX?</AccordionTrigger>
                    <AccordionContent className='text-lg'>
                    <p className="my-2">Academix is an attempt to make computer science topics more interactive and easy to understand. You might be sitting in your discrete mathematics class and wondering why do we study this topic? Nobody uses set theory in real life, right? And you would be totally correct[*]</p>
                    <p>[*] - We might not use set theory or for the matter any topic like we do in an academic setting. We would be using these topics intutively and unknowingly in our day to day life.</p>
                    <p className="my-2">We, at academix have just one little goal - we want you to think of the nitty gritty details of a computer science subject not as a means to pass an exam and get a bachelors degree, but as a tool in your toolbox that you can use to solve real world problems.</p>
                    <p className=""><a href="/" className="underline">AcademiX</a> is a place where you can interlink computer science topics and get an idea of why we study a topic x in our bachelors degree.</p>
                 </AccordionContent> 
                </AccordionItem>
                <AccordionItem value="2">
                    <AccordionTrigger className="text-2xl font-bold">Use tools by AcademiX</AccordionTrigger>
                    <AccordionContent>
                    { /** 
                        Create a list of tools that are available on the website with card like UI and a link icon on left side of the card
                        */ }
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Booth%27s_multiplication_algorithm">: What is Booth's Algorithm</a>
                                <a href="/tools/booths-algorithm" className="ml-1 text-indigo-600 hover:underline">Booth's Algorithm</a>
                            </div>
                        </div>
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Binary_number#Conversion_to_and_from_other_numeral_systems">: What is Number Conversion</a>
                                <a href="/tools/number-conversion" className="ml-1 text-indigo-600 hover:underline">Number Conversion</a>
                            </div>
                        </div>
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Binary_number#Binary_arithmetic">: What is Binary Arithmetic</a>
                                <a href="/tools/binary-arithmetic" className="ml-1 text-indigo-600 hover:underline">Binary Arithmetic</a>
                            </div>
                        </div>
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Partially_ordered_set">: What is POSET</a>
                                <a href="/tools/poset" className="ml-1 text-indigo-600 hover:underline">POSET</a>
                            </div>
                        </div>
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Division_algorithm#Restoring_division">: What is Booth's Division Algorithm</a>
                                <a href="/tools/division-algorithm" className="ml-1 text-indigo-600 hover:underline">Booth's Division Algorithm</a>
                            </div>
                        </div>
                        <div className="my-2 rounded-md p-4 flex text-lg items-center border border-gray-300">
                            <Link className="text-lg mr-4" size="18"/>
                            <div className="gap-1">
                                <a className="" 
                                href="https://en.wikipedia.org/wiki/Floyd%E2%80%93Warshall_algorithm">: What is Floyd-Warshall Algorithm</a>
                                <a href="/tools/warshall-algorithm" className="ml-1 text-indigo-600 hover:underline">Floyd-Warshall Algorithm</a>
                            </div>
                        </div>
                    </AccordionContent>
                </AccordionItem>
                <AccordionItem value="3">
                    <AccordionTrigger className="text-2xl font-bold">Read articles on various cs topics</AccordionTrigger>
                    <AccordionContent>
                        <>
                        {articles.map((article: any) => {
                            return (
                                <div key={article.title} className="my-2 bg-emerald-100 rounded-md p-4">
                                    <a href={`/article/${article.title}`} className="underline text-xl">{decodeURI(article.title).replace(/_/g, ' ')}</a>
                                </div>
                            )
                        })}
                        <div className="my-2 bg-gray-100 p-4">
                            <a href="/articles" className="underline text-xl">All Articles</a>
                        </div>
                        </>
                    </AccordionContent>
                </AccordionItem>
            </Accordion>
        </div>
    )
}

export default Home;

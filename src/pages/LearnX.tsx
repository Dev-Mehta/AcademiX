const LearnX = () => {
    const topics = [
        {'name': 'set theory', 'url': '/why-do-we-learn/set-theory'},
    ]

    return (
        <div className='container mx-auto p-4'>
            <p className='text-2xl font-bold'>Why do we learn X</p>
            {topics.map((topic, index) => (
                    <p key={index}>But why do we learn <a className="text-indigo-800 underline" href={topic.url}>{topic.name}</a></p>
                )
            )}
        </div>
    )
}

export default LearnX;
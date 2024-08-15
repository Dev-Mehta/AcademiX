
const Navbar = () => {
    const handleResponsiveNavbar = () => {
        const navbar = document.querySelector('.hidden-tog');
        navbar?.classList.toggle('hidden');
        navbar?.classList.toggle('flex-row');
    }
    return (// responsive navbar in tailwind css
        <div className='bg-black text-white'>
            <div className='container mx-auto flex justify-between items-center p-4'>
                <div className='text-2xl font-bold'>AcademiX</div>
                <div className='hidden-tog md:flex space-x-4 hidden'>
                    <a href='/' className='hover:text-gray-300'>Home</a>
                    <a href='/tools' className='hover:text-gray-300'>Tools</a>
                    <a href='/learn-x' className='hover:text-gray-300'>Why do we learn X</a>
                </div>
                <div className='md:hidden'>
                    <button className='text-white focus:outline-none' onClick={handleResponsiveNavbar}>
                        <svg className='w-6 h-6' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M4 6h16M4 12h16m-7 6h7'></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    )
}

export default Navbar;
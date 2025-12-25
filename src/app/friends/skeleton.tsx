const SocialSkeleton = () => {
    const options = [
        {
            icon: '',
            title: ''
        },
        {
            icon: '',
            title: ''
        },
        {
            icon: '',
            title: ''
        },
        {
            icon: '',
            title: ''
        }
    ]
    return (
        <div className='w-full scroll-smooth min-h-screen'>
            <div className='max-w-7xl mx-auto py-10 flex gap-10 text-white'>
                <div className='w-full lg:w-2/3 flex flex-col gap-6 lg:gap-10'>
                    <div className="flex gap-5 font-bold items-center skeleton1-bg p-1">
                        <div className='font-bold w-[40px] h-[40px] skeleton2-bg'></div>
                        <div className='font-bold w-[300px] h-[40px] skeleton2-bg'></div>
                    </div>
                    <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-4 font-bold text-base sm:text-xl'>

                        {options.map((e, index) => {
                            return (
                                <div
                                    className={`cursor-pointer w-full flex items-center text-center bg-[#262522] px-15 py-10 gap-5 relative hover:bg-[#454441]`}
                                    key={`social-option-${index}`}

                                >
                                    <div className='w-[40px] h-[40px] skeleton2-bg'></div>
                                    <div className='w-[150px] h-[40px] skeleton2-bg'></div>
                                    <div className='absolute right-5'>
                                        <div className='w-[40px] h-[40px] skeleton2-bg'></div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>


                </div>
            </div>
        </div>
    )
}

export default SocialSkeleton
const NavbarSkeleton = () => {
    return (
        <div className='flex items-center gap-4'>
            <div className='h-9 w-16 animate-pulse rounded-md bg-grey-200'></div>
            <div className='h-9 w-16 animate-pulse rounded-md bg-grey-200'></div>
            <div className='h-9 w-16 animate-pulse rounded-md bg-grey-200'></div>
            <div className='h-9 w-8 animate-pulse rounded-md bg-grey-200'></div>
            <div className='h-9 w-8 animate-pulse rounded-md bg-grey-200'></div>
        </div>
    );
};

export default NavbarSkeleton;

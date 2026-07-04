import type { NavbarSkeletonProps } from "../../types/types.js";

const SkeletonBlock = ({ className }: { className: string }) => {
    return (
        <div className={`animate-pulse rounded-md bg-border ${className}`} />
    );
};

const NavbarSkeleton = ({ isMobile = false }: NavbarSkeletonProps) => {
    return (
        <div className='flex items-center gap-4' >
            <span className='sr-only'>Loading navigation...</span>
            <SkeletonBlock className='h-4 w-12' />
            <SkeletonBlock className='h-4 w-14' />
            {!isMobile && (
                <>
                    <SkeletonBlock className='h-9 w-20 rounded-xl' />
                    <SkeletonBlock className='h-9 w-9 rounded-full' />
                </>
            )}
        </div>
    );
};

export default NavbarSkeleton;

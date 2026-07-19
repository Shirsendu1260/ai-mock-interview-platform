import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';
import { IoLogOut } from "react-icons/io5";
import { FaUser, FaRupeeSign } from 'react-icons/fa';
import { RiCopperCoinFill } from "react-icons/ri";
import { signOutHandler } from '../../handlers/auth.handler.js';
import { ApiError } from '../../utils/ApiError.js';
import { formatDate } from '../../utils/helpers.js';
import UserAvatar from '../common/UserAvatar.jsx';

const UserDropdown = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const user = useAuthStore(state => state.user);
    const navigate = useNavigate();

    const handleSignOut = async () => {
        console.log("User signing out...");

        try {
            await signOutHandler();
            navigate('/');
        }
        catch(error) {
            if(error instanceof ApiError) {
                console.error(`Error ${error.statusCode}: ${error.message}`);
            }
            else {
                console.error(error);
            }
        }
    };

    // Refrence to the whole dropdown container
    // React will put the DOM element into dropdownRef.current
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Without this code, dropdown can only be closed when clicking on the user avatar
    // With this code, dropdown can be closed by clicking anywhere
    useEffect(() => {
        // Runs whenever user clicks anywhere in the document
        const handleClickOutside = (event: MouseEvent) => {
            // event.target = the element user clicked
            // dropdownRef.current = dropdown div
            // contains() checks if the clicked element is inside the dropdown
            // If not, then closes the menu
            if(dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        }

        // Listen to clicks on whole page
        document.addEventListener('mousedown', handleClickOutside);

        return () => document.removeEventListener('mousedown', handleClickOutside);
        // React saves this function with the help of this 'return' when this useEffect() runs
        // i.e. when the component mounts
        // React automatically calls it when the component 'UserDropdown' is removed (unmounted)
        // This prevents memory leaks and duplicate event listeners
        // So, mount -> handleClickOutside() with the help of useEffect() runs
        // unmount -> this cleanup function runs
    }, []);

    return (
        <div className='relative' ref={dropdownRef}>
            <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className='cursor-pointer flex h-10 w-10 items-center justify-center rounded-full'
            >
                <UserAvatar size={10} />
            </button>

            {/*AnimatePresence allows components to animate while leaving the DOM.
            Without it:
            isDropdownOpen=false -> React destroys the component immediately.
            With AnimatePresence:
            React waits until the exit animation finishes and only then removes the component.*/}
            <AnimatePresence>
                {
                    isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.18 }}
                            className='absolute right-0 top-16 z-50 w-80 rounded-3xl border
                            border-border bg-background p-4 shadow-lg'
                        >
                            <div className='border-b border-border pb-4'>
                                <div className='flex items-center gap-4 mb-2'>
                                    <UserAvatar size={9} />
                                    <p className='text-lg font-semibold text-dark'>
                                        {user?.fullName}
                                    </p>
                                </div>

                                <p className='mt-2 text-sm text-muted'>
                                    {user?.email}
                                </p>
                                <p className='mt-1 text-sm text-muted'>
                                    Joined {formatDate(user?.createdAt as string)}
                                </p>
                            </div>

                            <div className='mt-4 flex flex-col gap-1'>
                                <Link
                                    to='/dashboard/user/profile'
                                    onClick={() => setIsDropdownOpen(false)}
                                    className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm
                                    font-medium transition hover:bg-accent/8 hover:cursor-pointer'
                                >
                                    <FaUser size={17}/>
                                    Profile
                                </Link>

                                <Link
                                    to='/dashboard/payments/history'
                                    onClick={() => setIsDropdownOpen(false)}
                                    className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm
                                    font-medium transition hover:bg-accent/8 hover:cursor-pointer'
                                >
                                    <FaRupeeSign size={17}/>
                                    Payments History
                                </Link>

                                <Link
                                    to='/dashboard/payments/credit-history'
                                    onClick={() => setIsDropdownOpen(false)}
                                    className='flex items-center gap-3 rounded-2xl px-4 py-3 text-sm
                                    font-medium transition hover:bg-accent/8 hover:cursor-pointer'
                                >
                                    <RiCopperCoinFill size={17} className='text-yellow-400' />
                                    Credits History
                                </Link>

                                <button
                                    onClick={async () => {
                                        await handleSignOut();
                                        setIsDropdownOpen(false)
                                    }}
                                    className='flex items-center gap-3 rounded-2xl px-4 py-3
                                    text-sm font-medium text-red-500 transition hover:bg-red-50 dark:hover:bg-red-950/40
                                    hover:cursor-pointer'
                                >
                                    <IoLogOut size={17}/>
                                    Sign Out
                                </button>
                            </div>
                        </motion.div>
                    )
                }
            </AnimatePresence>
        </div>
    );
};

export default UserDropdown;

import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../stores/auth.store.js';
import { IoLogOut } from "react-icons/io5";
import { FaUser } from 'react-icons/fa';
import { signOutHandler } from '../../handlers/auth.handler.js';
import { ApiError } from '../../utils/ApiError.js';
import { formatDate } from '../../utils/helpers.js';

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

    return (
        <div className='relative'>
            <button
                onClick={() => setIsDropdownOpen(prev => !prev)}
                className='cursor-pointer'
            >
                <img
                    src={user?.avatarUrl ?? ''}
                    alt={user?.fullName}
                    className='h-10 w-10 rounded-full border border-border object-cover'
                />
            </button>

            {/*AnimatePresence allows components to animate while leaving the DOM.
            Without it:
            isMenuOpen=false -> React destroys the component immediately.
            With AnimatePresence:
            React waits until the exit animation finishes and only then removes the component.*/}
            <AnimatePresence>
                {
                    isDropdownOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.13 }}
                            className='absolute right-0 top-14 z-50 w-72 rounded-3xl border
                            border-border bg-white p-3 shadow-lg'
                        >
                            <div className='border-b border-border p-2'>
                                <p className='font-semibold text-dark'>
                                    {user?.fullName}
                                </p>
                                <p className='mt-1 text-sm text-muted'>
                                    {user?.email}
                                </p>
                                <p className='mt-1 mb-2 text-sm text-muted'>
                                    Joined at {formatDate(user?.createdAt as string)}
                                </p>
                            </div>

                            <div className='mt-3 flex flex-col gap-2'>
                                <Link
                                    to='/user/profile'
                                    onClick={() => setIsDropdownOpen(false)}
                                    className='flex items-center gap-2 rounded-2xl px-3 py-2 text-sm
                                    font-medium transition hover:bg-background'
                                >
                                    <FaUser size={17}/>
                                    Profile
                                </Link>

                                <button
                                    onClick={async () => {
                                        await handleSignOut();
                                        setIsDropdownOpen(false)
                                    }}
                                    className='flex items-center gap-2 rounded-2xl px-3 py-2 text-left
                                    text-sm font-medium text-red-500 transition hover:bg-red-50'
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

import { useRef } from "react";
import { JOB_ROLES } from "../../constants/interview.js";
import { FaChevronDown } from 'react-icons/fa';

const RoleSelect = () => {
    const roleSelectorRef = useRef<HTMLSelectElement>(null);

    return (
        <div className='space-y-2'>
            <label className='font-medium text-dark mb-2 block'>
                Role
            </label>

            <div className="relative">
                <select
                    ref={roleSelectorRef}
                    className='
                        w-full rounded-xl border border-border bg-white px-4 py-3 outline-none
                        focus:border-accent appearance-none text-sm
                    '
                >
                    <option value=''>Select</option>
                    {JOB_ROLES.map(role => (
                        <option key={role} value={role}>{role}</option>
                    ))}
                </select>

                {/*Custom selector arrow icon*/}
                <FaChevronDown
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                    size={14}
                />
            </div>
        </div>
    );
};

export default RoleSelect;

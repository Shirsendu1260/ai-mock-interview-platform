import { useState } from "react";
import { JOB_ROLES } from "../../constants/interview.js";
import { FaChevronDown } from 'react-icons/fa';
import type { RoleSelectorProps } from "../../types/types.js";
import Input from "../ui/Input.jsx";

const RoleSelect = ({ role, setRole, error, setErrors }: RoleSelectorProps) => {
    const [otherSelected, setOtherSelected] = useState(false);

    const handleJobRoleSelectEvent = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedRole = event.target.value;

        if (selectedRole === 'other') {
            setOtherSelected(true);
            setRole('');
            setErrors(prev => ({ ...prev, role: '' }));
        }
        else {
            setOtherSelected(false);
            setRole(selectedRole);
            setErrors(prev => ({ ...prev, role: '' }));
        }
    };

    return (
        <>
            <div className='space-y-2'>
                <label className='font-medium text-dark mb-2 block'>
                    Role
                </label>

                <div className="relative">
                    <select
                        className='
                            w-full rounded-xl border border-border bg-white px-4 py-3 outline-none
                            focus:border-accent appearance-none text-sm
                        '
                        onChange={handleJobRoleSelectEvent}
                        value={otherSelected ? 'other' : role}
                    >
                        <option value=''>Select</option>
                        {JOB_ROLES.map(jobRole => (
                            <option key={jobRole} value={jobRole}>{jobRole}</option>
                        ))}
                        <option value='other'>Other</option>
                    </select>

                    {/*Custom selector arrow icon*/}
                    <FaChevronDown
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted pointer-events-none"
                        size={14}
                    />
                </div>

                {
                    error && (
                        <p className='mt-1 text-sm text-red-500'>{error}</p>
                    )
                }
            </div>

            {
                otherSelected && (
                    <div className='space-y-2'>
                        <Input
                            id="other-jobrole-input"
                            label="Specify Role"
                            value={role}
                            placeholder="Example: JavaScript Developer"
                            onChange={(event)=>{
                                setRole(event.target.value);
                                setErrors(prev => ({ ...prev, role:'' }));
                            }}
                        />
                    </div>
                )
            }
        </>
    );
};

export default RoleSelect;

import { JOB_ROLES } from "../../constants/interview.js";

const RoleSelect = () => {
    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-dark'>
                Role
            </label>

            <select
                className='
                    w-full rounded-2xl border border-border bg-white px-3 py-2 outline-none
                    focus:border-accent
                '
            >
                <option value=''>Select an option</option>
                {JOB_ROLES.map(role => (
                    <option key={role} value={role}>{role}</option>
                ))}
            </select>
        </div>
    );
};

export default RoleSelect;

import { FaChevronDown } from "react-icons/fa";
import { STATES } from "../../constants/jobSearch.js";
import type { StateSelectorProps } from '../../types/types.js';

const StateSelector = ({
    stateName,
    setStateName,
    setDistrict,
    error,
    setErrors
}: StateSelectorProps) => {
    return (
        <div className="space-y-2">
            <label className="font-medium text-dark block">
                State
            </label>

            <div className="relative">
                <select
                    className="
                        w-full rounded-xl border border-border
                        bg-surface px-4 py-3 appearance-none outline-none
                        focus:border-accent text-sm
                    "
                    value={stateName}
                    onChange={(event)=>{
                        setStateName(event.target.value);
                        setDistrict('');
                        setErrors(prev => ({
                            ...prev,
                            state: '',
                            district: ''
                        }));
                    }}
                >
                    <option value=''>
                        Select State
                    </option>

                    {
                        STATES.map(state => (
                            <option key={state} value={state} >
                                {state}
                            </option>
                        ))
                    }
                </select>

                <FaChevronDown
                    size={14}
                    className="
                        absolute right-4 top-1/2 -translate-y-1/2
                        pointer-events-none text-muted
                    "
                />
            </div>

            {
                error && (
                    <p className="text-sm text-red-500">
                        {error}
                    </p>
                )
            }
        </div>
    );
};

export default StateSelector;

import { FaChevronDown } from "react-icons/fa";
import { DISTRICTS } from "../../constants/jobSearch.js";
import type { DistrictSelectorProps } from '../../types/types.js';

const DistrictSelector = ({
    stateName,
    district,
    setDistrict,
    error,
    setErrors
}: DistrictSelectorProps)=>{
    const districts = stateName
                        ? DISTRICTS[stateName as keyof typeof DISTRICTS] // 'stateName' should be be keys from 'DISTRICTS' object
                        : [];

    return(
        <div className="space-y-2">
            <label className="font-medium text-dark block">
                District (Optional)
            </label>

            <div className="relative">
                <select
                    disabled={!stateName}
                    value={district}
                    onChange={(event) => {
                        setDistrict(event.target.value);
                        setErrors(prev => ({
                            ...prev,
                            district: ''
                        }));
                    }}
                    className="
                        w-full rounded-xl border border-border text-sm
                        bg-white px-4 py-3 appearance-none outline-none
                        focus:border-accent disabled:bg-gray-100 disabled:text-gray-400
                    "
                >
                    <option value="">
                        {
                            stateName ? 'All Districts' : 'Select State First'
                        }
                    </option>

                    {
                        districts.map(district => (
                            <option key={district} value={district} >
                                {district}
                            </option>
                        ))
                    }
                </select>

                <FaChevronDown
                    size={14}
                    className="
                        absolute right-4 top-1/2 -translate-y-1/2
                        text-muted pointer-events-none
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

export default DistrictSelector;

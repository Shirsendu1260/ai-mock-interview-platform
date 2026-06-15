import { NO_OF_QUESTIONS } from '../../constants/interview.js';
import { FaChevronDown } from 'react-icons/fa';

const NoOfQtnSelector = () => {
    return (
        <div className='space-y-2'>
            <label className='font-medium text-dark mb-2 block'>
                Number of Questions
            </label>

            <div className="relative">
                <select
                    className='
                        w-full rounded-xl border border-border bg-white px-4 py-3 outline-none
                        focus:border-accent appearance-none text-sm
                    '
                >
                    <option value=''>Select</option>
                    {NO_OF_QUESTIONS.map(count => (
                        <option key={count} value={count}>{count}</option>
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

export default NoOfQtnSelector;

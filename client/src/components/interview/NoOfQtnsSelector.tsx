import { NO_OF_QUESTIONS } from '../../constants/interview.js';

const NoOfQtnSelector = () => {
    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-dark'>
                Number of Questions
            </label>

            <select
                className='
                    w-full rounded-2xl border border-border bg-white px-3 py-2 outline-none
                    focus:border-accent
                '
            >
                <option value=''>Select an option</option>
                {NO_OF_QUESTIONS.map(count => (
                    <option key={count} value={count}>{count}</option>
                ))}
            </select>
        </div>
    );
};

export default NoOfQtnSelector;

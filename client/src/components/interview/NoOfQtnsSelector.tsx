import { NO_OF_QUESTIONS } from '../../constants/interview.js';
import { FaChevronDown } from 'react-icons/fa';
import type { NoOfQtnsSelectorProps, QuestionsCount } from '../../types/types.js';

const NoOfQtnsSelector = ({ qtnsCount, setQtnsCount, error, setErrors }: NoOfQtnsSelectorProps) => {
    return (
        <div className='space-y-2'>
            <label className='font-medium text-dark mb-2 block'>
                Number of Questions
            </label>

            <div className="relative">
                <select
                    className='
                        w-full rounded-xl border border-border bg-surface text-dark px-4 py-3 outline-none
                        focus:border-accent appearance-none text-sm
                    '
                    value={qtnsCount}
                    onChange={(event) => {
                        setQtnsCount(Number(event.target.value) as QuestionsCount | 0);
                        setErrors(prev => ({ ...prev, qtnsCount: '' }));
                    }}
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

            {
                error && (
                    <p className='mt-1 text-sm text-red-500'>{error}</p>
                )
            }
        </div>
    );
};

export default NoOfQtnsSelector;

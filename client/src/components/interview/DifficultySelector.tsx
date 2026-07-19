import { DIFFICULTIES } from '../../constants/interview.js';
import { FaChevronDown } from 'react-icons/fa';
import type { Difficulty, DifficultySelectorProps } from '../../types/types.js';

const DifficultySelector = ({ difficulty, setDifficulty, error, setErrors }: DifficultySelectorProps) => {
    return (
        <div className='space-y-2'>
            <label className='font-medium text-dark mb-2 block'>
                Difficulty
            </label>

            <div className="relative">
                <select
                    className='
                        w-full rounded-xl border border-border bg-surface text-dark px-4 py-3 outline-none
                        focus:border-accent appearance-none text-sm
                    '
                    value={difficulty}
                    onChange={(event)=>{
                        setDifficulty(event.target.value as Difficulty | '')
                        setErrors(prev => ({ ...prev, difficulty: '' }));
                    }}
                >
                    <option value=''>Select</option>
                    {DIFFICULTIES.map(difficulty => (
                        <option key={difficulty} value={difficulty}>
                            {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                        </option>
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

export default DifficultySelector;

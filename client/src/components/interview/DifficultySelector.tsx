import { DIFFICULTIES } from '../../constants/interview.js';

const DifficultySelector = () => {
    return (
        <div className='space-y-2'>
            <label className='text-sm font-medium text-dark'>
                Difficulty
            </label>

            <select
                className='
                    w-full rounded-2xl border border-border bg-white px-3 py-2 outline-none
                    focus:border-accent
                '
            >
                {DIFFICULTIES.map(difficulty => (
                        <option key={difficulty} value={difficulty}>{difficulty}</option>
                ))}
            </select>
        </div>
    );
};

export default DifficultySelector;

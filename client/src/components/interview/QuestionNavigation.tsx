import type { QuestionNavigationProps } from '../../types/types.js';
import Button from '../ui/Button.jsx';

const QuestionNavigation = ({
    qtnsCount,
    currentPosition,
    onQtnClick,
}: QuestionNavigationProps) => {
    const btnNumbersArray = new Array(qtnsCount)
                                    .fill(null)
                                    .map((_, index) => index + 1);
    return (
        <div className='flex flex-col gap-2 p-4 bg-white rounded-2xl border border-border h-fit'>
            <p className='text-sm font-medium text-muted mb-1'>Questions</p>
            <div className='flex flex-wrap gap-2'>
                {btnNumbersArray.map((position) => (
                    <Button
                        key={position}
                        type='button'
                        variant={currentPosition === position ? 'primary' : 'ghost'}
                        className='h-10 w-10 rounded-xl'
                        onClick={() => onQtnClick(position)}
                    >
                        {position}
                    </Button>
                ))}
            </div>
        </div>
    );
};

export default QuestionNavigation;

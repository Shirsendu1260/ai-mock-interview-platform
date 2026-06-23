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
        <div className='flex flex-wrap gap-3'>
            {btnNumbersArray.map((position) => (
                <Button
                    key={position}
                    type='button'
                    variant={currentPosition === position ? 'primary' : 'ghost'}
                    className='h-11 w-11 rounded-2xl'
                    onClick={() => onQtnClick(position)}
                >
                    {position}
                </Button>
            ))}
        </div>
    );
};

export default QuestionNavigation;

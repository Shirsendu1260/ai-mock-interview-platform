import { RiCopperCoinFill } from "react-icons/ri";
import type { CreditCostCardProps } from "../../types/types.js";

const CreditCostCard = ({ interviewCost }: CreditCostCardProps) => {
    return (
        <div className='rounded-xl mt-2 border border-accent/30 bg-accent/5 p-6'>
            <h3 className='font-semibold text-dark'>Interview Cost</h3>
            <div className='mt-2 flex items-center gap-2'>
                <RiCopperCoinFill size={22} className='text-yellow-400' />
                <p className='text-lg font-medium text-dark'>{interviewCost} Credits</p>
            </div>
            <p className='mt-2 text-sm text-muted'>
                Cost depends on selected difficulty and question count.
            </p>
        </div>
    );
};

export default CreditCostCard;

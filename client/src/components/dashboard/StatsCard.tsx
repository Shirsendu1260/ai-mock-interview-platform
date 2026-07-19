import Card from '../ui/Card.jsx';
import type { StatsCardProps } from '../../types/types.js';

// For showing stats such as credits, interviews created etc. 
const StatsCard = ({ title, value, scoreColor }: StatsCardProps) => {
	return (
		<Card className='max-w-full p-6'>
			<p className='text-sm text-muted'>
				{title}
			</p>
			<h3 className='mt-2 text-4xl font-bold text-dark' style={{ color: scoreColor }} >
				{value}
			</h3>
		</Card>
	);
};

export default StatsCard;

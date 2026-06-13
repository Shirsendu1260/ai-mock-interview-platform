import { RiRobot2Fill } from "react-icons/ri";
import Card from '../ui/Card.jsx';
import { useAuthStore } from '../../stores/auth.store.js';

const DashboardWelcomeCard = () => {
	const user = useAuthStore(state => state.user);

	return (
		<Card className='max-w-full'>
			<div className='flex items-center justify-between gap-5'>
				<div>
					<h1 className='text-3xl font-bold text-dark'>
						Welcome back,
						<span className='text-accent'>{' '}{user?.fullName}</span>
					</h1>
					<p className='mt-3 text-muted'>
						Continue improving your interview skills with AI.
					</p>
				</div>

				<div className='hidden rounded-3xl bg-accent p-4 text-white md:block'>
					<RiRobot2Fill size={31} />
				</div>
			</div>
		</Card>
	);
};

export default DashboardWelcomeCard;
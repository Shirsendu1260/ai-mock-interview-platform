import { motion } from 'motion/react';
import {
	FaPlusCircle,
	FaHistory,
	FaUser
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Card from '../ui/Card.jsx';

const actions = [
	{
		id: 1,
		icon: FaPlusCircle,
		title: 'New Interview',
		description: 'Create a new mock interview.',
		link: '/dashboard/interviews/create'
	},
	{
		id: 2,
		icon: FaHistory,
		title: 'History',
		description: 'View previous interviews.',
		link: '/dashboard/interviews/history'
	},
	{
		id: 3,
		icon: FaUser,
		title: 'Profile',
		description: 'Manage your account.',
		link: '/dashboard/user/profile'
	}
];

const QuickActions = () => {
	return (
		<div className='grid gap-5 md:grid-cols-3'>
			{
				actions.map(action => {
					const Icon = action.icon;

					return (
						<motion.div
							key={action.id}
							whileHover={{ y: -3 }}
						>
							<Link to={action.link}>
								<Card className='max-w-full p-6'>
									<div className='space-y-4'>
										<div
											className='
											flex h-14 w-14 items-center justify-center 
											rounded-2xl border border-border bg-background shadow-sm
											text-accent'
										>
											<Icon size={22} />
										</div>

										<div>
											<h3 className='font-semibold text-dark'>
												{action.title}
											</h3>
											<p className='mt-2 text-sm text-muted'>
												{action.description}
											</p>
										</div>
									</div>
								</Card>
							</Link>
						</motion.div>
					);
				})
			}
		</div>
	);
};

export default QuickActions;

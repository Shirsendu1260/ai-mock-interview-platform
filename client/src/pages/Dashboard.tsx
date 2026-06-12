import DashboardWelcomeCard from '../components/dashboard/DashboardWelcomeCard.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import RecentInterviews from '../components/dashboard/RecentInterviews.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import { useAuthStore } from '../stores/auth.store.js';

const Dashboard = () => {
	const user = useAuthStore(state => state.user);

	return (
		<div className='space-y-7'>
			<DashboardWelcomeCard/>
			
			<div className='grid gap-5 md:grid-cols-2'>
				<StatsCard title='Credits' value={user?.credit ?? 0} />
				<StatsCard title='Interviews Created' value={0} />
			</div>

			<QuickActions/>
			<RecentInterviews/>
		</div>
	)
}

export default Dashboard
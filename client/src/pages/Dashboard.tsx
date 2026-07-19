import { useEffect, useState } from 'react';
import DashboardWelcomeCard from '../components/dashboard/DashboardWelcomeCard.jsx';
import QuickActions from '../components/dashboard/QuickActions.jsx';
import RecentInterviews from '../components/dashboard/RecentInterviews.jsx';
import StatsCard from '../components/dashboard/StatsCard.jsx';
import { useAuthStore } from '../stores/auth.store.js';
import { getDashboardStats } from '../api/dashboard.api.js';
import { ApiError } from '../utils/ApiError.js';
import { showErrorToast } from '../utils/toast.js';
import Spinner from '../components/ui/Spinner.js';
import { getPerformance } from '../utils/helpers.js';

const Dashboard = () => {
	const user = useAuthStore(state => state.user);

	// states for statisics
	const [totalInterviews, setTotalInterviews] = useState(0);
	const [completedInterviews, setCompletedInterviews] = useState(0);
	const [avgScore, setAvgScore] = useState(0);
	const [bestScore, setBestScore] = useState(0);

	const [isLoading, setIsLoading] = useState(true);


	// fetch stats
	useEffect(() => {
		const loadStats = async () => {
			try {
				const response = await getDashboardStats();
				setTotalInterviews(response.data.data.totalInterviews);
				setCompletedInterviews(response.data.data.completedInterviews);
				setAvgScore(response.data.data.avgScore);
				setBestScore(response.data.data.bestScore);
			}
			catch(error) {
				if(error instanceof ApiError) {
	                showErrorToast(error.message);
	            }
	            else {
	                showErrorToast('Failed to load dashboard statisics.');
	            }
			}
			finally {
				setIsLoading(false);
			}
		};

		loadStats();
	}, []);


	// Show loader until stats load
	if(isLoading) {
        return (
            <div className="flex min-h-[50vh] items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }


	return (
		<div className='space-y-6'>
			<DashboardWelcomeCard/>
			
			<div className='grid gap-6 sm:grid-cols-2 xl:grid-cols-3'>
				<StatsCard title='Credits' value={user?.credit ?? 0} />
				<StatsCard title='Interviews Created' value={totalInterviews} />
				<StatsCard title='Completed Interviews' value={completedInterviews} />
				<StatsCard title='Average Score' value={avgScore} scoreColor={getPerformance(avgScore).color} />
				<StatsCard title='Best Score' value={bestScore} scoreColor={getPerformance(bestScore).color} />
			</div>

			<QuickActions/>
			<RecentInterviews/>
		</div>
	)
}

export default Dashboard

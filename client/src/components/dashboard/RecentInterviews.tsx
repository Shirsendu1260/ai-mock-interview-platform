import EmptyState from '../ui/EmptyState.jsx';
import { FaHistory } from 'react-icons/fa';

const RecentInterviews = () => {
	return (
		<EmptyState
			title='No interviews yet'
			description='Start your first interview to see your interview history.'
			icon={<FaHistory size={36} />}
		/>
	);
};

export default RecentInterviews;
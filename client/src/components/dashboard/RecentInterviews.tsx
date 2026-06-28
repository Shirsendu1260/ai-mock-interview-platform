import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { FaArrowRight, FaHistory } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import SectionHeading from '../ui/SectionHeading.jsx';
import EmptyState from '../ui/EmptyState.jsx';
import Spinner from '../ui/Spinner.jsx';
import Button from '../ui/Button.jsx';
import { getRecentInterviewsHandler } from '../../handlers/dashboard.handler.js';
import { showErrorToast } from '../../utils/toast.js';
import { ApiError } from '../../utils/ApiError.js';
import type { IInterviewHistory } from '../../types/types.js';
import InterviewHistoryCard from '../interview/InterviewHistoryCard.js';

const RecentInterviews = () => {
    const navigate = useNavigate();

    const [interviews, setInterviews] = useState<IInterviewHistory[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const loadRecentInterviews = async () => {
        try {
            const response = await getRecentInterviewsHandler();
            setInterviews(response.data);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to load recent interviews.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };


    useEffect(() => {
        loadRecentInterviews();
    }, []);


    if(isLoading) {
        return (
            <div className="py-10 flex justify-center">
                <Spinner />
            </div>
        );
    }


    if(interviews.length === 0) {
        return (
            <EmptyState
                title="No interviews yet"
                description="Start your first interview to see your interview history."
                icon={<FaHistory size={36}/>}
            />
        );
    }


    return (
        <>
            <SectionHeading description="Review your latest interview performances." >
                Recent Interviews
            </SectionHeading>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="mt-8 grid gap-6 sm:grid-cols-2"
            >
                {
                    interviews.map((interview, index) => (
                        <InterviewHistoryCard
                            key={interview.id}
                            interview={interview}
                            index={index}
                        />
                    ))
                }
            </motion.div>

            <div className="mt-10 flex justify-center">
                <Button onClick={() => navigate('/dashboard/interviews/history')} >
                    See All
                    <FaArrowRight />
                </Button>
            </div>
        </>
    );
};

export default RecentInterviews;

import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import NotFound from './NotFound.jsx';
import { getInterviewResultHandler } from '../handlers/interview.handler.js';
import type { IInterviewResult } from '../types/types.js';
import { ApiError } from '../utils/ApiError.js';
import { showErrorToast } from '../utils/toast.js';
import { LAYOUT } from '../constants/design.js';

const InterviewResult = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [result, setResult] = useState<IInterviewResult | null>(null);
    const [isLoading, setIsLoading] = useState(true);


    // Fetch interview result
    useEffect(() => {
        const loadInterviewResult = async () => {
            if(!interviewId) {
                setIsLoading(false);
                return;
            }

            try {
                const response = await getInterviewResultHandler(interviewId);
                setResult(response.data);
            }
            catch(error) {
                if(error instanceof ApiError) {
                    showErrorToast(error.message);
                }
                else {
                    showErrorToast('Failed to load interview result.');
                }

                navigate('/dashboard/interviews/history');
            }
            finally {
                setIsLoading(false);
            }
        };

        loadInterviewResult();
    }, [interviewId]);


    // Loading state
    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size="lg"/>
            </PageContainer>
        );
    }


    // Null safety
    if(!result) {
        return <NotFound/>;
    }


    return (
        <PageContainer>
            <div className={`mx-auto w-full ${LAYOUT.maxWidth} space-y-6`} >
                {/*Overall score*/}

                {/*Overall feedback*/}

                {/*Question-wise results*/}
            </div>
        </PageContainer>
    );
};

export default InterviewResult;

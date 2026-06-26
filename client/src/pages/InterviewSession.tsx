import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import PageContainer from '../components/ui/PageContainer.jsx';
import Card from '../components/ui/Card.jsx';
import Spinner from '../components/ui/Spinner.jsx';
import Button from '../components/ui/Button.jsx';
import InterviewInfoCard from '../components/interview/InterviewInfoCard.jsx';
import QuestionCard from '../components/interview/QuestionCard.jsx';
import QuestionNavigation from '../components/interview/QuestionNavigation.jsx';
import {
    getInterviewHandler,
    getInterviewQuestionHandler,
    saveInterviewAnswerHandler,
    submitInterviewHandler
} from '../handlers/interview.handler.js';
import type { IInterview, IInterviewQuestion } from '../types/types.js';
import { ApiError } from '../utils/ApiError.js';
import { showErrorToast, showLoadingToast, showSuccessToastWithToastId } from '../utils/toast.js';
import { LAYOUT } from '../constants/design.js';
import { formatRemainingTime, speakQuestion, stopSpeaking } from '../utils/helpers.js';
import NotFound from './NotFound.jsx';
import ResponseCard from '../components/interview/ResponseCard.jsx';
import InterviewTimerCard from '../components/interview/InterviewTimerCard.jsx';

const InterviewSession = () => {
    const { interviewId } = useParams();
    const navigate = useNavigate();

    const [interview, setInterview] = useState<IInterview | null>(null);
    const [qtn, setQtn] = useState<IInterviewQuestion | null>(null);
    const [currentPosition, setCurrentPosition] = useState(1);
    const [ans, setAns] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [isChangingQtn, setIsChangingQtn] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [remainingTime, setRemainingTime] = useState(0); // in seconds


    // get and set interview object
    const loadInterview = async () => {
        if(!interviewId) return;

        try {
            const response = await getInterviewHandler(interviewId);
            const interviewData = response.data;
            setInterview(interviewData);
            setRemainingTime(interviewData.remainingTimeInSeconds);
            setCurrentPosition(interviewData.lastVisitedQtnPosition);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to load interview.');
            }

            navigate('/dashboard');
        }
    };


    // get and set question object
    const loadQtn = async (position: number) => {
        if(!interviewId) return;

        try {
            setIsChangingQtn(true);
            const response = await getInterviewQuestionHandler(interviewId, position);
            const questionData = response.data;
            setQtn(questionData);
            setAns(questionData.answer ?? '');

            // Read the interview question aloud
            speakQuestion(questionData.question);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to load this interview question.');
            }
        }
        finally {
            setIsChangingQtn(false);
        }
    };


    // Load the interview for the very first time
    useEffect(() => {
        const initializeInterview = async () => {
            try {
                await loadInterview();
            }
            catch(error) {
                if(error instanceof ApiError) {
                    showErrorToast(error.message);
                }
                else {
                    showErrorToast('Failed to load interview.');
                }
            }
            finally {
                setIsLoading(false);
            }
        };

        initializeInterview();
    }, []);


    // Load question when position number changes
    useEffect(() => {
        if(!interview) return;
        loadQtn(currentPosition);
    }, [currentPosition, interview]);


    // Save answer to db
    const saveCurrentAns = async () => {
        if(!interviewId || !qtn) return;
        await saveInterviewAnswerHandler(interviewId, qtn.position, ans);
    };


    // For handling 'Back' button
    const handlePreviousQtn = async () => {
        if(!interview) return;
        if(currentPosition <= 1) return;

        try {
            // Stop speaking before navigation
            stopSpeaking();

            await saveCurrentAns();
            setCurrentPosition(prev => prev - 1);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to load the previous question.');
            }
        }
    };


    // For handling 'Next' button
    const handleNextQtn = async () => {
        if(!interview) return;
        if(currentPosition >= interview.qtnsCount) return;

        try {
            // Stop speaking before navigation
            stopSpeaking();

            await saveCurrentAns();
            setCurrentPosition(prev => prev + 1);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to load the next question.');
            }
        }
    };


    // For handling numbered buttons for questions
    // This ensures answer is never lost when jumping directly from Question 1 to 9
    const handleQtnNavigation = async (position: number) => {
        if(!interview) return;
        if(position === currentPosition) return;

        try {
            // Stop speaking before navigation
            stopSpeaking();

            await saveCurrentAns();
            setCurrentPosition(position);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast(`Failed to load the question number ${position}.`);
            }
        }
    };


    // For submitting interview (answer already saved in db when the submit button is clicked)
    const handleSubmitInterview = async () => {
        if(!interviewId) return;
        if(isSubmitting) return;

        const toastId = showLoadingToast('Submitting interview...');

        try {
            // Stop speaking after submission
            stopSpeaking();

            setIsSubmitting(true);
            await saveCurrentAns(); // Saves the current selected question's answer (empty or non-empty)
            const response = await submitInterviewHandler(interviewId);
            showSuccessToastWithToastId('Interview submitted successfully.', toastId);
            navigate(`/dashboard/interviews/${response.data.interviewId}/result`);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Failed to submit the interview.');
            }
        }
        finally {
            setIsSubmitting(false);
        }
    };


    // Stop speaking question when component unmounts
    useEffect(() => {
        return () => stopSpeaking();
    }, []);


    // Countdown timer: decreases every second and stops at 0
    useEffect(() => {
        // Stop timer when remaining time runs out
        if(remainingTime <= 0) return;

        const intervalId = setInterval(() => {
            setRemainingTime(prev => prev - 1); // Decreases time by 1 per second
        }, 1000);

        // Cleanup interval to prevent memory leak
        return () => clearInterval(intervalId);
    }, [remainingTime]);


    // For auto submitting when timer reaches 0
    useEffect(() => {
        // If timer is not 0 yet, do nothing
        if(remainingTime > 0) return;

        // If already submission is ongoing, do nothing
        if(isSubmitting) return;

        // Timer hits 0, force submit automatically
        handleSubmitInterview();
    }, [remainingTime, isSubmitting]);


    // Show loading
    if(isLoading) {
        return (
            <PageContainer>
                <Spinner size='lg' />
            </PageContainer>
        );
    }


    // for null safety
    if(!interview || !qtn) {
        return <NotFound/>;
    }


    return (
        <PageContainer>
            <div className={`w-full ${LAYOUT.maxWidth} space-y-6`}>
                <InterviewInfoCard
                    role={interview.role}
                    difficulty={interview.difficulty}
                    qtnsCount={interview.qtnsCount}
                    currentPosition={currentPosition}
                />

                {/*Countdown timer*/}
                <InterviewTimerCard
                    remainingTime={formatRemainingTime(remainingTime)}
                />

                <div className='grid gap-6 lg:grid-cols-[280px_1fr]'>
                    <QuestionNavigation
                        qtnsCount={interview.qtnsCount}
                        currentPosition={currentPosition}
                        onQtnClick={handleQtnNavigation}
                    />

                    <Card className='max-w-full'>
                        {
                            isChangingQtn
                            ? (
                                <div className='py-10 flex justify-center'>
                                    <Spinner />
                                </div>
                            )
                            : (
                                <>
                                    <QuestionCard
                                        position={qtn.position}
                                        question={qtn.question}
                                        onReplay={() => speakQuestion(qtn.question)}
                                        onStop={() => stopSpeaking()}
                                    />

                                    <div className='mt-6'>
                                        <ResponseCard ans={ans} onAnsChange={setAns} />
                                    </div>

                                    <div className='mt-8 flex flex-col gap-3 sm:flex-row sm:justify-between'>
                                        <Button
                                            variant='ghost'
                                            type='button'
                                            onClick={handlePreviousQtn}
                                            disabled={currentPosition === 1}
                                            className='sm:w-40'
                                        >
                                            Back
                                        </Button>

                                        {
                                            currentPosition < interview.qtnsCount
                                            && (
                                                <Button
                                                    type='button'
                                                    onClick={handleNextQtn}
                                                    className='sm:w-40'
                                                >
                                                    Continue
                                                </Button>
                                            )
                                        }
                                    </div>

                                    <Button
                                        type='button'
                                        className='sm:w-48'
                                        isLoading={isSubmitting}
                                        onClick={handleSubmitInterview}
                                    >
                                        Finish Interview
                                    </Button>
                                </>
                            )
                        }
                    </Card>
                </div>
            </div>
        </PageContainer>
    );
};

export default InterviewSession;

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
import { FaCheckCircle, FaTimesCircle, FaLightbulb, FaHistory } from 'react-icons/fa';
import SectionHeading from '../components/ui/SectionHeading.jsx';
import Card from '../components/ui/Card.jsx';
import QuestionScoreChart from '../components/interview/QuestionScoreChart.jsx';
import QuestionResultCard from '../components/interview/QuestionResultCard.jsx';
import { motion } from 'motion/react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { getPerformance } from '../utils/helpers.js';
import Button from '../components/ui/Button.js';
import { GoHomeFill } from 'react-icons/go';


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


    // Prepare score data of questions for chart
    const qtnChartData = result.questionResults.map(qtn => ({
        question: `Q${qtn.position}`,
        score: qtn.score ?? 0
    }));


    const performance = getPerformance(result.overallFeedback.overallScore);


    return (
        <PageContainer>
            <div className={`space-y-8 ${LAYOUT.maxWidth}`}>
                <SectionHeading description="AI evaluated every answer individually." >
                    Interview Result
                </SectionHeading>

                <Card className="text-center">
                    <p className="text-sm text-muted">Overall Score</p>
                    <h2 className="mt-2 text-6xl font-bold text-accent">
                        {result.overallFeedback.overallScore}
                        <span className="text-3xl">/100</span>
                    </h2>
                </Card>

                {/*Feedback*/}
                <div className="grid gap-6 lg:grid-cols-3">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card>
                            <div className="flex items-center gap-3">
                                <FaCheckCircle className="text-2xl text-green-600" />
                                <h3 className="text-lg font-semibold">Strengths</h3>
                            </div>

                            <p className="mt-4 text-muted leading-7">
                                {result.overallFeedback.strengths}
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card>
                            <div className="flex items-center gap-3">
                                <FaTimesCircle className="text-2xl text-red-500" />
                                <h3 className="text-lg font-semibold">Weaknesses</h3>
                            </div>

                            <p className="mt-4 text-muted leading-7">
                                {result.overallFeedback.weaknesses}
                            </p>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.4 }}
                    >
                        <Card>
                            <div className="flex items-center gap-3">
                                <FaLightbulb className="text-2xl text-yellow-500" />
                                <h3 className="text-lg font-semibold">Suggestions</h3>
                            </div>

                            <p className="mt-4 text-muted leading-7">
                                {result.overallFeedback.suggestions}
                            </p>
                        </Card>
                    </motion.div>
                </div>

                {/*Overall feedback*/}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.45 }}
                >
                    <Card>
                        <h2 className="text-xl font-semibold text-dark">Interview Performance</h2>
                        <div className="mt-8 flex flex-col items-center gap-6 lg:flex-row">
                            <div className="h-44 w-44">
                                <CircularProgressbar
                                    value={result.overallFeedback.overallScore}
                                    text={`${result.overallFeedback.overallScore}`}
                                    styles={buildStyles({
                                        pathColor: performance.color,
                                        textColor: "#111827",
                                        trailColor: "#E5E7EB",
                                        textSize: "20px",
                                        strokeLinecap: "round"
                                    })}
                                />
                            </div>

                            <div className="flex-1">
                                <h3 className="text-3xl font-bold" style={{ color: performance.color }} >
                                    {performance.title}
                                </h3>
                                <p className="mt-3 text-muted leading-7">
                                    {result.overallFeedback.overallFeedback}
                                </p>
                            </div>
                        </div>
                    </Card>
                </motion.div>

                {/*Bar chart for question scores*/}
                <Card>
                    <h3 className="mb-6 text-xl font-semibold">Question-wise Performance</h3>

                    <QuestionScoreChart qtnData={qtnChartData} />

                    {/*Individual question results*/}
                    <div className="space-y-6">
                        <SectionHeading description="Detailed feedback for every interview question.">
                            Question Analysis
                        </SectionHeading>

                        {
                            result.questionResults.map((qtnResult) => (
                                <motion.div
                                    key={qtnResult.position}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: qtnResult.position * 0.06345 }}
                                >
                                    <QuestionResultCard
                                        key={qtnResult.position}
                                        qtnResult={qtnResult}
                                    />
                                </motion.div>
                            ))
                        }
                    </div>
                </Card>

                <div className="mt-10 flex flex-wrap justify-center gap-4">
                    <Button onClick={() => navigate('/dashboard')}>
                        <GoHomeFill className="text-lg" />
                        Dashboard
                    </Button>

                    <Button
                        variant="secondary"
                        onClick={() => navigate('/dashboard/interviews/history')}
                    >
                        <FaHistory className="text-base" />
                        Interview History
                    </Button>
                </div>
            </div>
        </PageContainer>
    );
};

export default InterviewResult;

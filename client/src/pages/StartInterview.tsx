import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Input from "../components/ui/Input.jsx";
import RoleSelector from '../components/interview/RoleSelector.jsx';
import DifficultySelector from '../components/interview/DifficultySelector.jsx';
import NoOfQtnsSelector from '../components/interview/NoOfQtnsSelector.jsx';
import ResumeUploader from '../components/interview/ResumeUploader.jsx';
import CreditCostCard from '../components/interview/CreditCostCard.jsx';
import { useState } from "react";
import type { Difficulty, IErrorMessage, QuestionsCount } from "../types/types.js";
import { CREDIT_COST } from "../constants/interview.js";
import Button from "../components/ui/Button.jsx";
import { createInterviewHandler } from "../handlers/interview.handler.js";
import { useNavigate } from "react-router-dom";
import { ApiError } from "../utils/ApiError.js";
import { showErrorToastWithToastId, showLoadingToast, showSuccessToastWithToastId } from "../utils/toast.js";

// This page will show the form and ask for required informations from user to start the interview
const StartInterview = () => {
    const [role, setRole] = useState('');
    const [yoe, setYoe] = useState<number | ''>('');
    const [difficultyState, setDifficultyState] = useState<Difficulty | ''>('');
    const [qtnsCount, setQtnsCount] = useState<QuestionsCount | 0>(0);

    // State to store uploaded pdf file
    const [resumePdfFile, setResumePdfFile] = useState<File | null>(null); // resumePdfFile: File | null

    const [errors, setErrors] = useState<IErrorMessage>({});
    // errors = {
    //     role: "Role is required.",
    //     yoe: "Years of experience is required.",
    //     difficulty: "Difficulty is required.",
    //     questionsCount: "Please select number of questions."
    // }

    const [isSubmitting, setIsSubmitting] = useState(false);

    const navigate = useNavigate();

    // Calculate interview cost
    const interviewCost = difficultyState && qtnsCount ? CREDIT_COST[difficultyState] * qtnsCount : 0;

    const handleStartInterview = async (event: React.FormEvent<HTMLFormElement>): Promise<void> => {
        event.preventDefault();
        setIsSubmitting(true);
        setErrors({}); // Clears old errors displayed in HTML
        const toastId = showLoadingToast('Creating interview...');

        try {
            // Create form data (not JSON, because it cannot send file to backend, so we used multipart/form-data)
            const formData = new FormData();
            if(role !== "") formData.append('role', role);
            if(yoe !== "") formData.append("yoe", String(yoe));
            if(difficultyState) formData.append("difficulty", difficultyState);
            if(qtnsCount) formData.append("qtnsCount", String(qtnsCount));
            if(resumePdfFile) formData.append('resume', resumePdfFile);

            // Send data to backend
            const response = await createInterviewHandler(formData);
            // {
            //     "success": true,
            //     "statusCode": 201,
            //     "message": "Interview created successfully.",
            //     "data": {
            //         "id": 15
            //     }
            // }

            showSuccessToastWithToastId('Interview created!', toastId);
            navigate(`/dashboard/interviews/${response.data.id}/session`);
        }
        catch(error) {
            // {
            //     "success": false,
            //     "statusCode": 400,
            //     "message": "Validation failed",
            //     "errors": {
            //          "role": "Role is required.",
            //          "yoe": "Years of experience is required.",
            //          "difficulty": "Difficulty is required.",
            //          "questionsCount": "Please select number of questions."
            //     }
            // }

            if(error instanceof ApiError) {
                setErrors(error.errors);
                showErrorToastWithToastId(error.message, toastId);
                console.error(`Error ${error.statusCode}: ${error.message}`);
            }
            else {
                showErrorToastWithToastId('Failed to create interview.', toastId);
                console.error(error);
            }

        }
        finally {
            setIsSubmitting(false);
        }
    };

    return (
        <PageContainer>
            <div className='mx-auto max-w-4xl'>
                <SectionHeading
                    description='Configure your interview settings and upload your resume.'
                >
                    Start Interview
                </SectionHeading>

                <Card className='mt-8 max-w-full'>
                    <form className='space-y-6' onSubmit={handleStartInterview} >
                        <div className="grid md:grid-cols-2 gap-5">
                            <RoleSelector
                                role={role}
                                setRole={setRole}
                                error={errors.role}
                                setErrors={setErrors}
                            />

                            <Input
                                id='yoe-input'
                                label='Years of Experience'
                                type='number'
                                min='0'
                                step='0.1'
                                placeholder='Example: 1.5'
                                value={yoe}
                                onChange={(event) => {
                                    setYoe(event.target.value === '' ? '' : Number(event.target.value));
                                    setErrors(prev => ({ ...prev, yoe: '' }));
                                }}
                                error={errors.yoe}
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-5">
                            <DifficultySelector
                                difficulty={difficultyState}
                                setDifficulty={setDifficultyState}
                                error={errors.difficulty}
                                setErrors={setErrors}
                            />
                            <NoOfQtnsSelector
                                qtnsCount={qtnsCount}
                                setQtnsCount={setQtnsCount}
                                error={errors.qtnsCount}
                                setErrors={setErrors}
                            />
                        </div>

                        <ResumeUploader
                            resumePdfFile={resumePdfFile}
                            setResumePdfFile={setResumePdfFile}
                            error={errors.resume}
                            setErrors={setErrors}
                        />

                        <CreditCostCard interviewCost={interviewCost} />

                        <Button type='submit' className='w-full' isLoading={isSubmitting} >
                            Start Interview
                        </Button>
                    </form>
                </Card>
            </div>
        </PageContainer>
    );
};

export default StartInterview;

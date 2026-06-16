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

    // Calculate interview cost
    const interviewCost = difficultyState && qtnsCount ? CREDIT_COST[difficultyState] * qtnsCount : 0;

    return (
        <PageContainer>
            <div className='mx-auto max-w-4xl'>
                <SectionHeading
                    description='Configure your interview settings and upload your resume.'
                >
                    Start Interview
                </SectionHeading>

                <Card className='mt-8 max-w-full space-y-6'>
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
                            error={errors.questionsCount}
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
                </Card>
            </div>
        </PageContainer>
    );
};

export default StartInterview;

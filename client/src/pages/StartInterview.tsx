import Card from "../components/ui/Card.jsx";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import Input from "../components/ui/Input.jsx";
import RoleSelector from '../components/interview/RoleSelector.jsx';
import DifficultySelector from '../components/interview/DifficultySelector.jsx';
import NoOfQtnsSelector from '../components/interview/NoOfQtnsSelector.jsx';
import ResumeUploader from '../components/interview/ResumeUploader.jsx';
import CreditCostCard from '../components/interview/CreditCostCard.jsx';

// This page will show the form and ask for required informations from user to start the interview
const StartInterview = () => {
    return (
        <PageContainer>
            <div className='mx-auto max-w-3xl'>
                <SectionHeading
                    description='Configure your interview settings and upload your resume.'
                >
                    Start Interview
                </SectionHeading>

                <Card className='mt-8 max-w-full space-y-6'>
                    <RoleSelector/>

                    <Input
                        id='yoe-input'
                        label='Years of Experience'
                        type='number'
                        min='0'
                        step='0.1'
                        placeholder='Example: 1.5'
                    />

                    <DifficultySelector/>
                    <NoOfQtnsSelector/>
                    <ResumeUploader/>
                    <CreditCostCard/>
                </Card>
            </div>
        </PageContainer>
    );
};

export default StartInterview;

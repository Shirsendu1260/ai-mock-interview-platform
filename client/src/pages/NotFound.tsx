import { useNavigate } from 'react-router-dom';
import EmptyState from '../components/ui/EmptyState.jsx';
import PageContainer from '../components/ui/PageContainer.jsx';
import Button from '../components/ui/Button.jsx';
import { TbError404 } from 'react-icons/tb';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <PageContainer>
            <div className='w-full max-w-xl'>
                <EmptyState
                    title='Page Not Found'
                    description='The page you are looking for does not exist or may have been removed.'
                    action={
                        <Button
                            className='rounded-xl bg-accent px-4 py-2 font-medium text-white'
                            onClick={() => navigate('/')}
                        >
                            Go Home
                        </Button>
                    }
                    icon={<TbError404 size={40} />}
                />
            </div>
        </PageContainer>
    );
};

export default NotFound;

import { motion } from 'motion/react';
import {
	FaComments,
	FaRobot,
	FaSignInAlt
} from 'react-icons/fa';
import Card from '../ui/Card.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { LAYOUT } from '../../constants/design.js';

// This section answers - "How does this platform work?"
const steps = [
	{
		id: 1,
		icon: FaSignInAlt,
		title: 'Sign In',
		description: 'Securely authenticate using your Google or GitHub account.'
	},
	{
		id: 2,
		icon: FaComments,
		title: 'Start Interview',
		description: 'Upload your resume, enter role you want to be interviewed for, and begin practicing with AI-powered questions.'
	},
	{
		id: 3,
		icon: FaRobot,
		title: 'Get AI Feedback',
		description: 'Receive intelligent analysis and improve your interview skills.'
	}
];

const HowItWorksSection = () => {
	return (
		<section className={`bg-white ${LAYOUT.paddingY}`}>
			<PageContainer>
				<SectionHeading
					description='Three simple steps to prepare for your dream job.'
				>
					How It Works
				</SectionHeading>

				<div className='mt-12 grid gap-8 md:grid-cols-3'>
					{
						steps.map((step) => {
							const Icon = step.icon;

							return (
								<motion.div
									key={step.id}
									initial={{ opacity: 0, y: 30 }} 
									whileInView={{ opacity: 1, y: 0 }} 
									viewport={{ once: true }} 
									transition={{ delay: step.id * 0.15, duration: 0.5 }}
								>
									<Card className='relative h-full'>
										{/* Step Number */}
										<div
											className='
												mb-6 flex h-12 w-12
												items-center justify-center rounded-full
												bg-accent font-bold text-white
											'
										>
											{step.id}
										</div>

										<div className='mb-5 text-4xl text-primary'>
											<Icon />
										</div>

										<h3 className='mb-3 text-xl font-semibold'>
											{step.title}
										</h3>

										<p className='leading-7 text-muted'>
											{step.description}
										</p>
									</Card>
								</motion.div>
							);
						})
					}
				</div>
			</PageContainer>
		</section>
	);
};

export default HowItWorksSection;
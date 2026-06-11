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

const steps = [
	{
		id: 1,
		icon: FaSignInAlt,
		title: 'Sign In',
		description: 'Authenticate securely using your Google or GitHub account.'
	},
	{
		id: 2,
		icon: FaComments,
		title: 'Start Interview',
		description: 'Choose role, upload your resume, and begin answering AI-generated interview questions.'
	},
	{
		id: 3,
		icon: FaRobot,
		title: 'Receive Feedback',
		description: 'Get intelligent feedback and improve your interview performance.'
	}
];

const HowItWorksSection = () => {
	return (
		<section className={`border-t border-b border-border ${LAYOUT.paddingY}`}>
			<PageContainer>
				<SectionHeading
					description='Three simple steps to prepare for your dream role.'
				>
					How It Works
				</SectionHeading>

				<div className='mt-12 mx-auto grid max-w-5xl gap-6 md:grid-cols-3'>
					{
						steps.map((step) => {
							const Icon = step.icon;

							return (
								<motion.div
									key={step.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.45,
										delay: step.id * 0.15
									}}
								>
									<Card className='h-full p-7'>
										<div
											className='
												flex h-11 w-11 items-center justify-center mb-5
												rounded-3xl bg-accent font-semibold text-white
											'
										>
											{step.id}
										</div>

										<div className='mb-3 flex items-center gap-4'>
											<div className='text-2xl text-primary'>
												<Icon />
											</div>
											<h3 className='text-lg font-semibold'>
												{step.title}
											</h3>
										</div>

										<p className='text-sm leading-7 text-muted'>
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
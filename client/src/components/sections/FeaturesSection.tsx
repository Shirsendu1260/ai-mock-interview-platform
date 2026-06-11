import { motion } from 'motion/react';
import {
	FaBrain,
	FaChartLine,
	FaLaptopCode
} from 'react-icons/fa';

import Card from '../ui/Card.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import SectionHeading from '../ui/SectionHeading.jsx';
import { LAYOUT } from '../../constants/design.js';

// This section shows key features of this platform
// Each object represents one feature card
const features = [
	{
		id: 1,
		icon: FaBrain,
		title: 'AI Feedback',
		description: 'Receive intelligent feedback and detailed suggestions after every interview session.'
	},
	{
		id: 2,
		icon: FaLaptopCode,
		title: 'Real-world Questions',
		description: 'Practice with realistic software engineering interview questions.'
	},
	{
		id: 3,
		icon: FaChartLine,
		title: 'Progress Tracking',
		description: 'Monitor your growth and improve your interview performance over time.'
	}
];

const FeaturesSection = () => {
	return (
		<section className={LAYOUT.paddingY}>
			<PageContainer>
				<SectionHeading
					description='Everything you need to prepare for your next interview.'
				>
					Why Choose AI Mock Interviewer
				</SectionHeading>

				<div className='mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-3'>
					{
						features.map((feature) => {
							const Icon = feature.icon;

							return (
								<motion.div
									key={feature.id}
									initial={{ opacity: 0, y: 30 }} 
									whileInView={{ opacity: 1, y: 0 }} 
									viewport={{ once: true }} 
									transition={{ delay: step.id * 0.15, duration: 0.5 }}
								>
									<Card className='h-full'>
										<div className='space-y-5'>
											<div
												className='
													flex h-14 w-14
													items-center justify-center rounded-2xl
													bg-accent text-2xl text-white
												'
											>
												<Icon />
											</div>

											<h3 className='text-xl font-semibold'>
												{feature.title}
											</h3>

											<p className='leading-7 text-muted'>
												{feature.description}
											</p>
										</div>
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

export default FeaturesSection;
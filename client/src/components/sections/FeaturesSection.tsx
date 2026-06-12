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

const features = [
	{
		id: 1,
		icon: FaBrain,
		title: 'AI Feedback',
		description: 'Receive detailed suggestions after every interview session to identify strengths and weaknesses.'
	},
	{
		id: 2,
		icon: FaLaptopCode,
		title: 'Real-world Questions',
		description: 'Practice with software engineering interview questions similar to actual hiring rounds.'
	},
	{
		id: 3,
		icon: FaChartLine,
		title: 'Progress Tracking',
		description: 'Track your performance and continuously improve over time.'
	}
];

// This section shows key features of this platform
// Each object represents one feature card
const FeaturesSection = () => {
	return (
		<section className={`border-t border-b border-border ${LAYOUT.paddingY}`}>
			<PageContainer>
				<SectionHeading
					description='Everything you need to prepare for technical interviews.'
				>
					Why Choose Our Platform
				</SectionHeading>

				<div
					className='
						mt-12 mx-auto grid max-w-5xl gap-6 md:grid-cols-2 lg:grid-cols-3
					'
				>
					{
						features.map((feature) => {
							const Icon = feature.icon;

							return (
								<motion.div
									key={feature.id}
									initial={{ opacity: 0, y: 20 }}
									whileInView={{ opacity: 1, y: 0 }}
									viewport={{ once: true }}
									transition={{
										duration: 0.463,
										delay: feature.id * 0.2
									}}
								>
									<Card className='h-full p-7'>
										<div
											className='
												mb-5 flex h-12 w-12 items-center
												justify-center rounded-2xl bg-primary
												text-xl text-white
											'
										>
											<Icon />
										</div>

										<h3 className='mb-3 text-lg font-semibold'>
											{feature.title}
										</h3>

										<p className='text-sm leading-7 text-muted'>
											{feature.description}
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

export default FeaturesSection;
import { motion } from 'motion/react';
import {
	FaArrowRight,
	FaRobot,
	FaChartLine,
	FaComments
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import Logo from '../common/Logo.jsx';
import { LAYOUT } from '../../constants/design.js';

const HeroSection = () => {
	const heroSectionFeatures = [
		{
			id: 1,
			icon: FaComments,
			title: 'Real Questions'
		},
		{
			id: 2,
			icon: FaRobot,
			title: 'AI Feedback'
		},
		{
			id: 3,
			icon: FaChartLine,
			title: 'Track Progress'
		}
	];

	return (
		<section className={`${LAYOUT.paddingY} border-b border-border`}>
			<PageContainer>
				<div className='mx-auto max-w-5xl'>
					{/* Logo */}
					<div className='mb-8 flex justify-center'>
						<Logo size='lg' />
					</div>

					{/* Heading */}
					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.6 }}
						className='text-center'
					>
						<h1
							className='mt-8 text-4xl font-bold leading-tight text-dark md:text-6xl'
						>
							Practice Technical
							<br />
							Interviews with{' '}
							<span className='text-accent'>AI</span>
						</h1>

						<p
							className='
								mx-auto mt-6 max-w-2xl text-base
								leading-8 text-muted md:text-lg
							'
						>
							Prepare for software engineering interviews
							with realistic questions, AI feedback and
							performance tracking.
						</p>

						<div
							className='mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center'
						>
							<Link to='/dashboard'>
								<Button className='px-8 sm:w-auto'>
									Get Started <FaArrowRight />
								</Button>
							</Link>

							<Link to='/auth'>
								<Button variant='ghost' className='px-8 sm:w-auto'>
									Sign In
								</Button>
							</Link>
						</div>
					</motion.div>

					{/* Feature cards */}
					<div className='mt-14 grid gap-5 md:grid-cols-3' >
						{
							heroSectionFeatures.map((item) => {
								const Icon = item.icon;

								return (
									<motion.div
										key={item.id}
										whileHover={{ y: -4 }}
										className='
											rounded-3xl border border-border
											bg-white p-6 shadow-sm
										'
									>
										<div
											className='
												mb-4 flex h-12 w-12 items-center justify-center
												rounded-2xl bg-accent/10 text-xl text-accent
											'
										>
											<Icon />
										</div>

										<h3 className='font-semibold'>{item.title}</h3>
									</motion.div>
								);
							})
						}
					</div>
				</div>
			</PageContainer>
		</section>
	);
};

export default HeroSection;
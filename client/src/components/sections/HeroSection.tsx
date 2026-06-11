import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import Logo from '../common/Logo.jsx';
import { LAYOUT } from '../../constants/design.js';

// Hero section is the section users see first
const HeroSection = () => {
	return (
		<section className={LAYOUT.paddingY}>
			<PageContainer>
				<div className='mx-auto max-w-4xl text-center'>
					<motion.div
						initial={{ opacity: 0, y: 30 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.66 }}
					>
						<div className='mb-8 flex justify-center'>
							<Logo size="lg" />
						</div>

						<h1 className='text-4xl font-bold leading-tight text-dark md:text-6xl'>
							Practice Technical Interviews
							<span className='text-accent'>{' '}with AI</span>
						</h1>

						<p className='mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted'>
							Prepare for real-world software engineering interviews
							with intelligent AI feedback, realistic questions,
							and detailed performance analysis.
						</p>

						{/* Action buttons */}
						<div className='mt-10 flex flex-col gap-4 sm:flex-row sm:justify-center'>
							<Link to='/dashboard'>
								<Button className='sm:w-auto px-8'>
									Get Started <FaArrowRight size={18} />
								</Button>
							</Link>

							<Link to='/auth'>
								<Button variant='ghost' className='sm:w-auto px-8'>
									Sign In
								</Button>
							</Link>
						</div>
					</motion.div>
				</div>
			</PageContainer>
		</section>
	);
};

export default HeroSection;
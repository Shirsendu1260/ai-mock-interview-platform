import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';
import Button from '../ui/Button.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import { LAYOUT } from '../../constants/design.js';

const StartNow = () => {
	const navigate = useNavigate();

	return (
		<section className={LAYOUT.paddingY}>
			<PageContainer>
				<motion.div
					initial={{ opacity: 0, y: 30 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					transition={{ duration: 0.66 }}
					className='rounded-3xl bg-primary px-8 py-16 text-center text-white'
				>
					<h2 className='text-3xl font-bold md:text-4xl'>
						Ready to Ace Your Next Interview?
					</h2>

					<p className='mx-auto mt-6 max-w-2xl text-lg text-gray-200'>
						Practice with AI, improve your confidence,
						and prepare for your dream software engineering role.
					</p>

					<div className='mt-10 flex justify-center'>
						<Button
							className='w-auto bg-accent px-8'
							onClick={() => navigate('/auth')}
						>
							Get Started <FaArrowRight />
						</Button>
					</div>
				</motion.div>
			</PageContainer>
		</section>
	);
};

export default StartNow;
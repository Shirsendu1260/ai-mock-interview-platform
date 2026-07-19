import { motion } from 'motion/react';
import { FaArrowRight } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Button from '../ui/Button.jsx';
import PageContainer from '../ui/PageContainer.jsx';
import { LAYOUT } from '../../constants/design.js';

const StartNow = () => {
	const navigate = useNavigate();

	return (
		<section className={`${LAYOUT.paddingY} border-t border-border`}>
			<PageContainer>
				<motion.div
					initial={{ opacity: 0, y: 25 }}
					whileInView={{ opacity: 1, y: 0 }}
					viewport={{ once: true }}
					className='
						rounded-[2rem] border border-border bg-primary
						px-8 py-16 text-center text-white shadow-xl
					'
				>
					<h2 className='text-3xl font-bold md:text-4xl'>
						Ready To Ace Your Next Interview?
					</h2>

					<p className='mx-auto mt-5 max-w-2xl text-white/80 leading-8'>
						Practice with AI-generated interviews, receive feedback,
						and prepare with confidence for your dream software
						engineering role.
					</p>

					<div className='mt-8 flex justify-center'>
						<Button className='w-auto px-8' onClick={() => navigate('/auth')}>
							Get Started <FaArrowRight />
						</Button>
					</div>
				</motion.div>
			</PageContainer>
		</section>
	);
};

export default StartNow;

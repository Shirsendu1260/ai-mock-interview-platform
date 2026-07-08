import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { FaCalendarAlt, FaCheckCircle, FaArrowRight } from 'react-icons/fa';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import type { InterviewHistoryCardProps } from '../../types/types.js';
import { formatDate, getPerformance } from '../../utils/helpers.js';

const InterviewHistoryCard = ({ interview, index }: InterviewHistoryCardProps) => {
    const navigate = useNavigate();

    return (
        <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ type: 'spring', stiffness: 110, damping: 18, delay: index * 0.06 }}
        >
            <Card className="h-full">
                <div className="flex h-full flex-col">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-xl font-semibold text-dark">{interview.role}</h2>
                            <p className="mt-1 capitalize text-muted">
                                {interview.difficulty} &bull; {interview.qtnsCount} Questions
                            </p>
                        </div>

                        <div
                            className={`
                                rounded-2xl px-3 py-1 text-base font-semibold
                                ${getPerformance(interview.overallScore ?? 0)}
                            `}
                        >
                            {interview.overallScore ?? 0}
                        </div>
                    </div>

                    {/*Divider*/}
                    <div className="my-6 border-t border-border" />

                    <div className="space-y-3">
                        <div className="flex items-center gap-3 text-muted">
                            <FaCalendarAlt className="text-accent" />
                            <span>
                                Created on{' '}
                                <span className="font-sm text-dark">
                                    {formatDate(interview.createdAt)}
                                </span>
                            </span>
                        </div>

                        {
                            interview.completedAt &&
                            (
                                <div className="flex items-center gap-3 text-muted">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>
                                        Completed on{' '}
                                        <span className="font-sm text-dark">
                                            {formatDate(interview.completedAt)}
                                        </span>
                                    </span>
                                </div>
                            )
                        }
                    </div>

                    <div className="flex-grow" />

                    <div className="mt-8 flex flex-wrap gap-3">
                        <Button
                            variant="ghost"
                            onClick={() => navigate(`/dashboard/interviews/${interview.id}/result`)}
                        >
                            View Result
                            <FaArrowRight/>
                        </Button>
                    </div>
                </div>
            </Card>
        </motion.div>
    );
};

export default InterviewHistoryCard;

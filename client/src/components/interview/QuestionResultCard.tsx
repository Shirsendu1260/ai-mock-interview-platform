import Card from '../ui/Card.jsx';
import type { QuestionResultCardProps } from '../../types/types.js';
import { FaQuestionCircle, FaStar } from 'react-icons/fa';
import { IoChatboxEllipses } from "react-icons/io5";
import { getScoreColor } from '../../utils/helpers.js';

const QuestionResultCard = ({ qtnResult }: QuestionResultCardProps) => {
    return (
        <Card>
            <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-dark">
                    Question {String(qtnResult.position).padStart(2, '0')}
                </h3>

                <div
                    className={`
                        rounded-full px-4 py-2 text-sm font-semibold ${getScoreColor(qtnResult.score ?? 0)}
                    `}
                >
                    {qtnResult.score ?? 0}/10
                </div>
            </div>

            {/*Question*/}
            <div className="mt-8">
                <div className="flex items-center gap-2">
                    <FaQuestionCircle className="text-accent" />
                    <h4 className="font-semibold text-dark">Interview Question</h4>
                </div>

                <p className="mt-3 leading-8 text-muted">{qtnResult.question}</p>
            </div>

            {/*Answer*/}
            <div className="mt-8">
                <div className="flex items-center gap-2">
                    <IoChatboxEllipses className="text-accent" />
                    <h4 className="font-semibold text-dark">Your Answer</h4>
                </div>

                <div className="mt-3 rounded-xl border border-border bg-background p-4">
                    <p className="whitespace-pre-wrap leading-8 text-muted">
                        {
                            qtnResult.answer?.trim() || 'No answer provided.'
                        }
                    </p>
                </div>
            </div>

            {/*Feedback*/}
            <div className="mt-8">
                <div className="flex items-center gap-2">
                    <FaStar className="text-yellow-500" />
                    <h4 className="font-semibold text-dark">AI Feedback</h4>
                </div>

                <div className="mt-3 rounded-xl border border-border bg-background p-4">
                    <p className="whitespace-pre-wrap leading-8 text-muted">
                        {
                            qtnResult.feedback?.trim() || 'No feedback available.'
                        }
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default QuestionResultCard;

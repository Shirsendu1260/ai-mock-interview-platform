import type { QuestionCardProps } from "../../types/types.js";
import Card from "../ui/Card.jsx";
import { FaPlay, FaStop } from 'react-icons/fa';
import { BsRobot } from "react-icons/bs";
import Button from "../ui/Button.jsx";

const QuestionCard = ({ position, question, onReplay, onStop }: QuestionCardProps) => {
    return (
        <Card className="max-w-full">
            <div className="rounded-2xl bg-primary/10 p-5">
                <div className="flex items-center gap-3">
                    <div className="rounded-full bg-primary p-3 text-white">
                        <BsRobot size={20}/>
                    </div>

                    <div className="space-y-7">
                        <div>
                            <p className="font-semibold text-dark">AI Interviewer</p>
                            <p className="text-sm text-muted">
                                Asking Question {String(position).padStart(2, '0')}
                            </p>
                        </div>

                        <div className="flex md:flex-row gap-3">
                            <Button
                                variant="ghost"
                                type="button"
                                onClick={onReplay}
                            >
                                <FaPlay className="text-lg" />
                                Read Question
                            </Button>

                            <Button
                                variant="ghost"
                                type="button"
                                onClick={onStop}
                            >
                                <FaStop className="text-lg" />
                                Stop
                            </Button>
                        </div>
                    </div>
                </div>

                <p className="mt-4 text-lg leading-8 text-dark">{question}</p>
            </div>
        </Card>
    );
};

export default QuestionCard;

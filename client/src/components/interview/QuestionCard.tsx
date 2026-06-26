import type { QuestionCardProps } from "../../types/types.js";
import Card from "../ui/Card.jsx";
import { FaPlay, FaStop } from 'react-icons/fa';
import { BsRobot } from "react-icons/bs";
import Button from "../ui/Button.jsx";

const QuestionCard = ({ position, question, onReplay, onStop }: QuestionCardProps) => {
    return (
        <Card>
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <BsRobot className="text-2xl text-accent"/>
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-dark">AI Interviewer is asking...</h2>
                    <p className="text-sm text-muted">Question {String(position).padStart(2, '0')}</p>
                </div>
            </div>

            {/*Divider*/}
            <div className="my-6 border-t border-border"/>

            {/*Interview question*/}
            <p className="text-lg leading-8 text-dark">{question}</p>

            {/*Voice controls*/}
            <div className="mt-8 flex flex-wrap gap-3">
                <Button type="button" variant="ghost" onClick={onReplay}>
                    <FaPlay className="text-lg"/>
                    Read Question
                </Button>

                <Button type="button" variant="ghost" onClick={onStop}>
                    <FaStop className="text-lg" />
                    Stop
                </Button>
            </div>
        </Card>
    );
};

export default QuestionCard;

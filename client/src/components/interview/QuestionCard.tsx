import type { QuestionCardProps } from "../../types/types.js";
import Card from "../ui/Card.jsx";

const QuestionCard = ({ position, question }: QuestionCardProps) => {
    return (
        <Card className="max-w-full">
            <div className="space-y-4">
                <div>
                    <p className="text-sm text-muted">Question {position}</p>
                    <h2 className="mt-2 text-xl font-semibold leading-8 text-dark">
                        {question}
                    </h2>
                </div>
            </div>
        </Card>
    );
};

export default QuestionCard;

import type { InterviewInfoCardProps } from "../../types/types.js";
import Card from "../ui/Card.jsx";

const InterviewInfoCard = ({
    role,
    difficulty,
    qtnsCount,
    currentPosition,
}: InterviewInfoCardProps) => {
    return (
        <Card className="max-w-full p-6">
            <div className="grid gap-5 md:grid-cols-4 justify-center">
                <div>
                    <p className="text-sm text-muted">Role</p>
                    <p className="mt-2 font-semibold text-dark">{role}</p>
                </div>
                <div>
                    <p className="text-sm text-muted">Difficulty</p>
                    <p className="mt-2 font-semibold text-dark capitalize">{difficulty}</p>
                </div>
                <div>
                    <p className="text-sm text-muted">Questions</p>
                    <p className="mt-2 font-semibold text-dark">{qtnsCount}</p>
                </div>
                <div>
                    <p className="text-sm text-muted">Progress</p>
                    <p className="mt-2 font-semibold text-accent">
                        {currentPosition} / {qtnsCount}
                    </p>
                </div>
            </div>
        </Card>
    );
};

export default InterviewInfoCard;

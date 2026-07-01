import { IoTimerSharp } from "react-icons/io5";
import type { InterviewTimerCardProps } from "../../types/types";

const InterviewTimerCard = ({ remainingTime }: InterviewTimerCardProps) => {
    return (
        <div className="flex items-center justify-between rounded-2xl border border-border bg-white p-5">
            <div className="flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-accent/10">
                    <IoTimerSharp className="text-2xl text-accent" />
                </div>

                <div>
                    <h2 className="text-lg font-semibold text-dark">Interview Time Remaining</h2>
                    <p className="text-sm text-muted">
                        Your interview will automatically finish when the timer reaches zero.
                    </p>
                </div>
            </div>

            <div className="rounded-xl bg-accent px-4 py-2 text-xl font-bold text-white shadow-sm tabular-nums">
                {remainingTime}
            </div>
        </div>
    );
};

export default InterviewTimerCard;

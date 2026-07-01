import { IoChatboxEllipses } from "react-icons/io5";
import Card from "../ui/Card.jsx";
import type { ResponseCardProps } from "../../types/types.js";

const ResponseCard = ({ ans, onAnsChange }: ResponseCardProps) => {
    return (
        <Card>
            {/*Heading*/}
            <div className="flex items-center gap-3">
                <IoChatboxEllipses className="text-2xl text-accent"/>
                <div>
                    <h2 className="text-lg font-semibold text-dark">Your Response</h2>
                    <p className="mt-1 text-sm text-muted">
                        Respond naturally, just as you would in a real interview.
                        Your response is automatically saved whenever you change questions.
                    </p>
                </div>
            </div>

            {/*Response textbox*/}
            <textarea
                value={ans}
                onChange={(event) => onAnsChange(event.target.value)}
                rows={12}
                maxLength={10000}
                placeholder="Explain your thoughts..."
                className="
                    mt-6 w-full resize-none rounded-2xl border border-border
                    bg-white p-5 leading-7 outline-none transition focus:border-accent
                "
            />

            {/*Character counter*/}
            <div className="mt-2 flex justify-end">
                <span className="text-sm text-muted">
                    {ans.length}/10000
                </span>
            </div>
        </Card>
    );
};

export default ResponseCard;

import { motion } from "motion/react";
import { USER_PLANS_CREDITS } from "../../constants/app.js";
import type { PlanCardProps } from "../../types/types.js";
import Button from "../ui/Button.jsx";
import Card from "../ui/Card.jsx";

const PlanCard = ({
    plan,
    currentPlan,
    isAuthenticated,
    isPaymentProcessing,
    onClick
}: PlanCardProps) => {
    const isCurrentPlan = currentPlan === plan && isAuthenticated;
    const isFree = plan === 'free';
    const isPopular = plan === 'pro';

    return (
        <motion.div
            whileHover={{ y: -5 }}
            transition={{ duration: 0.4 }}
        >
            <Card
                className={`
                    relative h-full border-2 transition-all
                    ${
                        isCurrentPlan
                        ? "border-primary shadow-xl"
                        : "border-gray-200 hover:border-primary-light"
                    }
                `}
            >

                {
                    isPopular &&
                    <span
                        className="absolute -top-3 right-5 rounded-full bg-accent px-3 py-1 text-xs text-white"
                    >
                        Most Popular
                    </span>
                }

                {
                    isCurrentPlan &&
                    <span
                        className="absolute top-5 right-5 rounded-full bg-primary px-3 py-1 text-xs text-white"
                    >
                        Current Plan
                    </span>
                }

                <div className="flex h-full flex-col">
                    <h2 className="text-2xl font-bold capitalize">{plan}</h2>
                    <p className="mt-5 text-4xl font-bold">₹{USER_PLANS_CREDITS[plan].price / 100}</p>
                    <p className="mt-2 text-gray-600">{USER_PLANS_CREDITS[plan].credits} Credits</p>
                    <div className="mt-8 flex-1">
                        <ul className="space-y-2 text-sm text-gray-600">
                            <li>&#10003; AI Interviews</li>
                            <li>&#10003; Resume Based Questions</li>
                            <li>&#10003; AI Feedback</li>
                            <li>&#10003; AI Based Job Search</li>
                        </ul>
                    </div>

                    {
                        isFree
                        ? (
                            <Button disabled={true} className="mt-8 w-full" >Included at Signup</Button>
                        )
                        : (
                            <Button
                                className="mt-8 w-full"
                                disabled={isCurrentPlan || isPaymentProcessing}
                                onClick={(event) => {
                                    event.stopPropagation();
                                    onClick(plan);
                                }}
                            >
                                {
                                    isCurrentPlan ? "Current Plan" : "Purchase"
                                }
                            </Button>
                        )
                    }
                </div>
            </Card>
        </motion.div>
    );
};

export default PlanCard;

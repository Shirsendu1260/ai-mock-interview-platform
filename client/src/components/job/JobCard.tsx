import Card from "../ui/Card.jsx";
import { FaBuilding, FaLocationDot, FaIndianRupeeSign, FaArrowUpRightFromSquare } from "react-icons/fa6";
import type { JobCardProps } from "../../types/types.js";

const JobCard = ({ job }: JobCardProps) => {
    return (
        <Card className="flex flex-col gap-5">
            <div className="space-y-2">
                <h3 className="text-xl font-semibold text-dark">
                    {job.title}
                </h3>

                <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm text-muted">
                    <div className="flex items-center gap-2">
                        <FaBuilding size={13} />
                        <span>{job.company}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <FaLocationDot size={13} />
                        <span>{job.location}</span>
                    </div>

                    {
                        job.salary && (
                            <div className="flex items-center gap-2">
                                <FaIndianRupeeSign size={13} />
                                <span>{job.salary}</span>
                            </div>
                        )
                    }
                </div>
            </div>

            <p className="line-clamp-4 text-sm leading-7 text-muted">
                {job.description}
            </p>

            <div className="mt-auto flex justify-end">
                <a
                    href={job.redirectUrl}
                    target="_blank"
                    rel="noopener noreferrer nofollow"
                    className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold
                    text-sm bg-accent text-white hover:scale-[1.02] active:scale-[0.98] transition-transform
                    duration-200 shadow-sm hover:shadow-md"
                >
                    Apply
                    <FaArrowUpRightFromSquare size={13} />
                </a>
            </div>
        </Card>
    );
};

export default JobCard;

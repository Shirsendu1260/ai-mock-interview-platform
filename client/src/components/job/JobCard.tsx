import Card from "../ui/Card.jsx";
import { FaBuilding, FaLocationDot, FaIndianRupeeSign, FaArrowUpRightFromSquare } from "react-icons/fa6";
import { FaRegBookmark, FaBookmark } from "react-icons/fa6";
import type { JobCardProps } from "../../types/types.js";

const JobCard = ({
    job,
    isBookmarked = false,
    isBookmarkLoading = false,
    onBookmarkToggle
}: JobCardProps) => {
    return (
        <Card
            className="
                group relative overflow-hidden border border-border
                transition-all duration-300 hover:-translate-y-1 hover:shadow-xl
                flex flex-col h-full
            "
        >
            <div
                className="absolute inset-x-0 top-0 h-1 bg-accent scale-x-0 origin-left
                transition-transform duration-300 group-hover:scale-x-100"
            />

            <div className="flex-1 p-4">
            <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-xl font-bold text-dark">
                        {job.title}
                    </h3>
                    <p className="mt-1 text-base font-semibold text-accent">
                        {job.company}
                    </p>
                </div>

                {
                    onBookmarkToggle && (
                        <button
                            disabled={isBookmarkLoading}
                            onClick={() => onBookmarkToggle(job)}
                            className="
                                rounded-full p-2 transition-colors duration-200
                                hover:bg-accent/10 disabled:opacity-50
                            "
                        >
                            {
                                isBookmarked
                                    ? (
                                        <FaBookmark
                                            size={22}
                                            className="text-accent"
                                        />
                                    )
                                    : (
                                        <FaRegBookmark
                                            size={22}
                                            className="text-muted"
                                        />
                                    )
                            }
                        </button>
                    )
                }
            </div>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
                <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1.5">
                    <FaLocationDot size={12} className="text-accent" />
                    <span>{job.location}</span>
                </div>

                {
                    job.salary && (
                        <div className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1.5 font-medium text-green-700">
                            <FaIndianRupeeSign size={11} />
                            <span>{job.salary}</span>
                        </div>
                    )
                }

                <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5">
                    <FaBuilding size={11} className="text-accent" />
                    <span>{job.company}</span>
                </div>
            </div>

            <p className="mt-5 line-clamp-3 leading-7 text-sm text-muted">
                {job.description}
            </p>
            </div>

            <div className="flex justify-end p-4 pt-0">
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

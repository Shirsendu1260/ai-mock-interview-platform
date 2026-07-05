import { HiChevronLeft, HiChevronRight } from "react-icons/hi2";
import type { PaginationProps } from "../../types/types.js";
import Button from "../ui/Button";

const Pagination = ({
    page,
    totalPages,
    hasPreviousPage,
    hasNextPage,
    onPrevious,
    onNext
}: PaginationProps) => {
    return (
        <div className="mt-8 flex items-center justify-center gap-4">
            <Button
                disabled={!hasPreviousPage}
                onClick={onPrevious}
                className="flex items-center gap-1.5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <HiChevronLeft className="h-4 w-4" />
                Previous
            </Button>
            <span className="min-w-[3.5rem] text-center text-sm font-medium text-slate-600">
                {page} <span className="text-slate-400">/</span> {totalPages || 1}
            </span>
            <Button
                disabled={!hasNextPage}
                onClick={onNext}
                className="flex items-center gap-1.5 px-4 py-2 disabled:cursor-not-allowed disabled:opacity-40"
            >
                Next
                <HiChevronRight className="h-4 w-4" />
            </Button>
        </div>
    );
};

export default Pagination;

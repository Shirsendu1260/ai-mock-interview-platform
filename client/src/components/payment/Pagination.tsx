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
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-5">
            <Button
                disabled={!hasPreviousPage}
                onClick={onPrevious}
                className="disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-inherit"
            >
                Previous
            </Button>
            <span className="min-w-[3.5rem] text-center text-sm font-medium text-slate-600">
                {page} <span className="text-slate-400">/</span> {totalPages || 1}
            </span>
            <Button
                disabled={!hasNextPage}
                onClick={onNext}
                className="disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-inherit"
            >
                Next
            </Button>
        </div>
    );
};

export default Pagination;

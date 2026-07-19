import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
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
        <div className="mt-8 flex flex-row items-center justify-center gap-4">
            <Button
                disabled={!hasPreviousPage}
                onClick={onPrevious}
                className="px-3.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FaChevronLeft size={15} />
            </Button>
            <span className="min-w-[3.5rem] text-center text-sm font-medium text-dark">
                {page} <span className="text-muted">/</span> {totalPages || 1}
            </span>
            <Button
                disabled={!hasNextPage}
                onClick={onNext}
                className="px-3.5 py-1.5 disabled:cursor-not-allowed disabled:opacity-40"
            >
                <FaChevronRight size={15} />
            </Button>
        </div>
    );
};

export default Pagination;

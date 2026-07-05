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
            <Button disabled={!hasPreviousPage} onClick={onPrevious}>
                Previous
            </Button>
            <span className="font-medium text-sm">{page} / {totalPages || 1}</span>
            <Button disabled={!hasNextPage} onClick={onNext}>
                Next
            </Button>
        </div>
    );
};

export default Pagination;

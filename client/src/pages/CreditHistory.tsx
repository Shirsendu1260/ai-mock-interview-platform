import { useEffect, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import SectionHeading from "../components/ui/SectionHeading";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import CreditHistoryTable from "../components/payment/CreditHistoryTable";
import Pagination from "../components/ui/Pagination";
import { getCreditHistoryHandler } from "../handlers/payment.handler";
import type { ICreditHistoryResponse } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { showErrorToast } from "../utils/toast";

const CreditHistory = () => {
    const [page, setPage] = useState(1);
    const [creditHistory, setCreditHistory] = useState<ICreditHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCreditHistory = async () => {
        try {
            setIsLoading(true);
            const response = await getCreditHistoryHandler(page);
            setCreditHistory(response.data);
        }
        catch (error) {
            if (error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Unable to load credit history.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchCreditHistory();
    }, [page]);

    return (
        <PageContainer>
            <SectionHeading
                description="View every credit addition and deduction."
            >
                Credit History
            </SectionHeading>

            {
                isLoading
                ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                )
                : creditHistory && creditHistory.items.length > 0
                    ? (
                        <>
                            <CreditHistoryTable page={creditHistory.page} items={creditHistory.items} />

                            <Pagination
                                page={creditHistory.page}
                                totalPages={creditHistory.totalPages}
                                hasPreviousPage={creditHistory.hasPreviousPage}
                                hasNextPage={creditHistory.hasNextPage}
                                onPrevious={() => setPage(prev => prev - 1)}
                                onNext={() => setPage(prev => prev + 1)}
                            />
                        </>
                    )
                    : (
                        <EmptyState
                            title="No Credit Transactions"
                            description="Credit transactions will appear here once you start using the platform."
                        />
                    )
            }
        </PageContainer>
    );
};

export default CreditHistory;

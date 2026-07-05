import { useEffect, useState } from "react";
import PageContainer from "../components/ui/PageContainer";
import SectionHeading from "../components/ui/SectionHeading";
import Spinner from "../components/ui/Spinner";
import EmptyState from "../components/ui/EmptyState";
import PaymentHistoryTable from "../components/payment/PaymentHistoryTable";
import Pagination from "../components/ui/Pagination";
import { getPaymentHistoryHandler } from "../handlers/payment.handler";
import type { IPaymentHistoryResponse } from "../types/types";
import { ApiError } from "../utils/ApiError";
import { showErrorToast } from "../utils/toast";

const PaymentHistory = () => {
    const [page, setPage] = useState(1);
    const [paymentHistory, setPaymentHistory] = useState<IPaymentHistoryResponse | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const fetchPaymentHistory = async () => {
        try {
            setIsLoading(true);
            const response = await getPaymentHistoryHandler(page);
            setPaymentHistory(response.data);
        }
        catch (error) {
            if (error instanceof ApiError) {
                showErrorToast(error.message);
            }
            else {
                showErrorToast('Unable to load payment history.');
            }
        }
        finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchPaymentHistory();
    }, [page]);

    return (
        <PageContainer>
            <SectionHeading
                description="View every payment you've made."
            >
                Payment History
            </SectionHeading>

            {
                isLoading
                ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                )
                : paymentHistory && paymentHistory.items.length > 0
                    ? (
                        <>
                            <PaymentHistoryTable page={paymentHistory.page} items={paymentHistory.items} />

                            <Pagination
                                page={paymentHistory.page}
                                totalPages={paymentHistory.totalPages}
                                hasPreviousPage={paymentHistory.hasPreviousPage}
                                hasNextPage={paymentHistory.hasNextPage}
                                onPrevious={() => setPage(prev => prev - 1)}
                                onNext={() => setPage(prev => prev + 1)}
                            />
                        </>
                    )
                    : (
                        <EmptyState
                            title="No Payments Yet"
                            description="Your payment history will appear here after purchasing a plan."
                        />
                    )
            }
        </PageContainer>
    );
};

export default PaymentHistory;

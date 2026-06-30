import { useAuthStore } from "../stores/auth.store.js";
import { USER_PLANS } from "../constants/app.js";
import PageContainer from "../components/ui/PageContainer.jsx";
import SectionHeading from "../components/ui/SectionHeading.jsx";
import PlanCard from "../components/payment/PlanCard.jsx";
import type { UserPlan } from "../types/types.js";
import { showErrorToastWithToastId, showLoadingToast, showSuccessToastWithToastId } from "../utils/toast.js";
import { ApiError } from "../utils/ApiError.js";
import { LAYOUT } from "../constants/design.js";

const PaymentPage = () => {
    const user = useAuthStore((state) => state.user);
    const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

    const handlePurchase = (plan: UserPlan) => {
        console.log(plan);
        const planStrFormatted = plan.charAt(0).toUpperCase() + plan.slice(1);
        const toastId = showLoadingToast('Opening Razorpay payment gateway...');

        try {
            showSuccessToastWithToastId(`Payment successful for ${planStrFormatted} plan.`, toastId);
        }
        catch(error) {
            if(error instanceof ApiError) {
                showErrorToastWithToastId(error.message, toastId);
                console.error(`Error ${error.statusCode}: ${error.message}`);
            }
            else {
                showErrorToastWithToastId(`Payment failed for ${planStrFormatted} plan.`, toastId);
                console.error(error);
            }
        }
    };

    return (
        <PageContainer>
            <div className={`mx-auto ${LAYOUT.maxWidth}`}>
                <SectionHeading
                    description="Choose a plan to purchase additional credits."
                >
                    Upgrade Plan
                </SectionHeading>

                <div className="mt-10 grid grid-cols-1 md:grid-cols-2 gap-8">
                    {
                        USER_PLANS.map((plan) => (
                            <PlanCard
                                key={plan}
                                plan={plan}
                                currentPlan={user?.plan ?? 'free'}
                                isAuthenticated={isAuthenticated}
                                onSelect={handlePurchase} // calls handlePurchase(plan) because of the memory reference of onSelect(plan)
                            />
                        ))
                    }
                </div>
            </div>
        </PageContainer>
    );
};

export default PaymentPage;
